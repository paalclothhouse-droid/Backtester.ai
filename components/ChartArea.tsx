
import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart
} from 'recharts';
import { OHLCData, Pair, ChartType } from '../types';
import { generateData } from '../constants';
import { 
  Settings, 
  MoreHorizontal, 
  Camera, 
  Maximize2, 
  PlusCircle, 
  Activity, 
  Clock, 
  ChevronDown,
  Layers,
  BrainCircuit,
  Eye,
  EyeOff
} from 'lucide-react';
import { analyzeChartTrend } from '../services/geminiService';

interface ChartAreaProps {
  pair: Pair;
  activeTool: string;
}

// Simple Indicator Calculation Helper
const calculateSMA = (data: OHLCData[], period: number) => {
  return data.map((item, index, arr) => {
    if (index < period - 1) return { ...item, [`sma${period}`]: null };
    const slice = arr.slice(index - period + 1, index + 1);
    const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
    return { ...item, [`sma${period}`]: sum / period };
  });
};

const ChartArea: React.FC<ChartAreaProps> = ({ pair, activeTool }) => {
  const [timeframe, setTimeframe] = useState('4H');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [showSMA, setShowSMA] = useState(false);
  const [showEMA, setShowEMA] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Generate Base Data
  const rawData = useMemo(() => generateData(80, pair.price), [pair.symbol]);

  // Process Indicators
  const data = useMemo(() => {
    let processed = rawData;
    if (showSMA) processed = calculateSMA(processed, 20); // 20 Period SMA
    // Simulating EMA by just doing a slightly faster SMA for visual demo
    if (showEMA) processed = calculateSMA(processed, 9); 
    return processed;
  }, [rawData, showSMA, showEMA]);

  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const domain = [minPrice - (minPrice * 0.05), maxPrice + (maxPrice * 0.05)];

  const isPositive = pair.change >= 0;
  const strokeColor = isPositive ? '#34d399' : '#fb7185';
  const gradientColor = isPositive ? '#10b981' : '#f43f5e';

  const handleAiAnalysis = async () => {
    setAnalyzing(true);
    const result = await analyzeChartTrend(pair.symbol, pair.price, pair.change);
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  return (
    <div className="flex flex-col h-full w-full relative group">
      
      {/* --- Top Toolbar (TradingView Style) --- */}
      <div className="h-12 border-b border-white/5 flex items-center px-4 gap-4 bg-black/40 backdrop-blur-md z-20 shrink-0 overflow-x-auto custom-scrollbar">
        
        {/* Symbol & Timeframe */}
        <div className="flex items-center gap-2 border-r border-white/10 pr-4">
          <span className="font-black text-lg tracking-tight text-white">{pair.symbol}</span>
          <div className="flex items-center gap-1 bg-white/5 rounded-md p-0.5">
            {['15m', '1H', '4H', '1D'].map(tf => (
              <button 
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${timeframe === tf ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {tf}
              </button>
            ))}
            <button className="px-1 text-zinc-500 hover:text-white"><ChevronDown size={10} /></button>
          </div>
        </div>

        {/* Chart Options */}
        <div className="flex items-center gap-3 border-r border-white/10 pr-4">
           <div className="flex items-center gap-1">
              <button 
                onClick={() => setChartType('area')}
                className={`p-1.5 rounded hover:bg-white/10 ${chartType === 'area' ? 'text-purple-400' : 'text-zinc-400'}`}
                title="Area Chart"
              >
                <Activity size={18} />
              </button>
               <button 
                onClick={() => setChartType('line')}
                className={`p-1.5 rounded hover:bg-white/10 ${chartType === 'line' ? 'text-purple-400' : 'text-zinc-400'}`}
                title="Line Chart"
              >
                <Layers size={18} />
              </button>
           </div>
           
           {/* Indicators Dropdown Simulation */}
           <div className="flex items-center gap-2">
             <button 
                onClick={() => setShowSMA(!showSMA)}
                className={`text-xs font-bold px-2 py-1 rounded border ${showSMA ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-white/10 text-zinc-500 hover:text-zinc-300'}`}
             >
               SMA 20
             </button>
             <button 
                onClick={() => setShowEMA(!showEMA)}
                className={`text-xs font-bold px-2 py-1 rounded border ${showEMA ? 'border-orange-500 text-orange-400 bg-orange-500/10' : 'border-white/10 text-zinc-500 hover:text-zinc-300'}`}
             >
               EMA 9
             </button>
             <button className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-white/5">
               <PlusCircle size={14} />
               Indicators
             </button>
           </div>
        </div>

        {/* AI Action */}
        <div className="flex-1" />
        <button 
          onClick={handleAiAnalysis}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(124,58,237,0.3)]"
        >
          {analyzing ? <Settings className="animate-spin" size={14} /> : <BrainCircuit size={14} />}
          {analyzing ? 'Analyzing...' : 'Ask AI'}
        </button>
        
        <div className="flex items-center gap-2 text-zinc-500">
          <Settings size={18} className="hover:text-white cursor-pointer" />
          <Camera size={18} className="hover:text-white cursor-pointer" />
          <Maximize2 size={18} className="hover:text-white cursor-pointer" />
        </div>
      </div>

      {/* --- Main Chart Area --- */}
      <div className={`flex-1 relative w-full overflow-hidden ${activeTool === 'cursor' ? 'cursor-default' : 'cursor-crosshair'}`}>
        
        {/* AI Analysis Overlay */}
        {aiAnalysis && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 max-w-md w-full animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="mx-4 bg-black/80 backdrop-blur-xl border border-purple-500/30 p-4 rounded-2xl shadow-2xl relative">
              <button 
                onClick={() => setAiAnalysis(null)}
                className="absolute top-2 right-2 text-zinc-500 hover:text-white"
              >
                <PlusCircle size={16} className="rotate-45" />
              </button>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg shrink-0">
                  <BrainCircuit className="text-purple-400" size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">AI Technical Assessment</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">{aiAnalysis}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend Overlay */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none text-xs font-mono space-y-1">
             <div className="flex items-center gap-2">
               <span className={`text-[10px] px-1 rounded ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>Market</span>
               <span className="text-zinc-300">O:{data[data.length-1].open.toFixed(2)} H:{data[data.length-1].high.toFixed(2)} L:{data[data.length-1].low.toFixed(2)} C:{data[data.length-1].close.toFixed(2)}</span>
             </div>
             {showSMA && (
               <div className="flex items-center gap-2 text-blue-400">
                  <Eye size={10} /> SMA 20: {Number(data[data.length-1]['sma20']).toFixed(2)}
               </div>
             )}
             {showEMA && (
               <div className="flex items-center gap-2 text-orange-400">
                  <Eye size={10} /> EMA 9: {Number(data[data.length-1]['sma9']).toFixed(2)}
               </div>
             )}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 60, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} horizontal={true} />
            <XAxis 
              dataKey="time" 
              stroke="#52525b" 
              tick={{fontSize: 10, fill: '#71717a'}} 
              tickLine={false}
              axisLine={false}
              dy={10}
              minTickGap={50}
            />
            <YAxis 
              domain={domain} 
              stroke="#52525b" 
              orientation="right" 
              tick={{fontSize: 11, fill: '#a1a1aa', fontFamily: 'monospace'}}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toFixed(2)}
              dx={10}
            />
            <Tooltip 
              contentStyle={{ 
                  backgroundColor: 'rgba(24, 24, 27, 0.95)', 
                  borderColor: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '8px',
                  color: '#f4f4f5',
                  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '12px'
              }}
              cursor={{ stroke: '#ffffff', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.3 }}
            />
            
            {/* Main Price Series */}
            {chartType === 'area' ? (
               <Area 
                type="monotone" 
                dataKey="close" 
                stroke={strokeColor} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)"
              />
            ) : (
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke={strokeColor} 
                strokeWidth={2}
                dot={false}
              />
            )}

            {/* Indicators */}
            {showSMA && (
              <Line type="monotone" dataKey="sma20" stroke="#3b82f6" strokeWidth={2} dot={false} />
            )}
            {showEMA && (
               <Line type="monotone" dataKey="sma9" stroke="#f97316" strokeWidth={2} dot={false} />
            )}

            {activeTool === 'trendline' && (
               <ReferenceLine y={pair.price} stroke="#fbbf24" strokeDasharray="3 3" label="Current" />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartArea;
