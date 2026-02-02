
import React, { useEffect, useState, useRef } from 'react';
import { MOCK_PAIRS } from '../constants';
import { Pair } from '../types';
import { Search, List, MoreHorizontal } from 'lucide-react';

interface PairsPanelProps {
  selectedPair: Pair;
  onSelectPair: (pair: Pair) => void;
}

const PairsPanel: React.FC<PairsPanelProps> = ({ selectedPair, onSelectPair }) => {
  // Local state to simulate live prices independent of the chart
  const [pairs, setPairs] = useState(MOCK_PAIRS);
  const prevPricesRef = useRef<Record<string, number>>({});
  const [flashStates, setFlashStates] = useState<Record<string, 'up' | 'down' | null>>({});

  useEffect(() => {
    // Initialize refs
    MOCK_PAIRS.forEach(p => prevPricesRef.current[p.symbol] = p.price);

    const interval = setInterval(() => {
      setPairs(currentPairs => {
        const newFlashStates: Record<string, 'up' | 'down' | null> = {};
        
        const updatedPairs = currentPairs.map(pair => {
          // Simulate random tick
          const shouldUpdate = Math.random() > 0.7; // 30% chance to update
          if (!shouldUpdate) return pair;

          const volatility = 0.0005; // 0.05% move
          const move = (Math.random() - 0.5) * pair.price * volatility;
          const newPrice = pair.price + move;
          
          // Determine flash direction
          if (newPrice > pair.price) {
            newFlashStates[pair.symbol] = 'up';
          } else if (newPrice < pair.price) {
            newFlashStates[pair.symbol] = 'down';
          }

          prevPricesRef.current[pair.symbol] = pair.price;

          return {
            ...pair,
            price: newPrice,
            change: pair.change + (move / pair.price) * 100
          };
        });

        // Trigger flash
        setFlashStates(newFlashStates);
        
        // Clear flash after short delay
        setTimeout(() => {
          setFlashStates({});
        }, 300);

        return updatedPairs;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#131722] text-[#d1d4dc] border-r border-[#2a2e39]">
      <div className="p-3 border-b border-[#2a2e39] space-y-3">
        <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm text-[#d1d4dc] tracking-tight">Watchlist</h3>
            <div className="flex gap-1">
                 <button className="text-[#d1d4dc] hover:bg-[#2a2e39] p-1.5 rounded"><Search size={16}/></button>
                 <button className="text-[#d1d4dc] hover:bg-[#2a2e39] p-1.5 rounded"><MoreHorizontal size={16}/></button>
            </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
         <div className="flex px-4 py-2 text-[10px] text-[#787b86] font-bold uppercase tracking-wider">
            <div className="flex-1">Symbol</div>
            <div className="w-20 text-right">Last</div>
            <div className="w-16 text-right">Chg%</div>
         </div>

         {pairs.map(pair => {
            const isSelected = selectedPair.symbol === pair.symbol;
            const flash = flashStates[pair.symbol];
            
            // Flash Background Logic
            let bgClass = "";
            if (flash === 'up') bgClass = "bg-[#089981]/20";
            else if (flash === 'down') bgClass = "bg-[#f23645]/20";
            else if (isSelected) bgClass = "bg-[#2a2e39]";
            else bgClass = "hover:bg-[#2a2e39]";

            return (
            <div
                key={pair.symbol}
                onClick={() => onSelectPair(pair)}
                className={`flex justify-between items-center px-4 py-2.5 cursor-pointer transition-colors duration-200 border-b border-[#2a2e39]/50 ${bgClass}`}
            >
                <div className="flex-1 flex flex-col">
                    <span className="text-xs font-bold text-[#d1d4dc]">{pair.symbol}</span>
                    <span className="text-[10px] text-[#787b86]">{pair.category}</span>
                </div>
                
                <div className={`w-20 text-right text-xs font-mono font-medium transition-colors ${flash === 'up' ? 'text-[#089981]' : flash === 'down' ? 'text-[#f23645]' : 'text-[#d1d4dc]'}`}>
                    {pair.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                
                <div className={`w-16 text-right text-xs font-medium ${
                    pair.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                }`}>
                    {pair.change > 0 ? '+' : ''}{pair.change.toFixed(2)}%
                </div>
            </div>
            );
        })}
      </div>
    </div>
  );
};

export default PairsPanel;
