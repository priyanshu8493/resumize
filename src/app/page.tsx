'use client';

import { Navbar } from '@/components/navbar';
import { LeftPanel } from '@/components/left-panel';
import { RightPanel } from '@/components/right-panel';
import { useResumeStore } from '@/lib/store';

export default function Home() {
  const lockInputs = useResumeStore((s) => s.lockInputs);
  const setGenerating = useResumeStore((s) => s.setGenerating);

  const handleGenerate = () => {
    lockInputs();
    setGenerating(true);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 min-w-[380px] max-w-[460px] flex-shrink-0 border-r border-[#E5E5EA]">
          <LeftPanel onGenerate={handleGenerate} />
        </div>
        <div className="flex-1">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
