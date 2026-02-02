
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
    <div className="flex h-screen w-screen overflow-hidden bg-[#000000] text-[#d1d4dc] border-t border-[#2c2c2e]">
      
      {/* Main Area: Chart + AI (Left Side) */}
      <div className="relative z-10 flex flex-col flex-1 min-w-0 border-r border-[#2c2c2e]">
        {/* Chart Area - Expanded to take sidebar space */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-[#000000]">
          <ChartArea pair={selectedPair} activeTool={activeTool} />
        </div>
        
        {/* Backtester */}
        <div className="h-72 shrink-0 overflow-hidden border-t border-[#2c2c2e] bg-[#000000]">
          <BacktestConsole pair={selectedPair} />
        </div>
      </div>

      {/* Right Sidebar: Pairs + News */}
      <div className="relative z-10 w-[320px] flex flex-col min-w-[320px] shrink-0 bg-[#000000]">
        <div className="flex-1 overflow-hidden flex flex-col border-b border-[#2c2c2e]">
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
