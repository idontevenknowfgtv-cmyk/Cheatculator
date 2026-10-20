import React, { useState } from 'react';
import {
  Settings,
  Eye,
  EyeOff,
  Maximize2,
  Volume2,
  VolumeX,
  History,
  Sliders,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Copy,
  Check,
  Shield,
  Smartphone
} from 'lucide-react';
import {
  CalculatorTheme,
  ScreenAspect,
  ViewMode,
  PanicDecoyType,
  QueryRecord
} from '../types';

interface StealthControlsProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  aspect: ScreenAspect;
  onChangeAspect: (aspect: ScreenAspect) => void;
  theme: CalculatorTheme;
  onChangeTheme: (theme: CalculatorTheme) => void;
  isPanic: boolean;
  onTogglePanic: () => void;
  panicDecoy: PanicDecoyType;
  onChangePanicDecoy: (decoy: PanicDecoyType) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  history: QueryRecord[];
  onSelectHistoryItem: (record: QueryRecord) => void;
  onClearHistory: () => void;
}

export const StealthControls: React.FC<StealthControlsProps> = ({
  viewMode,
  onChangeViewMode,
  aspect,
  onChangeAspect,
  theme,
  onChangeTheme,
  isPanic,
  onTogglePanic,
  panicDecoy,
  onChangePanicDecoy,
  soundEnabled,
  onToggleSound,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'fit' | 'decoy' | 'history' | 'guide'>('fit');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-4 px-2 select-none">
      {/* Top quick stealth bar */}
      <div className="flex items-center justify-between bg-gray-900/90 backdrop-blur-md rounded-xl p-2.5 px-3 border border-gray-800 shadow-lg text-xs text-gray-300">
        <div className="flex items-center space-x-2">
          {/* Panic Trigger Button */}
          <button
            type="button"
            onClick={onTogglePanic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold tracking-wide transition-all shadow-sm ${
              isPanic
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
                : 'bg-red-700 hover:bg-red-600 text-white ring-1 ring-red-400/50'
            }`}
          >
            {isPanic ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isPanic ? 'RESTORE ASSISTANT' : 'PANIC HIDE (ESC)'}</span>
          </button>

          {/* Quick View Mode Switch */}
          <button
            type="button"
            onClick={() => onChangeViewMode(viewMode === 'full-calculator' ? 'screen-only' : 'full-calculator')}
            className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-2.5 py-1.5 rounded-lg text-gray-200 border border-gray-700"
            title="Toggle between framed bezel and pure 1:1 LCD glass"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{viewMode === 'screen-only' ? 'Pure LCD Only' : 'Framed Bezel'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Sound toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
            title={soundEnabled ? 'Mute Casio Beeps' : 'Enable Casio Beeps'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          {/* Open full settings drawer */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-2.5 py-1.5 rounded-lg text-gray-200"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span>Setup</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Configuration Drawer */}
      {isOpen && (
        <div className="mt-2 bg-gray-900/95 border border-gray-800 rounded-xl p-4 text-gray-300 shadow-2xl backdrop-blur-md">
          {/* Sub tabs */}
          <div className="flex border-b border-gray-800 pb-2 mb-3 gap-2 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('fit')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'fit' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              Screen & Theme
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('decoy')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'decoy' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              Panic Decoys
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'history' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              Answer History ({history.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'guide' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              Stealth Hotkeys
            </button>
          </div>

          {/* TAB 1: SCREEN FIT & THEME */}
          {activeTab === 'fit' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold mb-1.5">
                  Display Aspect Ratio & Fit Mode:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '192x63', label: 'fx-991EX ClassWiz', desc: '192×63 (3.05:1 exact LCD)' },
                    { id: 'fx991es', label: 'fx-991ES Plus', desc: 'Natural 2-line (~3.3:1)' },
                    { id: 'fill', label: 'Fill / Cutout', desc: 'Stretches to frame' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onChangeAspect(item.id as ScreenAspect)}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        aspect === item.id
                          ? 'border-blue-500 bg-blue-950/40 text-blue-200'
                          : 'border-gray-800 bg-gray-800/50 hover:bg-gray-800 text-gray-400'
                      }`}
                    >
                      <div className="font-bold text-gray-200">{item.label}</div>
                      <div className="text-[10px] opacity-75">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1.5">
                  Casio LCD Color Grading:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'classwiz', label: 'ClassWiz Silver', desc: 'Monochrome LCD' },
                    { id: 'olive', label: 'fx-991ES Olive', desc: 'Iconic greenish-gray' },
                    { id: 'dark', label: 'Night OLED', desc: 'Dim low-visibility green' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onChangeTheme(t.id as CalculatorTheme)}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        theme === t.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                          : 'border-gray-800 bg-gray-800/50 hover:bg-gray-800 text-gray-400'
                      }`}
                    >
                      <div className="font-bold text-gray-200">{t.label}</div>
                      <div className="text-[10px] opacity-75">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PANIC DECOYS */}
          {activeTab === 'decoy' && (
            <div className="space-y-3 text-xs">
              <p className="text-gray-400">
                Choose the harmless calculation shown when you hit <strong className="text-white">HIDE</strong> or press <kbd className="px-1 py-0.5 bg-gray-800 rounded border border-gray-700">Space</kbd> / <kbd className="px-1 py-0.5 bg-gray-800 rounded border border-gray-700">Esc</kbd>:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: 'trig',
                    title: 'Trigonometry & Hypotenuse',
                    expr: '√(14.5² - 8.2²)',
                    res: '11.9687092',
                  },
                  {
                    id: 'calculus',
                    title: 'Calculus Derivative',
                    expr: 'd/dx(x²·sin(x))|x=π',
                    res: '-9.8696044',
                  },
                  {
                    id: 'quadratic',
                    title: 'Quadratic Polynomial',
                    expr: '3x² - 5x + 2 = 0',
                    res: 'x₁ = 1, x₂ = 2/3',
                  },
                  {
                    id: 'physics',
                    title: 'Gravitational Constant',
                    expr: 'G × M_earth / R²',
                    res: '9.80665 m/s²',
                  },
                  {
                    id: 'standby',
                    title: 'Clean Standby',
                    expr: '0',
                    res: '',
                  },
                  {
                    id: 'blank',
                    title: 'Casio Reset / Power Save',
                    expr: 'Reset All? [1]:Yes [2]:No',
                    res: '',
                  },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onChangePanicDecoy(d.id as PanicDecoyType)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      panicDecoy === d.id
                        ? 'border-amber-500 bg-amber-950/40 text-amber-100'
                        : 'border-gray-800 bg-gray-800/40 hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{d.title}</span>
                      {panicDecoy === d.id && <span className="text-[10px] text-amber-400 font-mono">SELECTED</span>}
                    </div>
                    <div className="font-mono text-[11px] text-gray-400 mt-1 truncate">{d.expr}</div>
                    {d.res && <div className="font-mono text-[11px] text-amber-300 font-bold">{d.res}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ANSWER HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400">Past spoken queries and Gemini direct answers:</span>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearHistory}
                    className="text-red-400 hover:text-red-300 text-[11px]"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="py-6 text-center text-gray-500">
                  No calculations recorded yet. Tap the microphone on the Casio display to speak!
                </div>
              ) : (
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectHistoryItem(item)}
                      className="p-2 rounded-lg bg-gray-800/70 hover:bg-gray-800 border border-gray-700/60 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex-1 pr-2 truncate">
                        <div className="text-gray-400 text-[11px] truncate">{item.query}</div>
                        <div className="font-mono text-emerald-400 font-bold text-sm">{item.answer}</div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(item.id, item.answer);
                        }}
                        className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                        title="Copy direct answer"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STEALTH HOTKEYS & TIPS */}
          {activeTab === 'guide' && (
            <div className="space-y-3 text-xs leading-relaxed text-gray-300">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-800/60 p-2.5 rounded-lg border border-gray-700">
                  <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                    <Shield className="w-3.5 h-3.5 text-red-400" />
                    <span>Instant Panic Hotkeys</span>
                  </div>
                  <ul className="space-y-1 text-gray-400 text-[11px]">
                    <li>• <kbd className="px-1 bg-gray-900 rounded border border-gray-700 text-white">Spacebar</kbd> or <kbd className="px-1 bg-gray-900 rounded border border-gray-700 text-white">Esc</kbd></li>
                    <li>• Rapid double click anywhere on the Casio display</li>
                    <li>• Double click the red <strong className="text-red-400">AC</strong> key</li>
                  </ul>
                </div>

                <div className="bg-gray-800/60 p-2.5 rounded-lg border border-gray-700">
                  <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                    <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                    <span>Fitting onto Real Casio</span>
                  </div>
                  <ul className="space-y-1 text-gray-400 text-[11px]">
                    <li>• Switch to <strong className="text-white">Bezel Fit</strong> mode.</li>
                    <li>• Matches exact 192×63 Casio display ratio.</li>
                    <li>• Fits phones or small displays under physical cutout.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-800/40 p-2.5 rounded-lg border border-gray-800 text-[11px] text-gray-400">
                <strong className="text-white">Gemini Zero-Filler Rule:</strong> The Gemini prompt strictly instructs the engine to output ONLY raw answers (e.g. <span className="font-mono text-emerald-400">"x = 3.5"</span> or <span className="font-mono text-emerald-400">"180.16 g/mol"</span>). No pleasantries, no conversational padding, and no "anything else?".
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
