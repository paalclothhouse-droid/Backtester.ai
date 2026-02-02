import { Pair, NewsItem, OHLCData } from './types';
import { 
  TrendingUp, 
  Minus, 
  MoveDiagonal, 
  Circle, 
  Square, 
  Type, 
  Ruler, 
  MousePointer2 
} from 'lucide-react';

export const MOCK_PAIRS: Pair[] = [
  { symbol: 'BTCUSD', name: 'Bitcoin', category: 'Crypto', price: 64230.50, change: 2.4 },
  { symbol: 'ETHUSD', name: 'Ethereum', category: 'Crypto', price: 3450.10, change: -1.2 },
  { symbol: 'AAPL', name: 'Apple Inc', category: 'US Stocks', price: 178.35, change: 0.5 },
  { symbol: 'TSLA', name: 'Tesla', category: 'US Stocks', price: 169.80, change: -2.1 },
  { symbol: 'RELIANCE', name: 'Reliance Ind', category: 'Ind Stocks', price: 2950.00, change: 1.1 },
  { symbol: 'TCS', name: 'Tata Consultancy', category: 'Ind Stocks', price: 4120.50, change: 0.3 },
  { symbol: 'XAUUSD', name: 'Gold', category: 'Commodities', price: 2350.20, change: 0.8 },
  { symbol: 'USOIL', name: 'Crude Oil', category: 'Commodities', price: 82.15, change: -0.4 },
];

export const MOCK_NEWS: NewsItem[] = [
  { id: 1, title: 'Fed Signals Interest Rate Cuts Coming Soon', source: 'Global Finance', time: '10m ago', sentiment: 'positive' },
  { id: 2, title: 'Bitcoin Halving Event Approaches', source: 'CryptoDaily', time: '1h ago', sentiment: 'neutral' },
  { id: 3, title: 'Tech Stocks Rally on AI Breakthroughs', source: 'MarketWatch', time: '2h ago', sentiment: 'positive' },
  { id: 4, title: 'Supply Chain Issues Affect Oil Prices', source: 'Energy News', time: '4h ago', sentiment: 'negative' },
];

export const TOOLS = [
  { id: 'cursor', icon: MousePointer2, label: 'Cursor' },
  { id: 'trendline', icon: MoveDiagonal, label: 'Trendline' },
  { id: 'horizontal', icon: Minus, label: 'Horiz. Line' },
  { id: 'fib', icon: TrendingUp, label: 'Fibonacci' },
  { id: 'rect', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'measure', icon: Ruler, label: 'Measure' },
];

// Generate synthetic OHLC data
export const generateData = (days: number = 100, startPrice: number = 100): OHLCData[] => {
  let data: OHLCData[] = [];
  let currentPrice = startPrice;
  const now = new Date();

  for (let i = days; i > 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const volatility = currentPrice * 0.02;
    const change = (Math.random() - 0.5) * volatility;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 10000) + 1000;

    data.push({
      time: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume
    });
    currentPrice = close;
  }
  return data;
};
