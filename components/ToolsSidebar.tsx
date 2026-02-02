import React from 'react';
import { TOOLS } from '../constants';

interface ToolsSidebarProps {
  activeTool: string;
  onToolSelect: (toolId: string) => void;
}

const ToolsSidebar: React.FC<ToolsSidebarProps> = ({ activeTool, onToolSelect }) => {
  return (
    <div className="flex flex-col items-center space-y-6 w-full px-2">
      <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-600 tracking-tighter mb-2">
        TM
      </div>
      
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            title={tool.label}
            className={`p-3 rounded-2xl transition-all duration-300 relative group ${
              isActive 
                ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] scale-110' 
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            {/* Tooltip on hover */}
            <span className="absolute left-14 bg-zinc-800 text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none z-50">
              {tool.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ToolsSidebar;