import React, { useState } from 'react';
import { Pair } from '../types';
import ChartArea from './ChartArea';
import BacktestConsole from './BacktestConsole';
import PairsPanel from './PairsPanel';
import NewsPanel from './NewsPanel';
import { BarChart2, Zap, List, Globe, LucideIcon } from 'lucide-react';

interface MobileLayoutProps {
  selectedPair: Pair;
  setSelectedPair: (pair: Pair) => void;
  activeTool: string;
  setActiveTool: (tool: string) => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  selectedPair,
  setSelectedPair,
  activeTool,
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'backtest' | 'watchlist' | 'news'>('chart');

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-zinc-200 overflow-hidden">
        {/* Background Mesh for Mobile */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-black pointer-events-none" />

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
        {activeTab === 'chart' && (
          <div className="h-full flex flex-col">
            <div className="p-4 bg-transparent shrink-0">
               {/* Header is handled inside ChartArea mostly, but we can add a simple back/menu if needed */}
            </div>
            <div className="flex-1">
                <ChartArea pair={selectedPair} activeTool={activeTool} />
            </div>
          </div>
        )}

        {activeTab === 'backtest' && (
           <div className="h-full flex flex-col p-4">
             <div className="flex-1 glass-panel rounded-3xl overflow-hidden shadow-2xl">
               <BacktestConsole pair={selectedPair} />
             </div>
           </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="h-full flex flex-col p-4">
            <div className="flex-1 glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                <PairsPanel selectedPair={selectedPair} onSelectPair={(p) => {
                  setSelectedPair(p);
                  setActiveTab('chart');
                }} />
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="h-full flex flex-col p-4">
            <div className="flex-1 glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              <NewsPanel />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Navigation */}
      <div className="p-4 z-20 shrink-0">
          <div className="h-20 glass-panel rounded-3xl flex justify-around items-center px-2 shadow-2xl border border-white/10">
            <NavButton 
            active={activeTab === 'chart'} 
            onClick={() => setActiveTab('chart')} 
            icon={BarChart2} 
            label="Chart" 
            />
            <NavButton 
            active={activeTab === 'backtest'} 
            onClick={() => setActiveTab('backtest')} 
            icon={Zap} 
            label="AI" 
            />
            <NavButton 
            active={activeTab === 'watchlist'} 
            onClick={() => setActiveTab('watchlist')} 
            icon={List} 
            label="Pairs" 
            />
            <NavButton 
            active={activeTab === 'news'} 
            onClick={() => setActiveTab('news')} 
            icon={Globe} 
            label="News" 
            />
        </div>
      </div>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
      active ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
    }`}
  >
    {active && (
        <div className="absolute -top-1 w-8 h-1 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse" />
    )}
    <Icon size={24} className={`transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`} />
    <span className="text-[10px] font-bold tracking-wide">{label}</span>
  </button>
);

export default MobileLayout;