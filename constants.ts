
import { Pair, NewsItem, OHLCData, Indicator, DrawingTool } from './types';
import { 
  TrendingUp, Minus, MoveDiagonal, Circle, Square, Type, Ruler, MousePointer2,
  Slash, ArrowUpRight, ArrowRight, Activity, BarChart2, CandlestickChart, LineChart,
  Grid, Hash, PenTool, Edit3, MessageSquare, Image,
  GitCommit, Spline, BoxSelect, Maximize, Divide
} from 'lucide-react';

export const MOCK_PAIRS: Pair[] = [
  { symbol: 'BTCUSD', name: 'Bitcoin', category: 'Crypto', price: 65483.25, change: 2.4 },
  { symbol: 'ETHUSD', name: 'Ethereum', category: 'Crypto', price: 3450.10, change: -1.2 },
  { symbol: 'NIFTY', name: 'Nifty 50', category: 'Ind Stocks', price: 25088.40, change: 0.8 },
  { symbol: 'BANKNIFTY', name: 'Bank Nifty', category: 'Ind Stocks', price: 47500.20, change: 1.1 },
  { symbol: 'AAPL', name: 'Apple Inc', category: 'US Stocks', price: 178.35, change: 0.5 },
  { symbol: 'TSLA', name: 'Tesla', category: 'US Stocks', price: 169.80, change: -2.1 },
  { symbol: 'RELIANCE', name: 'Reliance Ind', category: 'Ind Stocks', price: 2950.00, change: 1.1 },
  { symbol: 'XAUUSD', name: 'Gold', category: 'Commodities', price: 2350.20, change: 0.8 },
];

export const MOCK_NEWS: NewsItem[] = [
  { id: 1, title: 'BTCUSD: Reacts to Key Support - Corrective Bounce To $82,200', source: 'Ratner', time: '4h ago', sentiment: 'positive' },
  { id: 2, title: 'EURUSD Short: Rally Stalls at Supply - Key Reaction Near 1.1800', source: 'heniitrading', time: '4h ago', sentiment: 'negative' },
  { id: 3, title: 'Gold and Silver Crash: A Coordinated Sell-Off, Not "Profit Taking"', source: 'KlejdiCuni', time: '18h ago', sentiment: 'negative' },
  { id: 4, title: 'Nifty hits all-time high amidst strong foreign inflows', source: 'MarketPulse', time: '1d ago', sentiment: 'positive' },
];

export const CHART_TYPES = [
  { label: 'Bars', icon: BarChart2, type: 'Bar' },
  { label: 'Candles', icon: CandlestickChart, type: 'Candles' },
  { label: 'Hollow candles', icon: CandlestickChart, type: 'Hollow Candles' },
  { label: 'Line', icon: LineChart, type: 'Line' },
  { label: 'Area', icon: Activity, type: 'Area' },
  { label: 'Heikin Ashi', icon: CandlestickChart, type: 'Heikin Ashi' },
  { label: 'Baseline', icon: Activity, type: 'Baseline' },
];

export const INDICATORS_LIST: Indicator[] = [
  { name: 'Bollinger Bands', category: 'standard' },
  { name: 'Moving Average Convergence Divergence', category: 'standard' },
  { name: 'Relative Strength Index (RSI)', category: 'standard' },
  { name: 'SuperTrend', author: 'KivancOzbilgic', likes: 67400, category: 'community' },
  { name: 'Squeeze Momentum Indicator', author: 'LazyBear', likes: 108200, category: 'community' },
  { name: 'Smart Money Concepts [LuxAlgo]', author: 'LuxAlgo', likes: 115600, category: 'community' },
  { name: 'MacD Custom Indicator-Multiple Time...', author: 'ChrisMoody', likes: 76300, category: 'community' },
  { name: 'Linear Regression Candles', category: 'standard' },
  { name: 'Volume', category: 'standard' },
  { name: 'Auto Fib Retracement', category: 'standard' },
  { name: 'Order Block Finder (Experimental)', author: 'wugamlo', likes: 31100, category: 'community' },
];

export const DRAWING_TOOLS: DrawingTool[] = [
  // Trend lines
  { name: 'Trend Line', icon: Slash, category: 'Trend lines' },
  { name: 'Ray', icon: ArrowUpRight, category: 'Trend lines' },
  { name: 'Info Line', icon: Activity, category: 'Trend lines' },
  { name: 'Extended Line', icon: MoveDiagonal, category: 'Trend lines' },
  { name: 'Horizontal Line', icon: Minus, category: 'Trend lines' },
  { name: 'Vertical Line', icon: Minus, category: 'Trend lines' },
  { name: 'Cross Line', icon: MousePointer2, category: 'Trend lines' },
  { name: 'Parallel Channel', icon: Divide, category: 'Trend lines' },
  
  // Gann and Fibonacci
  { name: 'Fib Retracement', icon: Grid, category: 'Gann and Fibonacci' },
  { name: 'Trend-Based Fib Extension', icon: TrendingUp, category: 'Gann and Fibonacci' },
  { name: 'Fib Channel', icon: Hash, category: 'Gann and Fibonacci' },
  { name: 'Gann Box', icon: BoxSelect, category: 'Gann and Fibonacci' },
  { name: 'Gann Square', icon: Square, category: 'Gann and Fibonacci' },

  // Geometric Shapes
  { name: 'Brush', icon: PenTool, category: 'Geometric shapes' },
  { name: 'Highlighter', icon: Edit3, category: 'Geometric shapes' },
  { name: 'Rectangle', icon: Square, category: 'Geometric shapes' },
  { name: 'Circle', icon: Circle, category: 'Geometric shapes' },
  { name: 'Path', icon: Spline, category: 'Geometric shapes' },

  // Annotation
  { name: 'Text', icon: Type, category: 'Annotation' },
  { name: 'Note', icon: MessageSquare, category: 'Annotation' },
  { name: 'Image', icon: Image, category: 'Annotation' },
  { name: 'Callout', icon: MessageSquare, category: 'Annotation' },

  // Prediction
  { name: 'Long Position', icon: ArrowUpRight, category: 'Prediction' },
  { name: 'Short Position', icon: ArrowRight, category: 'Prediction' },
  { name: 'Forecast', icon: GitCommit, category: 'Prediction' },
  { name: 'Price Range', icon: Maximize, category: 'Prediction' },
];

export const TOOLS = [
  { id: 'cursor', icon: MousePointer2, label: 'Cursor' },
  { id: 'trendline', icon: MoveDiagonal, label: 'Trendline' },
  { id: 'fib', icon: TrendingUp, label: 'Fibonacci' },
  { id: 'text', icon: Type, label: 'Text' },
];

export const generateData = (count: number = 300, startPrice: number = 64000) => {
  const data = [];
  let currentPrice = startPrice;
  // Start from 'count' days ago
  let time = Math.floor(Date.now() / 1000) - (count * 60 * 60 * 24);

  for (let i = 0; i < count; i++) {
    const volatility = 0.02; // 2% volatility
    const changePercent = (Math.random() - 0.5) * volatility;
    const close = currentPrice * (1 + changePercent);
    const open = currentPrice;
    
    // Ensure High/Low envelop Open/Close
    const maxVal = Math.max(open, close);
    const minVal = Math.min(open, close);
    const high = maxVal * (1 + Math.random() * 0.01);
    const low = minVal * (1 - Math.random() * 0.01);

    // Lightweight charts prefers UNIX timestamp for 'time' in seconds
    data.push({
      time: time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });

    currentPrice = close;
    time += 60 * 60 * 24; // Add 1 day in seconds
  }
  return data;
};
