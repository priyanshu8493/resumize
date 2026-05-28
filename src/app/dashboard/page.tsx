'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { LeftPanel } from '@/components/left-panel';
import { RightPanel } from '@/components/right-panel';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function DashboardPage() {
  const [leftOpen, setLeftOpen] = useState(true);

  const toggleLeft = () => setLeftOpen((v) => !v);

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] overflow-hidden">
      <Navbar onToggleLeft={toggleLeft} leftOpen={leftOpen} />
      <div className="flex flex-1 overflow-hidden">
        {leftOpen ? (
          <div className="w-[420px] min-w-[380px] max-w-[480px] flex-shrink-0 border-r border-[#E5E5EA] transition-all duration-300 ease-out">
            <LeftPanel />
          </div>
        ) : (
          <div className="w-12 flex-shrink-0 border-r border-[#E5E5EA] bg-white flex flex-col items-center pt-4 gap-3 transition-all duration-200">
            <button
              onClick={toggleLeft}
              className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#0071E3] to-[#40A9FF] flex items-center justify-center shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all"
              title="Show input panel"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
