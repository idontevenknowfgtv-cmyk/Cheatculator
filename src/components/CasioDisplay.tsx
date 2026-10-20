import React from 'react';
import { Mic, EyeOff, AlertCircle } from 'lucide-react';
import { CalculatorTheme, ScreenAspect, ViewMode } from '../types';

interface CasioDisplayProps {
  theme: CalculatorTheme;
  aspect: ScreenAspect;
  viewMode: ViewMode;
  isPanic: boolean;
  onTogglePanic: () => void;
  isListening: boolean;
  onToggleMic: () => void;
  audioLevel: number;
  isLoading: boolean;
  queryText: string;
  answerText: string;
  decoyExpression: string;
  decoyResult: string;
  speechError: string | null;
  onScreenTap?: () => void;
}

export const CasioDisplay: React.FC<CasioDisplayProps> = ({
  theme,
  aspect,
  viewMode,
  isPanic,
  onTogglePanic,
  isListening,
  onToggleMic,
  audioLevel,
  isLoading,
  queryText,
  answerText,
  decoyExpression,
  decoyResult,
  speechError,
  onScreenTap,
}) => {
  // Theme color definitions matching authentic Casio LCD panels
  const themeStyles = {
    classwiz: {
      bg: 'bg-[#d0d9c8]',
      bezelBg: 'bg-[#1e2326]',
      border: 'border-[#717e6b]',
      text: 'text-[#142017]',
      grid: 'lcd-grid-pattern',
      micActive: 'bg-[#b91c1c] text-white',
      micIdle: 'bg-[#142017]/10 hover:bg-[#142017]/20 text-[#142017] border border-[#142017]/25',
      panicBtn: 'bg-[#7f1d1d] hover:bg-[#991b1b] text-white border border-red-900',
      glassShine: 'from-white/15 via-transparent to-black/10',
    },
    olive: {
      bg: 'bg-[#b8c99d]',
      bezelBg: 'bg-[#181d1a]',
      border: 'border-[#61744b]',
      text: 'text-[#0f2112]',
      grid: 'lcd-grid-pattern',
      micActive: 'bg-[#991b1b] text-white',
      micIdle: 'bg-[#0f2112]/10 hover:bg-[#0f2112]/20 text-[#0f2112] border border-[#0f2112]/25',
      panicBtn: 'bg-[#78350f] hover:bg-[#92400e] text-white border border-amber-900',
      glassShine: 'from-white/15 via-transparent to-black/15',
    },
    dark: {
      bg: 'bg-[#0a0f0c]',
      bezelBg: 'bg-[#050806]',
      border: 'border-[#1b3823]',
      text: 'text-[#34d399]',
      grid: 'lcd-grid-pattern-dark',
      micActive: 'bg-[#dc2626] text-white',
      micIdle: 'bg-[#34d399]/15 hover:bg-[#34d399]/25 text-[#34d399] border border-[#34d399]/30',
      panicBtn: 'bg-[#991b1b] hover:bg-[#b91c1c] text-white border border-red-800',
      glassShine: 'from-emerald-400/5 via-transparent to-black/40',
    },
  }[theme];

  // Aspect ratio styling
  const aspectClass = {
    '192x63': 'aspect-[192/63]', // Exact Casio fx-991EX ClassWiz LCD ratio (~3.05:1)
    'fx991es': 'aspect-[310/96]', // fx-991ES Plus (~3.23:1)
    'fill': 'w-full h-full min-h-[160px]',
  }[aspect];

  // When panic is active, show the harmless decoy expression and result.
  // When idle and not in panic, keep it clean/blank.
  const displayedExpr = isPanic
    ? decoyExpression
    : isListening && !queryText
      ? 'SPEAK NOW...'
      : queryText;
  const displayedAns = isPanic ? decoyResult : answerText;

  return (
    <div className="w-full flex justify-center items-start select-none">
      {/* CASIO DISPLAY CONTAINER */}
      <div
        className={`w-full max-w-3xl transition-all duration-300 ${
          viewMode === 'screen-only'
            ? 'p-0 bg-transparent'
            : `rounded-b-xl p-2 sm:p-3 pt-1 ${themeStyles.bezelBg} shadow-2xl border-x-2 border-b-2 border-gray-800`
        } relative`}
        style={
          viewMode === 'screen-only'
            ? {}
            : {
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7)',
              }
        }
      >
        {/* Casio fx-991MS header branding (matching user's calculator photo) */}
        {viewMode !== 'screen-only' && (
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-400 font-casio-sub mb-1 px-1 tracking-wider">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-gray-200 tracking-widest text-[11px] sm:text-xs">CASIO</span>
              <span className="font-mono text-gray-300 font-bold">fx-991MS</span>
              <span className="text-[#facc15] font-bold text-[9px] tracking-tight">S-V.P.A.M.</span>
            </div>
            {/* Real fx-991MS red-amber solar panel strip */}
            <div className="flex items-center space-x-0.5 bg-black/80 px-2 py-0.5 rounded border border-gray-700/80" title="TWO WAY POWER">
              <div className="w-2.5 sm:w-3.5 h-2 bg-[#5c1c18] border-r border-[#3a100d]" />
              <div className="w-2.5 sm:w-3.5 h-2 bg-[#5c1c18] border-r border-[#3a100d]" />
              <div className="w-2.5 sm:w-3.5 h-2 bg-[#5c1c18]" />
              <span className="text-[7px] text-gray-400 pl-1 font-mono hidden sm:inline">TWO WAY POWER</span>
            </div>
          </div>
        )}

        {/* INNER LCD SCREEN: Blank except for HIDE and MIC */}
        <div
          onClick={onScreenTap}
          className={`relative w-full ${aspectClass} ${themeStyles.bg} ${themeStyles.text} ${
            viewMode === 'screen-only' ? 'rounded-none border-2' : 'rounded-md border-4'
          } ${themeStyles.border} overflow-hidden shadow-inner cursor-pointer transition-colors duration-200 flex flex-col justify-between p-2 sm:p-3`}
          style={{
            boxShadow: 'inset 0 3px 12px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Authentic LCD dot grid texture */}
          <div className={`absolute inset-0 pointer-events-none ${themeStyles.grid} opacity-60 z-0`} />

          {/* Glass glare highlight */}
          <div className={`absolute inset-0 pointer-events-none bg-gradient-to-tr ${themeStyles.glassShine} opacity-70 z-0`} />

          {/* TOP CONTROLS: BLANK EXCEPT FOR HIDE AND MIC */}
          <div className="relative z-10 flex items-center justify-end leading-none">
            {!isPanic ? (
              <div className="flex items-center space-x-2 sm:space-x-2.5">
                {/* BUSY indicator (only when Gemini is answering) */}
                {isLoading && (
                  <span className="animate-pulse bg-current text-white dark:text-black px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold font-casio-mono">
                    BUSY
                  </span>
                )}

                {/* MIC BUTTON (Enlarged for quick phone touch) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMic();
                  }}
                  title={isListening ? 'Click when done speaking' : 'Click to speak to Gemini'}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold tracking-tight transition-all active:scale-95 shadow-md font-casio-mono uppercase ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-400'
                      : `${themeStyles.micIdle}`
                  }`}
                >
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{isListening ? '● STOP' : 'MIC'}</span>
                  {isListening && (
                    <span className="font-mono text-[10px] tracking-tighter">
                      {Array.from({ length: 4 }, (_, i) => (i < audioLevel ? '█' : '░')).join('')}
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
                  title="INSTANT PANIC HIDE (Type 3.141 or 3141 to unhide)"
                  className={`flex items-center gap-1.5 ${themeStyles.panicBtn} px-3 py-1.5 rounded-md text-xs sm:text-sm font-black tracking-wider uppercase transition-all shadow-md active:scale-90 font-casio-mono`}
                >
                  <EyeOff className="w-4 h-4" />
                  <span>HIDE</span>
                </button>
              </div>
            ) : (
              /* IN PANIC HIDE MODE: Secret restore dot only, no mic/hide */
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePanic();
                  }}
                  title="Stealth restore (or press Esc/Space)"
                  className="opacity-15 hover:opacity-100 text-[10px] p-0.5 rounded transition-opacity"
                >
                  ●
                </button>
              </div>
            )}
          </div>

          {/* MAIN UPPER EXPRESSION / PROMPT LINE */}
          <div className="relative z-10 my-auto py-1 font-casio-mono text-base sm:text-xl md:text-2xl leading-tight break-words">
            {displayedExpr ? (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="whitespace-pre-wrap">{displayedExpr}</span>
                  {!isPanic && !isLoading && (
                    <span className="inline-block w-2.5 h-5 ml-1 bg-current animate-pulse align-middle" />
                  )}
                </div>

                {isLoading && !isPanic && (
                  <div className="flex space-x-1 items-center text-xs sm:text-sm pl-2">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce [animation-delay:0.15s]">●</span>
                    <span className="animate-bounce [animation-delay:0.3s]">●</span>
                  </div>
                )}
              </div>
            ) : (
              /* When idle, screen is completely blank */
              <div className="h-6" />
            )}

            {speechError && !isPanic && (
              <div className="text-[10px] sm:text-xs text-red-700 dark:text-red-400 mt-1 flex items-center gap-1 font-sans">
                <AlertCircle className="w-3 h-3" />
                <span>{speechError}</span>
              </div>
            )}
          </div>

          {/* LOWER ANSWER LINE: Direct answer only */}
          <div className="relative z-10 flex items-baseline justify-end min-h-[32px] sm:min-h-[40px] font-casio-mono">
            {displayedAns && (
              <div className="text-right">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-normal leading-none font-casio-mono">
                  {displayedAns}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
