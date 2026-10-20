import React, { useState, useEffect, useCallback } from 'react';
import { CasioDisplay } from './components/CasioDisplay';
import { CasioKeypad } from './components/CasioKeypad';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { playTone } from './utils/audioBeep';
import { evaluateCasioExpression } from './utils/calculatorEngine';
import { QueryRecord } from './types';

export default function App() {
  const [isPanic, setIsPanic] = useState(false);
  const [panicExpression, setPanicExpression] = useState('');
  const [panicResult, setPanicResult] = useState('');

  // Gemini & calculator state: starts completely blank except for HIDE & MIC
  const [queryText, setQueryText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [lastEvaluated, setLastEvaluated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Send text query to Gemini
  const submitToGemini = useCallback(async (textToSubmit: string) => {
    if (!textToSubmit || !textToSubmit.trim()) return;

    setIsLoading(true);
    setApiError(null);
    playTone(1800, 'sine', 0.04);

    try {
      const response = await fetch('/api/gemini/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSubmit.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Calculation error');
      }

      setAnswerText(data.answer);
      playTone(2400, 'square', 0.04);
    } catch (err: any) {
      console.error('Gemini text query error:', err);
      setAnswerText('Math ERROR');
      setApiError(err?.message || 'Error communicating with Gemini');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send direct audio query to Gemini (failsafe on all mobile browsers)
  const submitAudioToGemini = useCallback(async (base64Audio: string, mimeType: string) => {
    if (!base64Audio) return;

    setIsLoading(true);
    setApiError(null);
    setQueryText('Calculating...');
    playTone(1800, 'sine', 0.04);

    try {
      const response = await fetch('/api/gemini/audio-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: base64Audio, mimeType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Audio query failed');
      }

      if (data.query) {
        setQueryText(data.query);
      }
      setAnswerText(data.answer);
      playTone(2400, 'square', 0.04);
    } catch (err: any) {
      console.error('Gemini audio query error:', err);
      setAnswerText('Math ERROR');
      setApiError(err?.message || 'Error processing audio');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Speech recognition hook with direct audio fallback
  const handleFinalSpeech = useCallback((spokenText: string) => {
    if (!spokenText.trim()) return;
    setQueryText(spokenText);
    submitToGemini(spokenText);
  }, [submitToGemini]);

  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
    audioLevel,
  } = useSpeechRecognition(handleFinalSpeech, submitAudioToGemini);

  // Sync live transcript while speaking
  useEffect(() => {
    if (isListening && transcript) {
      setQueryText(transcript);
    }
  }, [isListening, transcript]);

  // Toggle mic handler
  const handleToggleMic = useCallback(() => {
    if (isPanic) {
      setIsPanic(false);
    }
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setAnswerText('');
      playTone(2000, 'sine', 0.03);
      startListening();
    }
  }, [isListening, isPanic, startListening, stopListening, resetTranscript]);

  // Toggle Panic Mode (Instant Hide)
  const handleTogglePanic = useCallback(() => {
    setIsPanic((prev) => {
      const next = !prev;
      if (next) {
        if (isListening) {
          stopListening();
        }
        setPanicExpression('0');
        setPanicResult('');
        playTone(1200, 'square', 0.02);
      } else {
        setPanicExpression('');
        setPanicResult('');
        playTone(2600, 'sine', 0.03);
      }
      return next;
    });
  }, [isListening, stopListening]);

  // Check if string matches four digits of pi (3.141, 3141, or 3.14)
  const isPiCode = (str: string) => {
    const cleaned = str.replace(/\s+/g, '');
    return (
      cleaned.endsWith('3.141') ||
      cleaned.endsWith('3141') ||
      cleaned.endsWith('3.14') ||
      cleaned.endsWith('3.1415')
    );
  };

  // Key press handler (working keys: 0-9, ., +, -, *, /, =, DEL, AC)
  const handleKeyPress = (key: string) => {
    // If in Panic / Hide Mode: typing four digits of pi will unhide it!
    if (isPanic) {
      if (key === 'AC') {
        setPanicExpression('0');
        setPanicResult('');
        return;
      }
      if (key === 'DEL') {
        setPanicExpression((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
        return;
      }
      if (key === '=') {
        if (panicExpression && panicExpression !== '0') {
          setPanicResult(evaluateCasioExpression(panicExpression));
        }
        return;
      }

      // Append number / operator to panic expression
      const base = panicExpression === '0' && key !== '.' ? '' : panicExpression;
      const nextTyped = base + key;
      setPanicExpression(nextTyped);

      // Check if four digits of pi were entered to UNHIDE
      if (isPiCode(nextTyped)) {
        setIsPanic(false);
        setPanicExpression('');
        setPanicResult('');
        playTone(2800, 'sine', 0.06);
      }
      return;
    }

    if (key === 'AC') {
      // Clear display back to blank
      setQueryText('');
      setAnswerText('');
      resetTranscript();
      setLastEvaluated(false);
      return;
    }

    if (key === 'DEL') {
      if (lastEvaluated) {
        setQueryText('');
        setAnswerText('');
        setLastEvaluated(false);
      } else {
        setQueryText((prev) => prev.slice(0, -1));
      }
      return;
    }

    if (key === '=') {
      if (!queryText.trim()) return;
      const res = evaluateCasioExpression(queryText);
      setAnswerText(res);
      setLastEvaluated(true);
      return;
    }

    // Number or operator pressed
    if (lastEvaluated) {
      if (['+', '−', '×', '÷'].includes(key)) {
        setQueryText((answerText || '0') + ' ' + key + ' ');
      } else {
        setQueryText(key === 'Ans' ? (answerText || '0') : key);
      }
      setAnswerText('');
      setLastEvaluated(false);
    } else {
      if (['+', '−', '×', '÷'].includes(key)) {
        setQueryText((prev) => prev + ' ' + key + ' ');
      } else if (key === 'Ans') {
        setQueryText((prev) => prev + (answerText || '0'));
      } else {
        setQueryText((prev) => prev + key);
      }
    }
  };

  // Keyboard hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space' || e.code === 'Escape' || e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleTogglePanic();
      } else if (e.key.toLowerCase() === 'v' || e.key.toLowerCase() === 'm') {
        e.preventDefault();
        handleToggleMic();
      } else if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === '+') {
        handleKeyPress('+');
      } else if (e.key === '-') {
        handleKeyPress('−');
      } else if (e.key === '*' || e.key === 'x') {
        handleKeyPress('×');
      } else if (e.key === '/') {
        handleKeyPress('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        handleKeyPress('=');
      } else if (e.key === 'Backspace') {
        handleKeyPress('DEL');
      } else if (e.key.toLowerCase() === 'c') {
        handleKeyPress('AC');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePanic, handleToggleMic, queryText, answerText, lastEvaluated, isPanic, panicExpression]);

  // Screen click handler
  const handleScreenTap = () => {
    if (isPanic) {
      return;
    }
    if (!isListening && !isLoading) {
      handleToggleMic();
    }
  };

  return (
    <div className="h-[100dvh] w-full max-w-md mx-auto bg-[#181d22] text-white flex flex-col justify-between overflow-hidden font-sans select-none shadow-2xl">
      {/* 1. TOP CASIO FX-991MS DISPLAY (Blank except for enlarged MIC and HIDE buttons) */}
      <div className="w-full pt-1 px-1.5 flex-shrink-0">
        <CasioDisplay
          theme="classwiz"
          aspect="192x63"
          viewMode="full-calculator"
          isPanic={isPanic}
          onTogglePanic={handleTogglePanic}
          isListening={isListening}
          onToggleMic={handleToggleMic}
          audioLevel={audioLevel}
          isLoading={isLoading}
          queryText={isPanic ? panicExpression : queryText}
          answerText={isPanic ? panicResult : answerText}
          decoyExpression={panicExpression || '0'}
          decoyResult={panicResult || ''}
          speechError={speechError || apiError}
          onScreenTap={handleScreenTap}
        />
      </div>

      {/* 2. AUTHENTIC CASIO KEYPAD (Functional numbers, +, -, *, /, =, DEL, AC) */}
      <div className="flex-1 w-full flex flex-col justify-end overflow-hidden px-1 pb-1">
        <CasioKeypad
          onKeyPress={handleKeyPress}
          onPanicHide={handleTogglePanic}
        />
      </div>

      {/* NO BOTTOM UIs - PURE CLEAN CALCULATOR ONLY */}
    </div>
  );
}
