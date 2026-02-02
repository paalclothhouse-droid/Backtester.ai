import React from 'react';
import { MOCK_NEWS } from '../constants';
import { Globe, ExternalLink } from 'lucide-react';

const NewsPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-transparent to-black/20">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Globe className="text-purple-500 w-4 h-4" />
          <span className="font-bold text-zinc-200">Global News</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Live</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {MOCK_NEWS.map(news => (
          <div key={news.id} className="group p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/30 hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
                {news.time} • {news.source}
              </span>
              <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-purple-400 transition-colors" />
            </div>
            <h4 className="text-sm font-medium text-zinc-200 leading-snug group-hover:text-white transition-colors">
              {news.title}
            </h4>
            <div className="mt-3 flex gap-2">
               <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                 news.sentiment === 'positive' ? 'border-green-500/20 text-green-400 bg-green-500/5' : 
                 news.sentiment === 'negative' ? 'border-red-500/20 text-red-400 bg-red-500/5' : 
                 'border-zinc-500/20 text-zinc-400 bg-zinc-500/5'
               }`}>
                 {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPanel;