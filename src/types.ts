export type CalculatorTheme = 'classwiz' | 'olive' | 'dark';

export type ScreenAspect = '192x63' | 'fx991es' | 'fill';

export type ViewMode = 'screen-only' | 'full-calculator';

export type PanicDecoyType = 'trig' | 'calculus' | 'quadratic' | 'physics' | 'blank' | 'standby';

export interface DecoyPreset {
  id: PanicDecoyType;
  label: string;
  expression: string;
  result: string;
}

export interface QueryRecord {
  id: string;
  timestamp: number;
  query: string;
  answer: string;
}
