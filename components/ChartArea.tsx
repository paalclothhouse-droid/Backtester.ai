
import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { Pair, ChartType } from '../types';
import { generateData, CHART_TYPES, DRAWING_TOOLS } from '../constants';
import { 
  Settings, Maximize2, ChevronDown, BrainCircuit, Search, X, Star,
  Pencil, Trash2, Lock, Eye, MoreVertical, Crosshair, TrendingUp, MousePointer2,
  Type, Smile, Ruler, ZoomIn, Magnet, Undo2, Redo2, LayoutTemplate, Bell,
  ChevronRight, ArrowLeft
} from 'lucide-react';
import { analyzeChartTrend } from '../services/geminiService';

interface ChartAreaProps {
  pair: Pair;
  activeTool: string;
}

interface Point {
  time: number; // Unix timestamp
  price: number;
}

interface Drawing {
  id: string;
  type: string;
  points: Point[];
  isComplete: boolean;
}

const PATTERN_POINTS: Record<string, number> = {
  'Trend Line': 2,
  'Fib Retracement': 2,
  'Elliott Impulse Wave (12345)': 5,
  'Triangle': 3,
  'Rectangle': 2,
  'Circle': 2,
};

const ChartArea: React.FC<ChartAreaProps> = ({ pair }) => {
  // Chart Refs
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const currentDataRef = useRef<any[]>([]);

  // UI State
  const [timeframe, setTimeframe] = useState('5m');
  const [chartType, setChartType] = useState<ChartType>('Candles');
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['Vol', 'RSI']);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Tool & Menu State
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedDrawingTool, setSelectedDrawingTool] = useState<string>('Cursor');
  const [magnetMode, setMagnetMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Trend lines');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawing Engine State
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<Drawing | null>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  // Update SVG on resize
  useEffect(() => {
     if (chartContainerRef.current) {
         setSvgDimensions({
             width: chartContainerRef.current.clientWidth,
             height: chartContainerRef.current.clientHeight
         });
     }
  }, [chartContainerRef.current?.clientWidth, chartContainerRef.current?.clientHeight]);

  // Real-time Data Simulation
  useEffect(() => {
    currentDataRef.current = generateData(300, pair.price);
    
    const interval = setInterval(() => {
      if (!candleSeriesRef.current && !areaSeriesRef.current) return;

      const lastCandle = currentDataRef.current[currentDataRef.current.length - 1];
      const isNewCandle = Math.random() > 0.9; 
      
      let nextCandle;
      
      if (isNewCandle) {
         nextCandle = {
            time: (lastCandle.time + (60 * 5)) as Time,
            open: lastCandle.close,
            high: lastCandle.close,
            low: lastCandle.close,
            close: lastCandle.close
         };
         currentDataRef.current.push(nextCandle);
      } else {
         const change = (Math.random() - 0.5) * (lastCandle.close * 0.001);
         const newClose = lastCandle.close + change;
         nextCandle = {
            ...lastCandle,
            high: Math.max(lastCandle.high, newClose),
            low: Math.min(lastCandle.low, newClose),
            close: newClose
         };
         currentDataRef.current[currentDataRef.current.length - 1] = nextCandle;
      }
      
      if (chartType === 'Area' && areaSeriesRef.current) {
        areaSeriesRef.current.update({ time: nextCandle.time, value: nextCandle.close });
      } else if (candleSeriesRef.current) {
        candleSeriesRef.current.update(nextCandle);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [pair.symbol, chartType]);

  // Chart Initialization
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#131722' },
        textColor: '#d1d4dc',
        fontFamily: 'Inter',
      },
      grid: {
        vertLines: { color: '#2a2e39', style: 1, visible: true },
        horzLines: { color: '#2a2e39', style: 1, visible: true },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { labelBackgroundColor: '#2962ff', color: '#758696', width: 1, style: 3 },
        horzLine: { labelBackgroundColor: '#2962ff', color: '#758696', width: 1, style: 3 }
      },
      rightPriceScale: { borderColor: '#2a2e39', visible: true },
      timeScale: { borderColor: '#2a2e39', timeVisible: true, secondsVisible: false },
      autoSize: true,
    });
    
    chartRef.current = chart;

    if (chartType === 'Area') {
        const areaSeries = chart.addAreaSeries({
            lineColor: '#2962FF',
            topColor: 'rgba(41, 98, 255, 0.3)',
            bottomColor: 'rgba(41, 98, 255, 0)',
            lineWidth: 2,
        });
        areaSeries.setData(currentDataRef.current.map(d => ({ time: d.time, value: d.close })));
        areaSeriesRef.current = areaSeries;
    } else {
        const candleSeries = chart.addCandlestickSeries({
            upColor: '#089981',
            downColor: '#f23645',
            borderVisible: false,
            wickUpColor: '#089981',
            wickDownColor: '#f23645',
        });
        candleSeries.setData(currentDataRef.current);
        candleSeriesRef.current = candleSeries;
    }

    chart.timeScale().subscribeVisibleLogicalRangeChange(() => setSvgDimensions(prev => ({...prev})));

    const handleResize = () => {
      if (chartContainerRef.current) {
        const w = chartContainerRef.current.clientWidth;
        const h = chartContainerRef.current.clientHeight;
        chart.applyOptions({ width: w, height: h });
        setSvgDimensions({ width: w, height: h });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [chartType, pair.symbol]);

  // --- MAGNET & COORDINATE UTILS ---
  const getMagnetPrice = (time: number, roughPrice: number): number | null => {
      if (!magnetMode) return null;
      const candle = currentDataRef.current.find(d => Math.abs(d.time - time) < 60*60);
      if (!candle) return null;
      const prices = [candle.open, candle.high, candle.low, candle.close];
      return prices.reduce((prev, curr) => Math.abs(curr - roughPrice) < Math.abs(prev - roughPrice) ? curr : prev);
  };

  const coordinatesToPoint = (x: number, y: number): Point | null => {
      if (!chartRef.current || !candleSeriesRef.current) return null;
      const time = chartRef.current.timeScale().coordinateToTime(x);
      const price = candleSeriesRef.current.coordinateToPrice(y);
      if (time === null || price === null) return null;
      const finalPrice = getMagnetPrice(time as number, price) || price;
      return { time: time as number, price: finalPrice };
  };

  const pointToCoordinates = (p: Point): { x: number, y: number } | null => {
      if (!chartRef.current || !candleSeriesRef.current) return null;
      const x = chartRef.current.timeScale().timeToCoordinate(p.time as Time);
      const y = candleSeriesRef.current.priceToCoordinate(p.price);
      if (x === null || y === null) return null;
      return { x, y };
  };

  // --- MOUSE EVENTS ---
  const handleMouseDown = (e: React.MouseEvent) => {
      if (selectedDrawingTool === 'Cursor') return;
      const rect = chartContainerRef.current!.getBoundingClientRect();
      const point = coordinatesToPoint(e.clientX - rect.left, e.clientY - rect.top);
      if (!point) return;

      const requiredPoints = PATTERN_POINTS[selectedDrawingTool] || 2;

      if (!currentDrawing) {
          // Start New Drawing
          setCurrentDrawing({
              id: Date.now().toString(),
              type: selectedDrawingTool,
              points: [point],
              isComplete: false
          });
      } else {
          // Add Point to Existing Drawing
          const newPoints = [...currentDrawing.points, point];
          if (newPoints.length >= requiredPoints) {
              setDrawings([...drawings, { ...currentDrawing, points: newPoints, isComplete: true }]);
              setCurrentDrawing(null);
          } else {
              setCurrentDrawing({ ...currentDrawing, points: newPoints });
          }
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!currentDrawing) return;
      const rect = chartContainerRef.current!.getBoundingClientRect();
      const point = coordinatesToPoint(e.clientX - rect.left, e.clientY - rect.top);
      if (!point) return;
      // We don't update state here to avoid re-renders, typically we'd use a ref for the "dragged" point, 
      // but for React implementation let's just use the current drawing's last point as the "ghost" point
  };

  // --- RENDERERS ---
  const renderDrawing = (d: Drawing, isGhost = false) => {
      const coords = d.points.map(pointToCoordinates).filter(Boolean) as {x: number, y: number}[];
      if (coords.length < 1) return null;

      const color = "#2962ff";
      const isFib = d.type.includes('Fib');
      const isElliott = d.type.includes('Elliott');

      if (isFib && coords.length >= 2) {
          const p1 = coords[0];
          const p2 = coords[coords.length - 1]; // Use last point for drag
          const diffY = p2.y - p1.y;
          const startX = Math.min(p1.x, p2.x);
          const width = Math.abs(p2.x - p1.x) + 200;
          return (
              <g key={d.id} opacity={isGhost ? 0.5 : 1}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#787b86" strokeDasharray="4 4" />
                  {[0, 0.236, 0.382, 0.5, 0.618, 0.786, 1].map(lvl => (
                      <g key={lvl}>
                          <line x1={startX} y1={p1.y + diffY * lvl} x2={startX + width} y2={p1.y + diffY * lvl} stroke={color} strokeWidth={1} />
                          <text x={startX} y={p1.y + diffY * lvl - 2} fill={color} fontSize={10} fontFamily="Inter">{lvl}</text>
                      </g>
                  ))}
                  {coords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={4} fill="white" stroke={color} />)}
              </g>
          );
      }

      // Default Polyline for Patterns/Trendlines
      return (
          <g key={d.id} opacity={isGhost ? 0.5 : 1}>
              <polyline 
                  points={coords.map(c => `${c.x},${c.y}`).join(' ')} 
                  fill="none" 
                  stroke={color} 
                  strokeWidth={2} 
              />
              {isElliott && coords.map((c, i) => (
                  <text key={i} x={c.x} y={c.y - 10} fill={color} fontSize={12} fontWeight="bold" textAnchor="middle">{i}</text>
              ))}
              {coords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={4} fill="white" stroke={color} />)}
          </g>
      );
  };

  const handleAiAnalysis = async () => {
    setAnalyzing(true);
    const result = await analyzeChartTrend(pair.symbol, pair.price, pair.change);
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  // --- Dynamic Drawer (Bottom-Sheet System) ---
  const DrawingsDrawer = () => {
      const categories = ['Tools', 'Trend lines', 'Gann and Fibonacci', 'Patterns', 'Prediction', 'Geometric shapes', 'Annotation'];
      
      const filteredTools = DRAWING_TOOLS.filter(t => {
          const matchesCategory = t.category === activeCategory;
          const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
      });

      return (
        <div className="absolute inset-x-0 bottom-0 top-12 z-50 bg-[#1c1c1e] flex flex-col animate-in slide-in-from-bottom-10 duration-300">
           {/* Header */}
           <div className="flex items-center gap-3 p-4 border-b border-[#2c2c2e]">
               <Search className="text-zinc-500" size={20} />
               <input 
                 autoFocus
                 placeholder="Search tools..." 
                 className="bg-transparent text-white text-lg placeholder:text-zinc-600 outline-none flex-1"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               <button onClick={() => setActiveMenu(null)} className="p-2 bg-[#2c2c2e] rounded-full text-zinc-400 hover:text-white">
                   <X size={20} />
               </button>
           </div>

           {/* Tabs */}
           <div className="flex overflow-x-auto p-2 gap-2 border-b border-[#2c2c2e] hide-scrollbar">
               {categories.map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setActiveCategory(cat)}
                     className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                         activeCategory === cat 
                         ? 'bg-white text-black shadow-lg' 
                         : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#2c2c2e]'
                     }`}
                   >
                       {cat}
                   </button>
               ))}
           </div>

           {/* Grid */}
           <div className="flex-1 overflow-y-auto p-4 bg-[#1c1c1e]">
               <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                   {filteredTools.map(tool => {
                       const Icon = tool.icon;
                       return (
                           <button 
                             key={tool.name}
                             onClick={() => {
                                 setSelectedDrawingTool(tool.name);
                                 setActiveMenu(null);
                             }}
                             className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#2c2c2e]/50 hover:bg-[#2c2c2e] transition-all gap-3 h-28 group"
                           >
                               <Icon size={28} className="text-zinc-400 group-hover:text-white group-hover:scale-110 transition-all" />
                               <span className="text-xs text-zinc-500 group-hover:text-zinc-300 text-center font-medium leading-tight">{tool.name}</span>
                           </button>
                       )
                   })}
               </div>
           </div>
        </div>
      );
  };

  return (
    <div className="flex flex-col h-full w-full relative select-none bg-[#000000] font-sans overflow-hidden">
      
      {/* Top Toolbar */}
      <div className="h-12 border-b border-[#2c2c2e] flex items-center px-2 gap-2 bg-[#000000] z-40 text-[#d1d4dc]">
        <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-[#1c1c1e] rounded transition-colors">
                <div className="w-5 h-5 rounded-full bg-[#2962ff] flex items-center justify-center text-[10px] font-bold text-white">
                    {pair.symbol.substring(0,1)}
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="font-bold text-sm text-white">{pair.symbol}</span>
                </div>
            </button>
        </div>
        <div className="w-[1px] h-5 bg-[#2c2c2e]"></div>
        <div className="flex items-center">
             <button onClick={() => setActiveMenu('drawings')} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedDrawingTool !== 'Cursor' ? 'bg-[#2962ff] text-white' : 'bg-[#1c1c1e] text-zinc-400 hover:text-white'}`}>
                <Pencil size={14} />
                <span>{selectedDrawingTool === 'Cursor' ? 'Draw' : selectedDrawingTool}</span>
             </button>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-1">
             <button onClick={() => setMagnetMode(!magnetMode)} className={`p-2 rounded hover:bg-[#1c1c1e] ${magnetMode ? 'text-[#2962ff]' : 'text-zinc-400'}`}><Magnet size={18}/></button>
             <button onClick={() => setDrawings([])} className="p-2 rounded hover:bg-[#1c1c1e] text-zinc-400"><Trash2 size={18}/></button>
             <button onClick={handleAiAnalysis} className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1c1c1e] text-purple-400 text-xs font-bold hover:bg-[#2c2c2e] ml-2 border border-purple-500/20">
                {analyzing ? <Settings className="animate-spin" size={14} /> : <BrainCircuit size={14} />}
                <span className="hidden sm:inline">AI Check</span>
            </button>
        </div>
      </div>

      <div className="flex-1 relative flex overflow-hidden">
        {/* Main Chart Container */}
        <div className="flex-1 relative w-full h-full bg-[#000000] overflow-hidden" 
             onMouseDown={handleMouseDown} 
             onMouseMove={handleMouseMove} 
        > 
          
          {/* Drawer Overlay */}
          {activeMenu === 'drawings' && <DrawingsDrawer />}

          {/* Indicators Legend */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
             <div className="flex items-center gap-2 text-sm font-bold text-[#d1d4dc]">
                <span className="cursor-pointer pointer-events-auto hover:text-white text-lg">{pair.symbol}</span>
                <span className="text-zinc-500 text-xs px-1 border border-zinc-800 rounded">{timeframe}</span>
             </div>
             <div className="flex flex-col items-start gap-1 mt-1">
                <div className="flex items-center gap-2 text-xs">
                    <span className={`font-mono ${pair.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {currentDataRef.current.length > 0 && currentDataRef.current[currentDataRef.current.length-1]?.close.toFixed(2)}
                    </span>
                    <span className={`${pair.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'} font-bold`}>
                        {pair.change >= 0 ? '+' : ''}{pair.change}%
                    </span>
                </div>
             </div>
          </div>

          {/* AI Popup */}
          {aiAnalysis && (
            <div className="absolute top-4 right-4 z-30 max-w-xs w-full animate-in fade-in slide-in-from-right-5 duration-300">
              <div className="bg-[#1c1c1e] border border-purple-500/30 p-4 rounded-xl shadow-2xl relative">
                <button onClick={() => setAiAnalysis(null)} className="absolute top-2 right-2 text-zinc-500 hover:text-white"><X size={14} /></button>
                <div className="flex items-start gap-3">
                  <BrainCircuit className="text-purple-400 shrink-0" size={18} />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">AI Insight</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{aiAnalysis}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SVG Overlay for Drawings */}
          <svg className="absolute inset-0 pointer-events-none z-20" width={svgDimensions.width} height={svgDimensions.height}>
              {drawings.map(d => renderDrawing(d))}
              {currentDrawing && renderDrawing(currentDrawing, true)}
          </svg>

          {/* Chart Div */}
          <div ref={chartContainerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default ChartArea;
