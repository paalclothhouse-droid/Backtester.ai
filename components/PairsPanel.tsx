import React from 'react';
import { MOCK_PAIRS } from '../constants';
import { Pair } from '../types';
import { Search } from 'lucide-react';

interface PairsPanelProps {
  selectedPair: Pair;
  onSelectPair: (pair: Pair) => void;
}

const PairsPanel: React.FC<PairsPanelProps> = ({ selectedPair, onSelectPair }) => {
  const categories = Array.from(new Set(MOCK_PAIRS.map(p => p.category)));

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/5 space-y-3">
        <h3 className="font-bold text-lg text-white tracking-tight">Market Pairs</h3>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-zinc-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-6">
        {categories.map(category => (
          <div key={category} className="space-y-2">
            <div className="px-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {category}
            </div>
            <div className="space-y-1">
              {MOCK_PAIRS.filter(p => p.category === category).map(pair => {
                 const isSelected = selectedPair.symbol === pair.symbol;
                 return (
                  <div
                    key={pair.symbol}
                    onClick={() => onSelectPair(pair)}
                    className={`flex justify-between items-center p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                      isSelected 
                        ? 'bg-white/10 border-purple-500/50 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]' 
                        : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isSelected ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {pair.symbol.substring(0,2)}
                      </div>
                      <div>
                        <div className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                          {pair.symbol}
                        </div>
                        <div className="text-[10px] text-zinc-500">{pair.name}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-mono font-medium text-sm text-zinc-200">
                        {pair.price.toLocaleString()}
                      </div>
                      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-block ${
                        pair.change >= 0 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {pair.change > 0 ? '+' : ''}{pair.change}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PairsPanel;