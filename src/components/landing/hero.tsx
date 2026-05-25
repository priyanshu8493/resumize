'use client';

import { Sparkles, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0071E3]/5 via-transparent to-[#40A9FF]/5" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#0071E3]/[0.03] to-transparent" />

      <nav className="relative flex items-center justify-between px-6 lg:px-10 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#0071E3] to-[#40A9FF] shadow-sm shadow-blue-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-[#1D1D1F] tracking-tight">Resumize</span>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm font-medium rounded-lg transition-all shadow-sm"
        >
          Get Started
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </nav>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-28 lg:pt-28 lg:pb-36">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F0FE] rounded-full text-xs font-medium text-[#0071E3] mb-8">
            <Sparkles className="w-3 h-3" />
            AI-Powered Resume Optimization
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-[#1D1D1F] tracking-tight leading-[1.1] mb-6">
            Tailor your resume to{' '}
            <span className="bg-gradient-to-r from-[#0071E3] to-[#40A9FF] bg-clip-text text-transparent">
              every job
            </span>{' '}
            in seconds
          </h1>

          <p className="text-lg lg:text-xl text-[#86868B] leading-relaxed max-w-2xl mx-auto mb-10">
            Upload your resume, paste a job description, and let AI generate a perfectly tailored,
            ATS-optimized LaTeX resume — with bullet points that recruiters love.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 h-12 px-6 bg-gradient-to-br from-[#0071E3] to-[#40A9FF] hover:from-[#0077ED] hover:to-[#45ADFF] text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all"
            >
              <FileText className="w-4 h-4" />
              Optimize Your Resume
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 h-12 px-6 bg-white border border-[#E5E5EA] hover:border-[#D1D1D6] text-[#1D1D1F] text-sm font-medium rounded-xl transition-all shadow-sm"
            >
              How It Works
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '10x', label: 'Faster tailoring' },
              { value: '95%', label: 'ATS pass rate' },
              { value: '1min', label: 'to get started' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-[#1D1D1F]">{stat.value}</div>
                <div className="text-xs text-[#86868B] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-20 max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0071E3]/10 to-transparent rounded-3xl blur-3xl" />
          <div className="relative bg-white border border-[#E5E5EA] rounded-2xl shadow-xl shadow-black/5 overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-[#F5F5F7] border-b border-[#E5E5EA]">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="text-xs text-[#86868B] font-mono ml-2">Resumize Workspace</span>
            </div>
            <div className="flex">
              <div className="w-1/3 p-4 bg-[#FAFAFA] border-r border-[#E5E5EA] space-y-3">
                <div className="h-3 w-20 bg-[#E5E5EA] rounded-full" />
                <div className="h-8 bg-white border border-[#E5E5EA] rounded-lg" />
                <div className="h-8 bg-white border border-[#E5E5EA] rounded-lg" />
                <div className="h-24 bg-white border border-[#E5E5EA] rounded-lg" />
                <div className="h-24 bg-white border border-[#E5E5EA] rounded-lg" />
                <div className="h-9 bg-gradient-to-r from-[#0071E3] to-[#40A9FF] rounded-lg" />
              </div>
              <div className="flex-1 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0071E3] to-[#40A9FF]" />
                  <div className="h-3 w-48 bg-[#E5E5EA] rounded-full" />
                </div>
                <div className="h-3 w-64 bg-[#E5E5EA] rounded-full" />
                <div className="h-3 w-56 bg-[#E5E5EA] rounded-full" />
                <div className="h-3 w-72 bg-[#E5E5EA] rounded-full" />
                <div className="h-3 w-44 bg-[#E5E5EA] rounded-full" />
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-6 h-6 rounded-full bg-[#E5E5EA]" />
                  <div className="h-8 flex-1 bg-[#F5F5F7] border border-[#E5E5EA] rounded-lg" />
                  <div className="w-8 h-8 bg-[#0071E3] rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
