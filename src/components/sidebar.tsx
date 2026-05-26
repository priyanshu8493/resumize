'use client';

import { useState } from 'react';
import { useResumeStore } from '@/lib/store';
import {
  Sparkles, RotateCcw, ChevronRight, ChevronLeft,
  Code2, Globe, Briefcase, FileText, CheckCircle2,
} from 'lucide-react';

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const reset = useResumeStore((s) => s.reset);
  const githubUrl = useResumeStore((s) => s.githubUrl);
  const linkedinUrl = useResumeStore((s) => s.linkedinUrl);
  const hasLatex = useResumeStore((s) => s.hasLatex);

  const handleReset = () => {
    reset();
    setExpanded(false);
  };

  if (expanded) {
    return (
      <div className="w-[280px] flex-shrink-0 border-r border-[#E5E5EA] bg-white flex flex-col animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5EA]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0071E3] to-[#40A9FF] flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#1D1D1F]">Your Inputs</span>
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="h-7 w-7 rounded-lg hover:bg-[#F5F5F7] flex items-center justify-center text-[#86868B] hover:text-[#1D1D1F] transition-colors"
            title="Collapse"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {githubUrl && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#6E6E73]">
                <Code2 className="w-3 h-3" />
                GitHub
              </div>
              <p className="text-sm text-[#1D1D1F] truncate bg-[#F5F5F7] rounded-lg px-3 py-2">
                {githubUrl.replace('https://', '')}
              </p>
            </div>
          )}

          {linkedinUrl && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#6E6E73]">
                <Globe className="w-3 h-3" />
                LinkedIn
              </div>
              <p className="text-sm text-[#1D1D1F] truncate bg-[#F5F5F7] rounded-lg px-3 py-2">
                {linkedinUrl.replace('https://', '')}
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#6E6E73]">
              <FileText className="w-3 h-3" />
              Master Resume
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Provided</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#6E6E73]">
              <Briefcase className="w-3 h-3" />
              Target Job
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Provided</span>
            </div>
          </div>

          {hasLatex && (
            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs text-[#0071E3] bg-[#E8F0FE] rounded-lg px-3 py-2 font-medium">
                <Sparkles className="w-3 h-3" />
                Resume generated
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#E5E5EA]">
          <button
            onClick={handleReset}
            className="w-full h-9 flex items-center justify-center gap-2 text-xs font-medium text-[#6E6E73] hover:text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-xl transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-12 flex-shrink-0 border-r border-[#E5E5EA] bg-white flex flex-col items-center py-4 gap-3 transition-all duration-200">
      <button
        onClick={() => setExpanded(true)}
        className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#0071E3] to-[#40A9FF] flex items-center justify-center shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all"
        title="Show inputs"
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>
      <div className="w-4 h-px bg-[#E5E5EA]" />
      <div
        className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center"
        title="Resume ready"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      </div>
    </div>
  );
}
