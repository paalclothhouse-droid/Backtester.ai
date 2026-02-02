
import React from 'react';
import { BROKERS } from '../constants';
import { Star, ShieldCheck } from 'lucide-react';

const BrokersView: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-white mb-6">Trade with your broker</h2>
      
      <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4">
         {/* Featured Card (Full Width) */}
         <div className="col-span-2 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-4 border border-purple-500/20 flex items-center justify-between">
            <div>
               <h3 className="text-white font-bold text-lg">Paper Trading</h3>
               <p className="text-zinc-400 text-xs mt-1">Practice with $100k virtual</p>
               <button className="mt-3 bg-white text-black text-xs font-bold px-4 py-2 rounded-full">Connect</button>
            </div>
            <div className="text-4xl">📝</div>
         </div>

         {/* Broker Grid */}
         {BROKERS.filter(b => b.id !== 'paper').map(broker => (
            <div key={broker.id} className="bg-[#1c1c1e] rounded-xl p-4 border border-[#2c2c2e] flex flex-col items-center justify-center gap-3 hover:bg-[#2c2c2e] transition-colors cursor-pointer group">
               <div className="w-12 h-12 rounded-full bg-[#2a2e39] flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  {broker.logo}
               </div>
               <div className="text-center">
                  <h4 className="text-white font-bold text-sm">{broker.name}</h4>
                  <div className="flex items-center justify-center gap-1 mt-1">
                     <Star size={10} className="fill-yellow-500 text-yellow-500"/>
                     <span className="text-zinc-400 text-xs">{broker.rating}</span>
                  </div>
               </div>
               {broker.type === 'Crypto' && <span className="absolute top-2 right-2 text-[8px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded">CRYPTO</span>}
            </div>
         ))}
         
         <div className="col-span-2 mt-4 p-4 rounded-xl bg-[#1c1c1e] border border-dashed border-[#2c2c2e] flex flex-col items-center justify-center text-center">
            <ShieldCheck className="text-zinc-500 mb-2" size={24} />
            <p className="text-zinc-400 text-xs">All brokers are verified and secure.</p>
         </div>
      </div>
    </div>
  );
};

export default BrokersView;
