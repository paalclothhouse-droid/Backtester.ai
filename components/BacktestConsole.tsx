
import React, { useState, useEffect } from 'react';
import { runBacktest } from '../services/geminiService';
import { Pair, BacktestResult } from '../types';
import { Play, Loader2, Calendar, Sparkles, Activity, Save, BookOpen, Trash2, X, ChevronRight, Code, MessageSquare, Copy } from 'lucide-react';

interface BacktestConsoleProps {
  pair: Pair;
}

interface SavedStrategy {
  id: string;
  name: string;
  description: string;
  timestamp: number;
}

const BacktestConsole: React.FC<BacktestConsoleProps> = ({ pair }) => {
  const [activeMode, setActiveMode] = useState<'strategy' | 'pine'>('strategy');
  const [strategy, setStrategy] = useState('');
  const [pineCode, setPineCode] = useState('// Your Pine Script will appear here after running a strategy simulation...');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);

  // Strategy Management State
  const [showLibrary, setShowLibrary] = useState(false);
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveName, setSaveName] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tradeMind_strategies');
      if (stored) {
        setSavedStrategies(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load strategies", e);
    }
  }, []);

  const handleSave = () => {
    if (!saveName.trim() || !strategy.trim()) return;
    const newStrategy: SavedStrategy = {
      id: Date.now().toString(),
      name: saveName.trim(),
      description: strategy,
      timestamp: Date.now()
    };
    const updated = [newStrategy, ...savedStrategies];
    setSavedStrategies(updated);
    localStorage.setItem('tradeMind_strategies', JSON.stringify(updated));
    setSaveName('');
    setIsSaving(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedStrategies.filter(s => s.id !== id);
    setSavedStrategies(updated);
    localStorage.setItem('tradeMind_strategies', JSON.stringify(updated));
  };

  const handleLoad = (s: SavedStrategy) => {
    setStrategy(s.description);
    setShowLibrary(false);
  };

  const handleRun = async () => {
    if (!strategy.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await runBacktest({
        pair: pair.symbol,
        startDate,
        endDate,
        description: strategy,
      });
      setResult(res);
      if (res.pineScriptCode) {
        setPineCode(res.pineScriptCode);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Panel: Input & Editor */}
      <div className="w-full md:w-1/3 p-4 border-b md:border-b-0 md:border-r border-white/5 flex flex-col space-y-4 shrink-0 bg-black/20">
        
        {/* Header with Mode Switcher */}
        <div className="flex items-center justify-between">
           <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
             <button 
               onClick={() => setActiveMode('strategy')}
               className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${activeMode === 'strategy' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               <MessageSquare size={12} /> Prompt
             </button>
             <button 
               onClick={() => setActiveMode('pine')}
               className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${activeMode === 'pine' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               <Code size={12} /> Pine Editor
             </button>
           </div>

          <button 
            onClick={() => {
              setShowLibrary(!showLibrary);
              setIsSaving(false);
            }}
            className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
            title="Strategy Library"
          >
            {showLibrary ? <X size={18} /> : <BookOpen size={18} />}
          </button>
        </div>
        
        {/* Content Area */}
        {showLibrary ? (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {savedStrategies.length === 0 ? (
              <div className="text-center text-zinc-500 text-sm mt-10">No saved strategies.</div>
            ) : (
              savedStrategies.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => handleLoad(s)}
                  className="group p-3 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/50 hover:bg-white/10 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-zinc-200 text-sm group-hover:text-white">{s.name}</h4>
                    <button onClick={(e) => handleDelete(s.id, e)} className="text-zinc-600 hover:text-red-400 p-1"><Trash2 size={14} /></button>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{s.description}</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-2 overflow-hidden">
             {activeMode === 'strategy' ? (
               <div className="relative flex-1 group flex flex-col">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-20 group-hover:opacity-50 blur transition duration-200 pointer-events-none"></div>
                  <textarea
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    placeholder="Describe your strategy (e.g. 'Buy when RSI < 30 and price crosses above 200 EMA'). The AI will analyze this and generate Pine Script."
                    className="relative w-full h-full bg-zinc-900 text-zinc-100 p-4 rounded-xl border border-white/5 focus:border-transparent focus:ring-0 outline-none resize-none text-sm placeholder:text-zinc-600 font-medium"
                  />
                  {!isSaving && strategy.trim() && (
                    <button onClick={() => setIsSaving(true)} className="absolute bottom-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-lg text-zinc-400 hover:text-purple-400 border border-white/10 transition-all">
                      <Save size={16} />
                    </button>
                  )}
                  {isSaving && (
                  <div className="absolute bottom-2 left-2 right-2 flex gap-2 p-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 z-20">
                    <input 
                      type="text" 
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      placeholder="Name..."
                      className="flex-1 bg-transparent border-b border-purple-500 text-sm text-white focus:outline-none"
                      autoFocus
                    />
                    <button onClick={handleSave} className="text-purple-400"><ChevronRight size={16} /></button>
                  </div>
                )}
               </div>
             ) : (
               <div className="flex-1 relative bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden group">
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={() => navigator.clipboard.writeText(pineCode)}
                       className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-md"
                       title="Copy Code"
                     >
                       <Copy size={14} />
                     </button>
                  </div>
                  <textarea 
                    value={pineCode}
                    readOnly
                    className="w-full h-full bg-transparent text-green-400 p-4 font-mono text-xs resize-none focus:outline-none custom-scrollbar"
                  />
               </div>
             )}

            <div className="flex gap-2">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="flex-1 bg-black/40 border border-white/10 text-zinc-300 text-xs rounded-lg p-2 outline-none" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="flex-1 bg-black/40 border border-white/10 text-zinc-300 text-xs rounded-lg p-2 outline-none" />
            </div>
            
            <button
              onClick={handleRun}
              disabled={loading || !strategy}
              className="relative overflow-hidden group bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
                  {loading ? 'Simulate & Gen Code' : 'Run Backtest'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Right Panel: Results */}
      <div className="flex-1 p-6 relative overflow-hidden flex flex-col">
        {!result && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
             <div className="p-4 rounded-full bg-white/5 border border-white/5">
                <Activity size={32} />
             </div>
             <p className="text-sm font-medium">Ready to analyze market data</p>
          </div>
        )}
        
        {loading && (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
             <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse"></div>
                <Loader2 size={48} className="text-purple-500 animate-spin relative z-10" />
             </div>
             <p className="text-zinc-400 text-sm animate-pulse">Running Monte Carlo Simulations...</p>
          </div>
        )}

        {result && (
          <div className="relative z-10 flex-1 flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ResultCard label="Win Rate" value={`${result.winRate}%`} trend={result.winRate > 50 ? 'up' : 'down'} color={result.winRate > 50 ? "text-emerald-400" : "text-amber-400"} />
                <ResultCard label="Net Profit" value={`${result.netProfit > 0 ? '+' : ''}${result.netProfit}%`} trend={result.netProfit > 0 ? 'up' : 'down'} color={result.netProfit > 0 ? "text-emerald-400" : "text-rose-400"} />
                <ResultCard label="Profit Factor" value={result.profitFactor.toFixed(2)} trend="neutral" color="text-blue-400" />
                <ResultCard label="Max Drawdown" value={`-${result.maxDrawdown}%`} trend="down" color="text-rose-400" />
            </div>
            
            <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
               <h4 className="text-sm font-bold text-zinc-300 mb-2 flex items-center gap-2"><Sparkles size={14} className="text-purple-400"/> AI Strategy Analysis</h4>
               <p className="text-sm text-zinc-400 leading-relaxed overflow-y-auto custom-scrollbar flex-1">
                 {result.analysis}
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ResultCard = ({ label, value, color, trend }: { label: string, value: string, color: string, trend: 'up' | 'down' | 'neutral' }) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-between hover:bg-white/10 transition-colors group">
    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2">{label}</span>
    <span className={`text-2xl font-bold tracking-tight ${color} group-hover:scale-105 transition-transform`}>{value}</span>
  </div>
);

export default BacktestConsole;
