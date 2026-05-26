'use client';

import { Navbar } from '@/components/navbar';
import { LeftPanel } from '@/components/left-panel';
import { RightPanel } from '@/components/right-panel';
import { Sidebar } from '@/components/sidebar';
import { useResumeStore } from '@/lib/store';

export default function DashboardPage() {
  const startGeneration = useResumeStore((s) => s.startGeneration);
  const isLocked = useResumeStore((s) => s.isLocked);
  const hasLatex = useResumeStore((s) => s.hasLatex);
  const showSidebar = isLocked && hasLatex;

  const handleGenerate = () => {
    startGeneration();
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {showSidebar ? (
          <Sidebar />
        ) : (
          <div className="w-1/3 min-w-[380px] max-w-[460px] flex-shrink-0 border-r border-[#E5E5EA] transition-all duration-300">
            <LeftPanel onGenerate={handleGenerate} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
