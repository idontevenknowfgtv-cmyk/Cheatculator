import React, { useState } from 'react';
import {
  Ruler,
  Maximize2,
  Minimize2,
  ZoomIn,
  RotateCcw,
  Info
} from 'lucide-react';

interface CasioPhotoScaleProps {
  onClose: () => void;
}

export const CasioPhotoScale: React.FC<CasioPhotoScaleProps> = ({ onClose }) => {
  const [scale, setScale] = useState<number>(100); // 100% scale
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [opacity, setOpacity] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Directly use the user's provided Casio-FX-991MS photo
  const photoUrl = '/assets/aistudio/Casio-FX-991MS_6bcb36f3.jpg';

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07090c] flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* TOP CONTROL BAR */}
      <div className="w-full bg-[#12161c]/95 backdrop-blur-md border-b border-gray-800 p-2.5 px-3 flex items-center justify-between text-xs text-gray-200 z-30 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="font-bold flex items-center gap-1.5 text-white">
            <Ruler className="w-4 h-4 text-emerald-400" />
            <span>Casio fx-991MS 1:1 Measuring System</span>
          </span>
          <span className="text-[10px] bg-amber-900/50 text-amber-300 px-1.5 py-0.5 rounded border border-amber-700/50 hidden sm:inline font-mono">
            S-V.P.A.M. Photo Reference
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Fullscreen button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-gray-200"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="bg-red-800 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded transition-colors"
          >
            ✕ Back
          </button>
        </div>
      </div>

      {/* MAIN VIEWPORT: USER'S EXACT CASIO FX-991MS WITH MEASURING RULERS */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden bg-[#0a0d12] p-1">
        {/* LEFT METRIC MILLIMETER RULER (0 - 160 mm) */}
        {showRuler && (
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-10 bg-[#141920]/90 border-r border-gray-700/80 z-20 flex flex-col justify-between py-2 text-[9px] text-gray-400 font-mono pointer-events-none">
            {Array.from({ length: 17 }, (_, i) => i * 10).map((mm) => (
              <div key={mm} className="relative flex items-center pl-1">
                <span className="w-3 text-[8px] text-gray-300">{mm}</span>
                <div className="absolute right-0 w-3 h-[1px] bg-gray-400" />
              </div>
            ))}
            <div className="text-center text-[8px] font-bold text-emerald-400 transform -rotate-90 origin-center mb-4">
              MILLIMETERS (mm)
            </div>
          </div>
        )}

        {/* RIGHT IMPERIAL INCH RULER (0 - 6.5 in) */}
        {showRuler && (
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-10 bg-[#141920]/90 border-l border-gray-700/80 z-20 flex flex-col justify-between py-3 text-[9px] text-gray-400 font-mono pointer-events-none text-right">
            {Array.from({ length: 8 }, (_, i) => i).map((inch) => (
              <div key={inch} className="relative flex items-center justify-end pr-1">
                <div className="absolute left-0 w-3 h-[1px] bg-gray-400" />
                <span className="w-3 text-[8px] text-gray-300">{inch}"</span>
              </div>
            ))}
            <div className="text-center text-[8px] font-bold text-amber-400 transform rotate-90 origin-center mb-4">
              INCHES (in)
            </div>
          </div>
        )}

        {/* CASIO FX-991MS IMAGE CONTAINER WITH ADJUSTABLE 1:1 SCALE */}
        <div
          className="relative max-h-full transition-transform duration-75 flex items-center justify-center"
          style={{
            transform: `scale(${scale / 100})`,
            opacity: opacity / 100,
          }}
        >
          {/* USER'S EXACT CASIO FX-991MS PHOTO */}
          <img
            src={photoUrl}
            alt="Casio fx-991MS Calculator"
            className="max-h-[85vh] w-auto object-contain rounded-2xl shadow-2xl pointer-events-none border border-gray-800"
          />

          {/* PHYSICAL MEASUREMENT CALLOUTS FOR FX-991MS */}
          {showDimensions && (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
              {/* Width dimension header */}
              <div className="absolute -top-6 left-0 right-0 flex items-center justify-center">
                <div className="bg-blue-600/90 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow">
                  Width: 78.0 mm (3.07 in)
                </div>
              </div>

              {/* Screen cutout dimension box overlay (aligned precisely to fx-991MS screen) */}
              <div
                className="absolute border-2 border-emerald-400/90 bg-emerald-500/10 rounded flex items-center justify-center shadow-lg"
                style={{
                  top: '18%',
                  left: '29%',
                  width: '42%',
                  height: '11.5%',
                }}
              >
                <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/80 font-mono font-bold text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded shadow">
                  Screen: 58 mm × 19 mm
                </span>
              </div>

              {/* Total Height callout */}
              <div className="absolute -bottom-6 left-0 right-0 flex items-center justify-center">
                <div className="bg-blue-600/90 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow">
                  Height: 155.0 mm (6.1 in) • Depth: 13.0 mm
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM MEASURING SYSTEM CONTROLS */}
      <div className="w-full bg-[#10141a] border-t border-gray-800 p-2.5 px-3 z-30 flex flex-col space-y-2 flex-shrink-0">
        {/* Scale & Zoom Slider */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-1.5 text-gray-300 min-w-[70px]">
            <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">{scale}% Scale</span>
          </div>

          <input
            type="range"
            min="60"
            max="140"
            step="1"
            value={scale}
            onChange={(e) => setScale(parseInt(e.target.value))}
            className="flex-1 accent-emerald-500 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
          />

          <button
            type="button"
            onClick={() => setScale(100)}
            className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-[11px] text-gray-300"
            title="Reset to 100% standard ratio"
          >
            <RotateCcw className="w-3 h-3" />
            <span>100%</span>
          </button>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center justify-between text-[11px] text-gray-300 pt-1">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowRuler(!showRuler)}
              className={`px-2 py-1 rounded border transition-colors ${
                showRuler ? 'bg-emerald-950 border-emerald-600 text-emerald-300 font-bold' : 'bg-gray-800 border-gray-700 text-gray-400'
              }`}
            >
              {showRuler ? '✓ Rulers (mm/in)' : 'Show Rulers'}
            </button>

            <button
              type="button"
              onClick={() => setShowDimensions(!showDimensions)}
              className={`px-2 py-1 rounded border transition-colors ${
                showDimensions ? 'bg-blue-950 border-blue-600 text-blue-300 font-bold' : 'bg-gray-800 border-gray-700 text-gray-400'
              }`}
            >
              {showDimensions ? '✓ Dimensions' : 'Show Dimensions'}
            </button>
          </div>

          <div className="text-[10px] text-gray-400 flex items-center gap-1">
            <Info className="w-3 h-3 text-emerald-400" />
            <span>Hold your physical fx-991MS against the screen to align</span>
          </div>
        </div>
      </div>
    </div>
  );
};
