'use client';

import { Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 lg:px-10 py-3.5 bg-white/80 backdrop-blur-lg border-b border-[#E5E5EA]">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#0071E3] to-[#40A9FF] shadow-sm shadow-blue-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-semibold text-[#1D1D1F] tracking-tight">
          Resumize
        </span>
      </div>
      <div className="flex items-center gap-2 bg-[#F5F5F7] px-3 py-1.5 rounded-full">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-xs text-[#86868B] font-medium">Online</span>
      </div>
    </header>
  );
}
