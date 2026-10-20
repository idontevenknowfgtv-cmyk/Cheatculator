import React, { useState, useEffect, useRef } from 'react';
import { Mic, EyeOff, AlertCircle, Move, RotateCcw, Settings, Check } from 'lucide-react';
import { playCasioBeep, playTone } from '../utils/audioBeep';
import { evaluateCasioExpression } from '../utils/calculatorEngine';

interface CasioPhotoCalculatorProps {
  isPanic: boolean;
  onTogglePanic: () => void;
  isListening: boolean;
  onToggleMic: () => void;
  audioLevel: number;
  isLoading: boolean;
  queryText: string;
  answerText: string;
  speechError: string | null;
  onKeyPress: (key: string) => void;
  onScreenTap?: () => void;
}

export const CasioPhotoCalculator: React.FC<CasioPhotoCalculatorProps> = ({
  isPanic,
  onTogglePanic,
  isListening,
  onToggleMic,
  audioLevel,
  isLoading,
  queryText,
  answerText,
  speechError,
  onKeyPress,
  onScreenTap,
}) => {
  // Screen alignment offsets for aligning with physical calculator cutout
  const [screenOffsetY, setScreenOffsetY] = useState<number>(0);
  const [screenScale, setScreenScale] = useState<number>(100);
  const [showAdjust, setShowAdjust] = useState<boolean>(false);

  // Load saved calibration if any
  useEffect(() => {
    try {
      const savedY = localStorage.getItem('casio_offset_y');
      const savedScale = localStorage.getItem('casio_screen_scale');
      if (savedY) setScreenOffsetY(parseFloat(savedY));
      if (savedScale) setScreenScale(parseFloat(savedScale));
    } catch (e) {}
  }, []);

  const handleSaveCalibration = (y: number, s: number) => {
    setScreenOffsetY(y);
    setScreenScale(s);
    try {
      localStorage.setItem('casio_offset_y', y.toString());
      localStorage.setItem('casio_screen_scale', s.toString());
    } catch (e) {}
  };

  const handleKeyTouch = (key: string, e?: React.TouchEvent | React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    playCasioBeep(2400, 0.015, 0.08);
    onKeyPress(key);
  };

  return (
    <div className="relative w-full h-[100dvh] max-w-[480px] mx-auto bg-black overflow-hidden flex items-center justify-center select-none touch-manipulation">
      {/* 1. PHOTOGRAPH OF THE USER'S CASIO FX-991MS CALCULATOR */}
      <div className="relative w-full h-full max-h-[100dvh] flex items-center justify-center">
        <div className="relative w-full h-full max-w-[430px] flex items-center justify-center">
          <img
            src="/assets/aistudio/Casio-FX-991MS_6bcb36f3.jpg"
            alt="Casio fx-991MS"
            className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
          />

          {/* 2. LIVE INTERACTIVE LCD SCREEN EMBEDDED PRECISELY IN THE PHOTO'S DISPLAY CUTOUT */}
          {/*
              Coordinates on the Casio-FX-991MS 700x700 image:
              Screen starts at top ~17.8%, left ~29.2%, width ~41.6%, height ~11.8%
          */}
          <div
            onClick={onScreenTap}
            className="absolute z-20 overflow-hidden flex flex-col justify-between p-1.5 cursor-pointer"
            style={{
              top: `calc(17.8% + ${screenOffsetY}px)`,
              left: '29.2%',
              width: `${41.6 * (screenScale / 100)}%`,
              height: `${11.8 * (screenScale / 100)}%`,
              backgroundColor: '#d6dfd3',
              boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.6)',
              borderRadius: '2px',
            }}
          >
            {/* Casio LCD dot grid texture */}
            <div className="absolute inset-0 pointer-events-none lcd-grid-pattern opacity-60 z-0" />
            <div className="absolute inset-0 pointer-events-none lcd-glass-glare opacity-50 z-0" />

            {/* TOP BAR: BLANK EXCEPT FOR HIDE AND MIC */}
            <div className="relative z-10 flex items-center justify-end leading-none">
              {!isPanic ? (
                <div className="flex items-center space-x-1">
                  {/* BUSY indicator when Gemini is generating */}
                  {isLoading && (
                    <span className="animate-pulse bg-[#142017] text-[#d6dfd3] px-1 py-0.2 rounded text-[8px] sm:text-[9px] font-bold font-casio-mono">
                      BUSY
                    </span>
                  )}

                  {/* ENLARGED MIC BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMic();
                    }}
                    title={isListening ? 'Stop listening' : 'Speak to Gemini'}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-black font-casio-mono transition-all active:scale-95 shadow-sm uppercase ${
                      isListening
                        ? 'bg-[#b91c1c] text-white animate-pulse ring-1 ring-red-400'
                        : 'bg-[#142017]/15 hover:bg-[#142017]/25 text-[#142017] border border-[#142017]/30'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isListening ? 'REC' : 'MIC'}</span>
                    {isListening && (
                      <span className="font-mono text-[8px] tracking-tighter">
                        {Array.from({ length: 3 }, (_, i) => (i < audioLevel ? '█' : '░')).join('')}
                      </span>
                    )}
                  </button>

                  {/* HIDE BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePanic();
                    }}
                    title="Panic Hide (Type 3.141 to unhide)"
                    className="flex items-center gap-0.5 bg-[#781f19] hover:bg-[#922822] text-white px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-black font-casio-mono uppercase shadow-sm active:scale-90"
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>HIDE</span>
                  </button>
                </div>
              ) : (
                /* IN PANIC HIDE MODE: Completely hidden controls (secret tap to unhide or type 3.141) */
                <div className="flex items-center space-x-1">
                  <span className="text-[7px] text-[#142017]/30 font-mono">D</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePanic();
                    }}
                    title="Stealth restore"
                    className="opacity-10 hover:opacity-80 text-[8px] text-[#142017] p-0.5"
                  >
                    ●
                  </button>
                </div>
              )}
            </div>

            {/* UPPER QUERY LINE */}
            <div className="relative z-10 my-auto font-casio-mono text-[#142017] text-xs sm:text-sm md:text-base leading-tight break-words">
              {queryText ? (
                <div className="flex items-start justify-between">
                  <span className="whitespace-pre-wrap">{queryText}</span>
                  {!isPanic && !isLoading && (
                    <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#142017] animate-pulse align-middle" />
                  )}
                </div>
              ) : (
                <div className="h-4" />
              )}

              {speechError && !isPanic && (
                <div className="text-[8px] text-red-800 flex items-center gap-0.5 font-sans">
                  <AlertCircle className="w-2.5 h-2.5" />
                  <span>{speechError}</span>
                </div>
              )}
            </div>

            {/* LOWER DIRECT ANSWER LINE: Zero filler */}
            <div className="relative z-10 flex items-baseline justify-end font-casio-mono text-[#142017]">
              {answerText && (
                <div className="text-right text-lg sm:text-xl md:text-2xl font-black tracking-normal leading-none font-casio-mono">
                  {answerText}
                </div>
              )}
            </div>
          </div>

          {/* 3. INVISIBLE WORKING TOUCH ZONES MAPPED DIRECTLY OVER THE PHOTO'S BUTTONS */}
          {/* Working keys: 7, 8, 9, DEL, AC, 4, 5, 6, *, /, 1, 2, 3, +, -, 0, ., EXP, Ans, = */}
          <div
            className="absolute z-20 pointer-events-auto"
            style={{
              top: '67.0%',
              left: '29.0%',
              width: '42.0%',
              height: '27.5%',
            }}
          >
            {/* ROW 1: 7, 8, 9, DEL, AC */}
            <div className="grid grid-cols-5 h-[23%] gap-1">
              <button
                type="button"
                onClick={(e) => handleKeyTouch('7', e)}
                className="w-full h-full active:bg-white/30 rounded focus:outline-none"
                title="7"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('8', e)}
                className="w-full h-full active:bg-white/30 rounded focus:outline-none"
                title="8"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('9', e)}
                className="w-full h-full active:bg-white/30 rounded focus:outline-none"
                title="9"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('DEL', e)}
                className="w-full h-full active:bg-red-400/40 rounded focus:outline-none"
                title="DEL"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('AC', e)}
                onDoubleClick={onTogglePanic}
                className="w-full h-full active:bg-red-400/40 rounded focus:outline-none"
                title="AC"
              />
            </div>

            {/* ROW 2: 4, 5, 6, ×, ÷ */}
            <div className="grid grid-cols-5 h-[23%] gap-1 mt-[2%]">
              <button
                type="button"
                onClick={(e) => handleKeyTouch('4', e)}
                className="w-full h-full active:bg-white/30 rounded focus:outline-none"
                title="4"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('5', e)}
                className="w-full h-full active:bg-white/30 rounded focus:outline-none"
                title="5"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('6', e)}
                className="w-full h-full active:bg-white/30 rounded focus:outline-none"
                title="6"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('×', e)}
                className="w-full h-full active:bg-amber-400/30 rounded focus:outline-none"
                title="×"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('÷', e)}
                className="w-full h-full active:bg-amber-400/30 rounded focus:outline-none"
                title="÷"
              />
            </div>

            {/* ROW 3: 1, 2, 3, +, − */}
            <div className="grid grid-cols-5 h-[23%] gap-1 mt-[2%]">
              <button
                type="button"
                onClick={(e) => handleKeyTouch('1', e)}
                className="w-full h-full active:bg-white/30 rounded focus:outline-none"
                title="1"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('2', e)}
                className="w-full h-full active:bg-white/30 rounded focus:outline-none"
                title="2"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('3', e)}
                className="w-full h-full active:bg-white/30 rounded focus:outline-none"
                title="3"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('+', e)}
                className="w-full h-full active:bg-amber-400/30 rounded focus:outline-none"
                title="+"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('−', e)}
                className="w-full h-full active:bg-amber-400/30 rounded focus:outline-none"
                title="−"
              />
            </div>

            {/* ROW 4: 0, ., EXP, Ans, = */}
            <div className="grid grid-cols-5 h-[23%] gap-1 mt-[2%]">
              <button
                type="button"
                onClick={(e) => handleKeyTouch('0', e)}
                className="w-full h-full active:bg-white/30 rounded focus:outline-none"
                title="0"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('.', e)}
                className="w-full h-full active:bg-white/30 rounded focus:outline-none"
                title="."
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('Ans', e)}
                className="w-full h-full active:bg-white/30 rounded focus:outline-none"
                title="EXP"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('Ans', e)}
                className="w-full h-full active:bg-white/30 rounded focus:outline-none"
                title="Ans"
              />
              <button
                type="button"
                onClick={(e) => handleKeyTouch('=', e)}
                className="w-full h-full active:bg-white/40 rounded focus:outline-none"
                title="="
              />
            </div>
          </div>

          {/* SECRET ADJUSTMENT / ALIGNMENT TRIGGER (Triple-tap solar cell or tiny gear) */}
          <button
            type="button"
            onClick={() => setShowAdjust(!showAdjust)}
            className="absolute top-2 right-2 z-30 opacity-15 hover:opacity-100 bg-black/60 p-1.5 rounded-full text-white transition-opacity"
            title="Adjust screen position to fit your physical frame"
          >
            <Move className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CALIBRATION / NUDGE OVERLAY (To align screen cutout with user's physical calculator frame) */}
      {showAdjust && (
        <div className="absolute bottom-2 left-2 right-2 z-40 bg-[#161b22]/95 border border-gray-700 rounded-xl p-3 text-xs text-white shadow-2xl backdrop-blur-md">
          <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-700">
            <span className="font-bold flex items-center gap-1.5 text-emerald-400">
              <Move className="w-3.5 h-3.5" />
              <span>Frame Cutout Alignment</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAdjust(false)}
              className="px-2 py-0.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 font-bold"
            >
              ✕ Done
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Vertical Position (Y Offset):</span>
                <span className="font-mono text-emerald-400">{screenOffsetY}px</span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                step="1"
                value={screenOffsetY}
                onChange={(e) => handleSaveCalibration(parseInt(e.target.value), screenScale)}
                className="w-full accent-emerald-500 h-1.5 bg-gray-700 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Screen Scale / Size:</span>
                <span className="font-mono text-emerald-400">{screenScale}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="125"
                step="1"
                value={screenScale}
                onChange={(e) => handleSaveCalibration(screenOffsetY, parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-gray-700 rounded cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center pt-1 text-[10px] text-gray-400">
              <span>Nudge until the screen fits your physical frame cutout.</span>
              <button
                type="button"
                onClick={() => handleSaveCalibration(0, 100)}
                className="flex items-center gap-1 bg-gray-800 px-2 py-0.5 rounded text-gray-300"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
