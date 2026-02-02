import React from 'react';
import ToolsSidebar from './ToolsSidebar';
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
    <div className="flex h-screen w-screen overflow-hidden bg-black text-zinc-200 p-3 gap-3">
      {/* Background Gradient Mesh (Subtle) */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />

      {/* Left: Floating Tools Dock */}
      <div className="relative z-10 w-16 flex flex-col shrink-0">
        <div className="glass-panel rounded-3xl h-full flex flex-col items-center py-6 shadow-2xl">
          <ToolsSidebar activeTool={activeTool} onToolSelect={setActiveTool} />
        </div>
      </div>

      {/* Middle: Chart + AI */}
      <div className="relative z-10 flex flex-col flex-1 min-w-0 gap-3">
        {/* Chart Area */}
        <div className="glass-panel rounded-3xl flex-1 flex flex-col overflow-hidden relative shadow-2xl">
          <ChartArea pair={selectedPair} activeTool={activeTool} />
        </div>
        
        {/* Backtester */}
        <div className="glass-panel rounded-3xl h-80 shrink-0 overflow-hidden shadow-2xl">
          <BacktestConsole pair={selectedPair} />
        </div>
      </div>

      {/* Right: Pairs + News */}
      <div className="relative z-10 w-80 flex flex-col gap-3 min-w-[320px] shrink-0">
        <div className="glass-panel rounded-3xl flex-1 overflow-hidden flex flex-col shadow-2xl">
          <PairsPanel selectedPair={selectedPair} onSelectPair={setSelectedPair} />
        </div>
        <div className="glass-panel rounded-3xl h-1/2 overflow-hidden flex flex-col shadow-2xl">
          <NewsPanel />
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;