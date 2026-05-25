import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-8 border-t border-[#E5E5EA] bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-[#0071E3] to-[#40A9FF]">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-[#1D1D1F]">Resumize</span>
        </div>
        <p className="text-xs text-[#86868B]">
          Built with AI to help you land your dream job.
        </p>
      </div>
    </footer>
  );
}
