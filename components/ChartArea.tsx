
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi } from 'lightweight-charts';
import { Pair, ChartType } from '../types';
import { generateData, CHART_TYPES, INDICATORS_LIST, DRAWING_TOOLS } from '../constants';
import { 
  Settings, Camera, Maximize2, ChevronDown, BrainCircuit, Search, X, Star,
  Pencil, Trash2, Lock, Eye, MoreVertical, Crosshair, TrendingUp, MousePointer2,
  Type, Smile, Ruler, ZoomIn, Magnet, Undo2, Redo2, LayoutTemplate, Bell,
  PlusCircle, Eraser, Move
} from 'lucide-react';
import { analyzeChartTrend } from '../services/geminiService';

interface ChartAreaProps {
  pair: Pair;
  activeTool: string;
}

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
  const [selectedDrawingTool, setSelectedDrawingTool] = useState<string>('Trend Line');
  const [drawingCategory, setDrawingCategory] = useState<string>('Trend lines');
  
  // Real-time Data Simulation
  useEffect(() => {
    // Generate Initial Data
    currentDataRef.current = generateData(300, pair.price);
    
    // Ticker Interval
    const interval = setInterval(() => {
      if (!candleSeriesRef.current && !areaSeriesRef.current) return;

      const lastCandle = currentDataRef.current[currentDataRef.current.length - 1];
      const time = Math.floor(Date.now() / 1000);
      
      // Basic simulation: 80% chance to update current candle, 20% to create new
      const isNewCandle = Math.random() > 0.9; 
      
      let nextCandle;
      
      if (isNewCandle) {
         // New candle starts at previous close
         nextCandle = {
            time: lastCandle.time + (60 * 5), // +5 mins
            open: lastCandle.close,
            high: lastCandle.close,
            low: lastCandle.close,
            close: lastCandle.close
         };
         currentDataRef.current.push(nextCandle);
      } else {
         // Update existing candle
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
        vertLines: { color: '#2a2e39', style: 2, visible: true },
        horzLines: { color: '#2a2e39', style: 2, visible: true },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
             labelBackgroundColor: '#2962ff',
             color: '#758696',
             width: 1,
             style: 3
        },
        horzLine: {
             labelBackgroundColor: '#2962ff',
             color: '#758696',
             width: 1,
             style: 3
        }
      },
      rightPriceScale: {
        borderColor: '#2a2e39',
        visible: true,
      },
      timeScale: {
        borderColor: '#2a2e39',
        timeVisible: true,
        secondsVisible: false,
      },
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

    // Resize Observer
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [chartType, pair.symbol]); // Re-init when chart type changes

  const handleAiAnalysis = async () => {
    setAnalyzing(true);
    const result = await analyzeChartTrend(pair.symbol, pair.price, pair.change);
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  const closeMenus = () => setActiveMenu(null);

  // --- UI Components ---
  const DrawingsModal = () => (
    <div className="absolute left-14 top-14 z-50 w-[360px] bg-[#1e222d] border border-[#2a2e39] rounded-lg shadow-xl flex flex-col text-sm">
      <div className="p-3 border-b border-[#2a2e39] flex justify-between items-center bg-[#1e222d] rounded-t-lg">
        <h3 className="text-zinc-200 font-medium">Drawings</h3>
        <button onClick={closeMenus}><X size={16} className="text-zinc-400 hover:text-white"/></button>
      </div>
      <div className="p-2 border-b border-[#2a2e39]">
        <div className="relative">
          <Search className="absolute left-2 top-2 text-zinc-500 w-4 h-4"/>
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-[#2a2e39] rounded border border-[#363a45] py-1.5 pl-8 pr-2 text-zinc-200 focus:outline-none focus:border-[#2962ff]"
          />
        </div>
      </div>
      <div className="flex h-[400px]">
        {/* Categories Sidebar */}
        <div className="w-12 border-r border-[#2a2e39] flex flex-col items-center py-2 space-y-1 bg-[#1e222d]">
             {['Trend lines', 'Gann and Fibonacci', 'Geometric shapes', 'Annotation', 'Patterns', 'Prediction'].map(cat => {
                const isActive = drawingCategory === cat;
                let Icon = Pencil;
                if(cat.includes('Gann')) Icon = TrendingUp;
                if(cat.includes('Geometric')) Icon = Star;
                if(cat.includes('Annotation')) Icon = Type;
                if(cat.includes('Patterns')) Icon = BrainCircuit;
                if(cat.includes('Prediction')) Icon = MoreVertical;

                return (
                 <button 
                  key={cat} 
                  onClick={() => setDrawingCategory(cat)} 
                  className={`p-2 rounded hover:bg-[#2a2e39] transition-colors ${isActive ? 'text-[#2962ff] bg-[#2a2e39]' : 'text-zinc-400'}`} 
                  title={cat}
                 >
                   <Icon size={18}/>
                 </button>
                );
             })}
        </div>
        
        {/* Tools Grid */}
        <div className="flex-1 overflow-y-auto p-2 bg-[#1e222d]">
           <div className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider px-2">{drawingCategory}</div>
           <div className="grid grid-cols-3 gap-1">
             {DRAWING_TOOLS.filter(t => t.category === drawingCategory).map(tool => {
               const Icon = tool.icon;
               return (
                 <button 
                   key={tool.name}
                   onClick={() => {
                     setSelectedDrawingTool(tool.name);
                     closeMenus();
                   }}
                   className={`flex flex-col items-center justify-center p-2 rounded hover:bg-[#2a2e39] transition-colors gap-2 h-20 border border-transparent hover:border-[#2a2e39] ${selectedDrawingTool === tool.name ? 'bg-[#2a2e39] text-[#2962ff]' : 'text-zinc-400'}`}
                 >
                   <Icon size={20} />
                   <span className="text-[10px] text-center leading-tight line-clamp-2">{tool.name}</span>
                 </button>
               )
             })}
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full relative select-none bg-[#131722] font-sans overflow-hidden">
      
      {/* --- Top Toolbar (TradingView Exact) --- */}
      <div className="h-12 border-b border-[#2a2e39] flex items-center px-2 gap-0 bg-[#131722] z-40 text-[#d1d4dc]">
        
        {/* Symbol */}
        <div className="flex items-center">
            <button className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2e39] rounded transition-colors mr-2">
            <div className="w-5 h-5 rounded-full bg-[#2962ff] flex items-center justify-center text-[10px] font-bold text-white">
                {pair.symbol.substring(0,1)}
            </div>
            <div className="flex flex-col items-start leading-none">
                <span className="font-bold text-sm text-white">{pair.symbol}</span>
                <span className="text-[9px] text-zinc-500">NSE</span>
            </div>
            </button>
        </div>
        
        <div className="w-[1px] h-5 bg-[#2a2e39] mx-2"></div>

        {/* Timeframes */}
        <div className="hidden md:flex items-center gap-0">
          {['1m', '5m', '15m', '1h', '4h', 'D'].map(tf => (
            <button 
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-2 text-sm font-medium hover:bg-[#2a2e39] hover:text-[#2962ff] transition-colors ${timeframe === tf ? 'text-[#2962ff]' : 'text-[#d1d4dc]'}`}
            >
              {tf}
            </button>
          ))}
          <button className="px-2 py-2 hover:bg-[#2a2e39] text-[#d1d4dc]"><ChevronDown size={14}/></button>
        </div>

        <div className="w-[1px] h-5 bg-[#2a2e39] mx-2"></div>

        {/* Chart Types */}
        <div className="flex items-center gap-0">
            <button onClick={() => setActiveMenu(activeMenu === 'type' ? null : 'type')} className="p-2 hover:bg-[#2a2e39] rounded text-[#d1d4dc] hover:text-[#2962ff]" title="Chart Style">
                {chartType === 'Candles' ? <MoreVertical size={20} className="rotate-90"/> : <BrainCircuit size={20}/>}
            </button>

            {/* Indicators */}
            <button onClick={() => setActiveMenu('indicators')} className="flex items-center gap-1 px-3 py-2 hover:bg-[#2a2e39] rounded text-[#d1d4dc] hover:text-[#2962ff]" title="Indicators">
                <BrainCircuit size={18} />
                <span className="hidden lg:inline text-sm font-medium">Indicators</span>
            </button>
        </div>

        {/* Templates, Alert, Replay */}
        <div className="flex items-center gap-1 ml-1">
             <button className="p-2 hover:bg-[#2a2e39] rounded text-[#d1d4dc]" title="Templates"><LayoutTemplate size={18} /></button>
             <button className="p-2 hover:bg-[#2a2e39] rounded text-[#d1d4dc]" title="Create Alert"><Bell size={18} /></button>
             <button className="p-2 hover:bg-[#2a2e39] rounded text-[#d1d4dc]" title="Replay"><Undo2 size={18} /></button>
        </div>
        
        <div className="flex-1"></div>

        {/* AI Action Button (Blue) */}
        <button 
            onClick={handleAiAnalysis}
            className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded bg-[#2962ff] text-white text-xs font-semibold hover:bg-[#1e54e8] transition-colors ml-4"
        >
            {analyzing ? <Settings className="animate-spin" size={14} /> : <BrainCircuit size={14} />}
            <span>AI Check</span>
        </button>

        {/* Right Tool Actions */}
        <div className="flex items-center gap-0 ml-2 border-l border-[#2a2e39] pl-2">
            <button className="p-2 hover:bg-[#2a2e39] rounded text-[#d1d4dc]"><Settings size={18}/></button>
            <button className="p-2 hover:bg-[#2a2e39] rounded text-[#d1d4dc]"><Maximize2 size={18}/></button>
            <button className="p-2 hover:bg-[#2a2e39] rounded text-[#d1d4dc]"><Camera size={18}/></button>
        </div>
      </div>

      <div className="flex-1 relative flex overflow-hidden">
        
        {/* --- Left Toolbar (TradingView Exact) --- */}
        <div className="w-[52px] border-r border-[#2a2e39] flex flex-col items-center py-2 bg-[#131722] z-30 shrink-0 select-none">
           {/* Crosshair Group */}
           <ToolButton icon={Crosshair} active={selectedDrawingTool === 'Cursor'} onClick={() => setSelectedDrawingTool('Cursor')} hasSub />
           
           <div className="w-6 h-[1px] bg-[#2a2e39] my-1"></div>
           
           {/* Drawing Groups */}
           <ToolButton icon={Pencil} active={['Trend Line', 'Ray', 'Info Line'].includes(selectedDrawingTool)} onClick={() => setActiveMenu(activeMenu === 'drawings' ? null : 'drawings')} hasSub />
           <ToolButton icon={TrendingUp} active={selectedDrawingTool.includes('Fib')} onClick={() => setActiveMenu(activeMenu === 'drawings' ? null : 'drawings')} hasSub />
           <ToolButton icon={Star} active={selectedDrawingTool.includes('Brush')} onClick={() => setActiveMenu(activeMenu === 'drawings' ? null : 'drawings')} hasSub />
           <ToolButton icon={Type} active={selectedDrawingTool === 'Text'} onClick={() => setActiveMenu(activeMenu === 'drawings' ? null : 'drawings')} hasSub />
           <ToolButton icon={BrainCircuit} active={selectedDrawingTool.includes('Pattern')} onClick={() => setActiveMenu(activeMenu === 'drawings' ? null : 'drawings')} hasSub />
           <ToolButton icon={MoreVertical} active={selectedDrawingTool.includes('Position')} onClick={() => setActiveMenu(activeMenu === 'drawings' ? null : 'drawings')} hasSub />
           <ToolButton icon={Smile} active={selectedDrawingTool === 'Icon'} onClick={() => {}} hasSub />
           
           <div className="w-6 h-[1px] bg-[#2a2e39] my-1"></div>

           {/* Utility Tools */}
           <ToolButton icon={Ruler} onClick={() => {}} />
           <ToolButton icon={ZoomIn} onClick={() => {}} />
           <ToolButton icon={Magnet} onClick={() => {}} />
           <ToolButton icon={Lock} onClick={() => {}} />
           <ToolButton icon={Eye} onClick={() => {}} />
           <ToolButton icon={Trash2} onClick={() => {}} />
        </div>

        {/* --- Main Chart Container (Lightweight Charts) --- */}
        <div className="flex-1 relative w-full h-full bg-[#131722] overflow-hidden">
          
          {/* Overlays/Modals */}
          {activeMenu === 'drawings' && <DrawingsModal />}
          
          {activeMenu === 'type' && (
             <div className="absolute top-1 left-2 z-50 w-40 bg-[#1e222d] border border-[#2a2e39] rounded shadow-xl py-1">
               {CHART_TYPES.map(t => (
                 <button key={t.label} onClick={() => { setChartType(t.type as ChartType); closeMenus(); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2e39] ${chartType === t.type ? 'text-[#2962ff]' : 'text-[#d1d4dc]'}`}>{t.label}</button>
               ))}
             </div>
          )}

          {/* Indicators Legend (Top Left Overlay) */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
             <div className="flex items-center gap-2 text-sm font-bold text-[#d1d4dc]">
                <span className="cursor-pointer pointer-events-auto hover:text-white text-lg">{pair.symbol}</span>
                <span className="text-zinc-500 text-xs px-1 border border-zinc-700 rounded">{timeframe}</span>
                <span className="text-zinc-500 text-xs">NSE</span>
             </div>
             <div className="flex flex-col items-start gap-1 mt-1">
                <div className="flex items-center gap-2 text-xs">
                    <span className={`font-mono ${pair.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        O{currentDataRef.current[currentDataRef.current.length-1]?.open.toFixed(2)} 
                        H{currentDataRef.current[currentDataRef.current.length-1]?.high.toFixed(2)} 
                        L{currentDataRef.current[currentDataRef.current.length-1]?.low.toFixed(2)} 
                        C{currentDataRef.current[currentDataRef.current.length-1]?.close.toFixed(2)}
                    </span>
                    <span className={`${pair.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'} font-bold`}>
                        {pair.change >= 0 ? '+' : ''}{pair.change}%
                    </span>
                </div>

                {activeIndicators.map(ind => (
                   <div key={ind} className="flex items-center gap-2 text-[11px] text-[#d1d4dc] pointer-events-auto cursor-pointer group hover:bg-[#2a2e39] px-1 rounded">
                      <Eye size={12} className="text-zinc-500 hover:text-white"/>
                      <span className="font-semibold text-[#2962ff]">{ind}</span>
                      <span className="text-[#f23645]">14 close 0 SMA 14 2</span>
                      <Settings size={12} className="hidden group-hover:block text-zinc-500 hover:text-white"/>
                      <X size={12} onClick={() => setActiveIndicators(activeIndicators.filter(i => i !== ind))} className="hidden group-hover:block text-zinc-500 hover:text-white"/>
                   </div>
                ))}
             </div>
          </div>

          {/* AI Analysis Popup */}
          {aiAnalysis && (
            <div className="absolute top-4 right-16 z-30 max-w-sm w-full animate-in fade-in slide-in-from-right-5 duration-300">
              <div className="bg-[#1e222d] border border-[#2962ff] p-4 rounded shadow-2xl relative">
                <button onClick={() => setAiAnalysis(null)} className="absolute top-2 right-2 text-zinc-500 hover:text-white"><X size={14} /></button>
                <div className="flex items-start gap-3">
                  <BrainCircuit className="text-[#2962ff] shrink-0" size={18} />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">AI Insight</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">{aiAnalysis}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actual Chart Canvas Container */}
          <div ref={chartContainerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

// Reusable Tool Button Component
const ToolButton = ({ icon: Icon, active, onClick, hasSub }: { icon: any, active?: boolean, onClick: () => void, hasSub?: boolean }) => (
    <button 
        onClick={onClick}
        className={`w-10 h-10 flex items-center justify-center rounded hover:bg-[#2a2e39] transition-colors relative group ${active ? 'text-[#2962ff]' : 'text-[#d1d4dc]'}`}
    >
        <Icon size={20} strokeWidth={1.5} />
        {hasSub && <div className="absolute bottom-2 right-2 w-0 h-0 border-l-[3px] border-l-transparent border-t-[3px] border-t-[#787b86] border-r-[3px] border-r-transparent transform rotate-180"></div>}
        {hasSub && <div className="absolute right-0 top-0 bottom-0 w-3 opacity-0 group-hover:opacity-100"></div>}
    </button>
);

export default ChartArea;
