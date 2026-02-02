
export interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  // Dynamic properties for indicators
  [key: string]: string | number; 
}

export interface Pair {
  symbol: string;
  name: string;
  category: 'Crypto' | 'US Stocks' | 'Ind Stocks' | 'Commodities';
  price: number;
  change: number;
}

export interface NewsItem {
  id: number;
  title: string;
  source: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface BacktestResult {
  winRate: number;
  totalTrades: number;
  netProfit: number; // Percentage
  profitFactor: number;
  maxDrawdown: number;
  analysis: string;
  pineScriptCode?: string; // New field for generated code
}

export enum TimeFrame {
  M15 = '15m',
  H1 = '1h',
  H4 = '4h',
  D1 = '1d',
}

export interface StrategyParams {
  pair: string;
  startDate: string;
  endDate: string;
  description: string;
}

export type ChartType = 'Candles' | 'Bar' | 'Line' | 'Area' | 'Heikin Ashi' | 'Hollow Candles' | 'Baseline';

export interface Indicator {
  name: string;
  author?: string;
  likes?: number;
  category: 'favorite' | 'standard' | 'community';
}

export interface DrawingTool {
  name: string;
  icon: any; // Using Lucide icon component type
  category: 'Trend lines' | 'Gann and Fibonacci' | 'Geometric shapes' | 'Annotation' | 'Patterns' | 'Prediction';
}
