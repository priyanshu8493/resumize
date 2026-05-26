'use client';

import { Sparkles, RotateCcw, ChevronRight } from 'lucide-react';
import { useResumeStore } from '@/lib/store';
import { useState } from 'react';

export function Navbar() {
  const isLocked = useResumeStore((s) => s.isLocked);
  const hasLatex = useResumeStore((s) => s.hasLatex);
  const reset = useResumeStore((s) => s.reset);
  const [confirmReset, setConfirmReset] = useState(false);

  const showReset = isLocked && hasLatex;

  const handleReset = () => {
    if (confirmReset) {
      reset();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 lg:px-10 py-3 bg-white/80 backdrop-blur-lg border-b border-[#E5E5EA]">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#0071E3] to-[#40A9FF] shadow-sm shadow-blue-500/20 transition-transform hover:scale-105">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-semibold text-[#1D1D1F] tracking-tight">
          Resumize
        </span>
        {showReset && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-[#A1A1A6]" />
            <span className="text-sm text-[#A1A1A6] font-medium">Your resume</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        {showReset && (
          <button
            onClick={handleReset}
            className={`flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg transition-all active:scale-95 ${
              confirmReset
                ? 'bg-red-50 text-red-500 border border-red-200'
                : 'text-[#6E6E73] hover:text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED]'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${confirmReset ? 'animate-spin' : ''}`} />
            {confirmReset ? 'Sure?' : 'Start Over'}
          </button>
        )}
        <div className="flex items-center gap-2 bg-[#F5F5F7] px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs text-[#86868B] font-medium">Online</span>
        </div>
      </div>
    </header>
  );
}
