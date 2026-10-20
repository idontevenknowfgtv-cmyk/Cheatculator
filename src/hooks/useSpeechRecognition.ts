import { useState, useRef, useCallback } from 'react';

interface SpeechHookReturn {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  audioLevel: number;
}

export function useSpeechRecognition(
  onFinalResult?: (text: string) => void,
  onAudioBlobReady?: (base64Audio: string, mimeType: string) => void
): SpeechHookReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const autoStopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = () => {
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
    if (pulseTimerRef.current) {
      clearInterval(pulseTimerRef.current);
      pulseTimerRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    setAudioLevel(0);
  };

  const stopListening = useCallback(() => {
    setIsListening(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('Error stopping recorder:', e);
      }
    } else {
      cleanup();
    }
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setTranscript('');
    audioChunksRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Microphone not supported on this browser');
      return;
    }

    try {
      // 1. Request microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      audioStreamRef.current = stream;

      // 2. Determine best supported audio format
      let chosenMime = '';
      const typesToTest = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/aac',
        'audio/ogg;codecs=opus',
        '',
      ];

      for (const t of typesToTest) {
        if (!t || (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t))) {
          chosenMime = t;
          break;
        }
      }

      const recorder = chosenMime
        ? new MediaRecorder(stream, { mimeType: chosenMime })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        cleanup();
        setIsListening(false);

        if (audioChunksRef.current.length > 0) {
          const effectiveMime = chosenMime.split(';')[0] || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: effectiveMime });

          const reader = new FileReader();
          reader.onloadend = () => {
            const resultStr = reader.result as string;
            const base64Data = resultStr?.split(',')[1];
            if (base64Data && onAudioBlobReady) {
              onAudioBlobReady(base64Data, effectiveMime);
            }
          };
          reader.readAsDataURL(audioBlob);
        }
      };

      recorder.onerror = (e) => {
        console.error('MediaRecorder error:', e);
        setError('Audio recording failed');
        cleanup();
        setIsListening(false);
      };

      // Start recording
      recorder.start(200); // 200ms slice interval
      setIsListening(true);

      // Pulse animation for mic level
      pulseTimerRef.current = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 4) + 1);
      }, 150);

      // Fast auto-stop after 3.5 seconds if user does not tap STOP
      autoStopTimerRef.current = setTimeout(() => {
        stopListening();
      }, 3500);
    } catch (err: any) {
      console.error('Mic access error:', err);
      cleanup();
      setIsListening(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission blocked. Please allow mic access.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No microphone found on device.');
      } else {
        setError(err.message || 'Could not start microphone');
      }
    }
  }, [onAudioBlobReady, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    isSupported: true,
    error,
    startListening,
    stopListening,
    resetTranscript,
    audioLevel,
  };
}
