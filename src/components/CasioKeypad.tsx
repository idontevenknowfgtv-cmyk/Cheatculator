import React from 'react';
import { playCasioBeep } from '../utils/audioBeep';

interface CasioKeypadProps {
  onKeyPress: (key: string) => void;
  onPanicHide: () => void;
}

export const CasioKeypad: React.FC<CasioKeypadProps> = ({
  onKeyPress,
  onPanicHide,
}) => {
  // Working keys: numbers, operators, DEL, AC, equals
  const handleWorkingKey = (key: string, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.preventDefault();
    playCasioBeep(2400, 0.015, 0.08);
    onKeyPress(key);
  };

  // Decorative scientific keys: look 100% like a real Casio fx-991, but inactive (just a light click)
  const handleDummyKey = (label: string, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.preventDefault();
    playCasioBeep(1800, 0.01, 0.03); // subtle dummy click
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between bg-[#191e22] px-2.5 py-1.5 text-white select-none rounded-b-2xl border-t border-gray-800 touch-manipulation">
      {/* DECORATIVE TOP FUNCTION ROW (Real Casio fx-991 look) */}
      <div className="grid grid-cols-5 gap-1.5 items-center my-0.5">
        <div className="flex flex-col items-center">
          <span className="text-[7px] text-[#eab308] font-bold font-casio-sub uppercase">Shift</span>
          <button
            type="button"
            onClick={(e) => handleDummyKey('SHIFT', e)}
            className="w-full py-1 rounded bg-[#2b3036] text-[10px] font-bold text-[#eab308] calc-btn-bevel opacity-85 active:opacity-100"
          >
            SHIFT
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[7px] text-[#f43f5e] font-bold font-casio-sub uppercase">Alpha</span>
          <button
            type="button"
            onClick={(e) => handleDummyKey('ALPHA', e)}
            className="w-full py-1 rounded bg-[#2b3036] text-[10px] font-bold text-[#f43f5e] calc-btn-bevel opacity-85 active:opacity-100"
          >
            ALPHA
          </button>
        </div>

        {/* SILVER REPLAY D-PAD */}
        <div className="flex justify-center">
          <div className="relative w-11 h-9 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 rounded-full border border-gray-400 shadow-sm flex items-center justify-center p-0.5 cursor-pointer">
            <span className="text-[6px] font-bold text-gray-800 tracking-tighter">REPLAY</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[7px] text-gray-400 font-casio-sub">SETUP</span>
          <button
            type="button"
            onClick={(e) => handleDummyKey('MENU', e)}
            className="w-full py-1 rounded bg-[#2b3036] text-[10px] font-medium text-gray-300 calc-btn-bevel opacity-85"
          >
            MENU
          </button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[7px] text-gray-400 font-casio-sub">RESET</span>
          <button
            type="button"
            onClick={(e) => handleWorkingKey('AC', e)}
            className="w-full py-1 rounded bg-[#333a42] text-[10px] font-bold text-emerald-400 calc-btn-bevel"
          >
            ON
          </button>
        </div>
      </div>

      {/* DECORATIVE SCIENTIFIC ROWS (Authentic Casio aesthetic, non-functional) */}
      <div className="grid grid-cols-6 gap-1 my-0.5 opacity-60">
        {['OPTN', 'CALC', '∫dx', 'x⁻¹', 'log_b', 'ln'].map((label) => (
          <button
            key={label}
            type="button"
            onClick={(e) => handleDummyKey(label, e)}
            className="py-0.5 rounded bg-[#23272c] text-[9px] font-mono calc-btn-bevel text-gray-300"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-1 my-0.5 opacity-60">
        {['■/□', '√■', 'x²', 'x^■', 'log', 'sin'].map((label) => (
          <button
            key={label}
            type="button"
            onClick={(e) => handleDummyKey(label, e)}
            className="py-0.5 rounded bg-[#23272c] text-[9px] font-mono calc-btn-bevel text-gray-300"
          >
            {label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* WORKING KEYS: MATCHING CASIO FX-991MS COLOR SCHEME */}
      {/* ============================================================== */}
      
      {/* ROW 1: 7, 8, 9, DEL, AC */}
      <div className="grid grid-cols-5 gap-1.5 my-1">
        <button
          type="button"
          onClick={(e) => handleWorkingKey('7', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-lg font-black calc-btn-bevel text-[#121820]"
        >
          7
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('8', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-lg font-black calc-btn-bevel text-[#121820]"
        >
          8
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('9', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-lg font-black calc-btn-bevel text-[#121820]"
        >
          9
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('DEL', e)}
          className="py-2.5 sm:py-3 rounded bg-[#e05360] active:bg-[#f06471] text-xs sm:text-sm font-black text-white calc-btn-bevel shadow-sm"
        >
          DEL
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('AC', e)}
          onDoubleClick={onPanicHide}
          title="Clear screen (Double click: Panic Hide)"
          className="py-2.5 sm:py-3 rounded bg-[#e05360] active:bg-[#f06471] text-xs sm:text-sm font-black text-white calc-btn-bevel shadow-sm ring-1 ring-red-300/40"
        >
          AC
        </button>
      </div>

      {/* ROW 2: 4, 5, 6, ×, ÷ */}
      <div className="grid grid-cols-5 gap-1.5 my-1">
        <button
          type="button"
          onClick={(e) => handleWorkingKey('4', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-lg font-black calc-btn-bevel text-[#121820]"
        >
          4
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('5', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-lg font-black calc-btn-bevel text-[#121820]"
        >
          5
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('6', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-lg font-black calc-btn-bevel text-[#121820]"
        >
          6
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('×', e)}
          className="py-2.5 sm:py-3 rounded bg-[#252a30] active:bg-[#343b44] text-lg font-black calc-btn-bevel text-[#facc15]"
        >
          ×
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('÷', e)}
          className="py-2.5 sm:py-3 rounded bg-[#252a30] active:bg-[#343b44] text-lg font-black calc-btn-bevel text-[#facc15]"
        >
          ÷
        </button>
      </div>

      {/* ROW 3: 1, 2, 3, +, − */}
      <div className="grid grid-cols-5 gap-1.5 my-1">
        <button
          type="button"
          onClick={(e) => handleWorkingKey('1', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-lg font-black calc-btn-bevel text-[#121820]"
        >
          1
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('2', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-lg font-black calc-btn-bevel text-[#121820]"
        >
          2
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('3', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-lg font-black calc-btn-bevel text-[#121820]"
        >
          3
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('+', e)}
          className="py-2.5 sm:py-3 rounded bg-[#252a30] active:bg-[#343b44] text-lg font-black calc-btn-bevel text-[#facc15]"
        >
          +
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('−', e)}
          className="py-2.5 sm:py-3 rounded bg-[#252a30] active:bg-[#343b44] text-lg font-black calc-btn-bevel text-[#facc15]"
        >
          −
        </button>
      </div>

      {/* ROW 4: 0, ., EXP, Ans, = */}
      <div className="grid grid-cols-5 gap-1.5 my-1">
        <button
          type="button"
          onClick={(e) => handleWorkingKey('0', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-lg font-black calc-btn-bevel text-[#121820]"
        >
          0
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('.', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-lg font-black calc-btn-bevel text-[#121820]"
        >
          .
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('Ans', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-xs sm:text-sm font-bold calc-btn-bevel text-[#121820] font-casio-mono"
        >
          EXP
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('Ans', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-xs sm:text-sm font-bold calc-btn-bevel text-[#121820] font-casio-mono"
        >
          Ans
        </button>
        <button
          type="button"
          onClick={(e) => handleWorkingKey('=', e)}
          className="py-2.5 sm:py-3 rounded bg-[#d2d9df] active:bg-[#e4ebf2] text-xl font-black calc-btn-bevel text-[#121820] shadow-sm"
        >
          =
        </button>
      </div>
    </div>
  );
};
