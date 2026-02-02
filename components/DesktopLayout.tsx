
import React from 'react';
import PairsPanel from './PairsPanel';
import NewsPanel from './NewsPanel';
import ChartArea from './ChartArea';
import BacktestConsole from './BacktestConsole';
import { Pair } from '../types';

interface DesktopLayoutProps {
  selectedPair: Pair;
  setSelectedPair: (pair: Pair) => void;
  activeTool: string;
  setActiveTool: (tool: string) => void;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  selectedPair,
  setSelectedPair,
  activeTool,
  setActiveTool,
}) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#131722] text-[#d1d4dc] border-t border-[#2a2e39]">
      
      {/* Main Area: Chart + AI (Left Side) */}
      <div className="relative z-10 flex flex-col flex-1 min-w-0 border-r border-[#2a2e39]">
        {/* Chart Area - Expanded to take sidebar space */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-[#131722]">
          <ChartArea pair={selectedPair} activeTool={activeTool} />
        </div>
        
        {/* Backtester */}
        <div className="h-72 shrink-0 overflow-hidden border-t border-[#2a2e39] bg-[#131722]">
          <BacktestConsole pair={selectedPair} />
        </div>
      </div>

      {/* Right Sidebar: Pairs + News */}
      <div className="relative z-10 w-[320px] flex flex-col min-w-[320px] shrink-0 bg-[#131722]">
        <div className="flex-1 overflow-hidden flex flex-col border-b border-[#2a2e39]">
          <PairsPanel selectedPair={selectedPair} onSelectPair={setSelectedPair} />
        </div>
        <div className="h-1/3 overflow-hidden flex flex-col">
          <NewsPanel />
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;
