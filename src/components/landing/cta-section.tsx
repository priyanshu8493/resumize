import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-24 lg:py-32 bg-white border-t border-[#E5E5EA]">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0071E3] to-[#40A9FF] flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/25">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-[#1D1D1F] tracking-tight mb-4">
          Ready to land your next role?
        </h2>
        <p className="text-lg text-[#86868B] leading-relaxed mb-10 max-w-lg mx-auto">
          Stop sending generic resumes. Tailor each application in minutes with AI.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 h-12 px-6 bg-gradient-to-br from-[#0071E3] to-[#40A9FF] hover:from-[#0077ED] hover:to-[#45ADFF] text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all"
        >
          Optimize Your Resume Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
