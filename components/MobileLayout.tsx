
import React, { useState } from 'react';
import { Pair } from '../types';
import ChartArea from './ChartArea';
import BacktestConsole from './BacktestConsole';
import PairsPanel from './PairsPanel';
import NewsPanel from './NewsPanel';
import BrokersView from './BrokersView';
import { BarChart2, Zap, List, Globe, LucideIcon, Compass, Menu } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'watchlist' | 'chart' | 'explore' | 'community' | 'menu'>('chart');

  return (
    <div className="flex flex-col h-screen w-screen bg-[#000000] text-zinc-200 overflow-hidden">
      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
        {activeTab === 'chart' && (
          <div className="h-full flex flex-col">
            <ChartArea pair={selectedPair} activeTool={activeTool} />
          </div>
        )}

        {activeTab === 'explore' && (
           <div className="h-full flex flex-col p-4">
             <BrokersView />
           </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="h-full flex flex-col pt-4">
             <h2 className="text-2xl font-bold text-white px-4 mb-4">Watchlist</h2>
             <div className="flex-1 overflow-hidden rounded-t-3xl border-t border-[#2c2c2e] bg-[#1c1c1e]">
                <PairsPanel selectedPair={selectedPair} onSelectPair={(p) => {
                  setSelectedPair(p);
                  setActiveTab('chart');
                }} />
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="h-full flex flex-col pt-4">
            <h2 className="text-2xl font-bold text-white px-4 mb-4">Community</h2>
            <div className="flex-1 overflow-hidden rounded-t-3xl border-t border-[#2c2c2e] bg-[#1c1c1e]">
              <NewsPanel />
            </div>
          </div>
        )}
        
        {activeTab === 'menu' && (
            <div className="h-full flex flex-col p-4">
                <div className="flex-1 glass-panel rounded-3xl overflow-hidden shadow-2xl">
                     <BacktestConsole pair={selectedPair} />
                </div>
            </div>
        )}
      </div>

      {/* Bottom Floating Navigation (5 Tabs) */}
      <div className="pb-6 pt-2 px-2 z-20 shrink-0 bg-[#000000] border-t border-[#2c2c2e]">
          <div className="flex justify-around items-center">
            <NavButton active={activeTab === 'watchlist'} onClick={() => setActiveTab('watchlist')} icon={List} label="Watchlist" />
            <NavButton active={activeTab === 'chart'} onClick={() => setActiveTab('chart')} icon={BarChart2} label="Chart" />
            <NavButton active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} icon={Compass} label="Explore" />
            <NavButton active={activeTab === 'community'} onClick={() => setActiveTab('community')} icon={Globe} label="Community" />
            <NavButton active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} icon={Menu} label="Menu" />
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
    className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
      active ? 'text-white' : 'text-zinc-600'
    }`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} className={active ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default MobileLayout;
