
import React from 'react';
import { MOCK_PAIRS } from '../constants';
import { Pair } from '../types';
import { Search, List } from 'lucide-react';

interface PairsPanelProps {
  selectedPair: Pair;
  onSelectPair: (pair: Pair) => void;
}

const PairsPanel: React.FC<PairsPanelProps> = ({ selectedPair, onSelectPair }) => {
  const categories = Array.from(new Set(MOCK_PAIRS.map(p => p.category)));

  return (
    <div className="flex flex-col h-full bg-[#131722] text-[#d1d4dc]">
      <div className="p-3 border-b border-[#2a2e39] space-y-3">
        <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm text-[#d1d4dc] tracking-tight">Watchlist</h3>
            <button className="text-[#d1d4dc] hover:bg-[#2a2e39] p-1 rounded"><List size={16}/></button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
         {/* Simple Table Header */}
         <div className="flex px-4 py-2 text-[11px] text-[#787b86] font-semibold">
            <div className="flex-1">Symbol</div>
            <div className="w-16 text-right">Last</div>
            <div className="w-16 text-right">Chg%</div>
         </div>

         {MOCK_PAIRS.map(pair => {
            const isSelected = selectedPair.symbol === pair.symbol;
            return (
            <div
                key={pair.symbol}
                onClick={() => onSelectPair(pair)}
                className={`flex justify-between items-center px-4 py-2 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#2a2e39]' : 'hover:bg-[#2a2e39]'
                }`}
            >
                <div className="flex-1 flex flex-col">
                    <span className="text-sm font-semibold text-[#d1d4dc]">{pair.symbol}</span>
                    <span className="text-[10px] text-[#787b86]">{pair.category}</span>
                </div>
                
                <div className="w-16 text-right text-sm font-mono text-[#d1d4dc]">
                    {pair.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                
                <div className={`w-16 text-right text-xs font-medium ${
                    pair.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                }`}>
                    {pair.change > 0 ? '+' : ''}{pair.change}%
                </div>
            </div>
            );
        })}
      </div>
    </div>
  );
};

export default PairsPanel;
