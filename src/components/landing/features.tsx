import { Sparkles, FileText, MessageSquare, Download, Zap, Target } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Perfect Tailoring',
    description: 'AI analyzes the job description and your background to create a resume that speaks directly to what recruiters are looking for.',
  },
  {
    icon: MessageSquare,
    title: 'Chat to Refine',
    description: 'Fine-tune any section through natural conversation. Ask for more technical language, different formatting, or complete rewrites.',
  },
  {
    icon: FileText,
    title: 'LaTeX Output',
    description: 'Get professional, ATS-optimized LaTeX that renders beautifully. No more fighting with Word template formatting issues.',
  },
  {
    icon: Download,
    title: 'PDF & Overleaf',
    description: 'Download a compiled PDF instantly or export to Overleaf for further editing. Your resume, your way.',
  },
  {
    icon: Zap,
    title: 'Google X-Y-Z Format',
    description: 'Every bullet point follows the format recruiters love: "Accomplished [X] as measured by [Y], by doing [Z]."',
  },
  {
    icon: Sparkles,
    title: 'One-Page Optimized',
    description: 'The AI automatically keeps your resume to a single page while maximizing impact and keyword density for ATS systems.',
  },
];

export function Features() {
  return (
    <section className="py-24 lg:py-32 bg-white border-t border-[#E5E5EA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1D1D1F] tracking-tight mb-4">
            Everything you need to land the interview
          </h2>
          <p className="text-lg text-[#86868B] leading-relaxed">
            From parsing your existing resume to generating a perfectly tailored PDF — all in one workspace.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-6 bg-[#FAFAFA] border border-[#E5E5EA] rounded-xl hover:border-[#D1D1D6] hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8F0FE] to-[#D0E4FF] flex items-center justify-center mb-4 group-hover:from-[#D0E4FF] group-hover:to-[#B8D4FF] transition-all">
                  <Icon className="w-5 h-5 text-[#0071E3]" />
                </div>
                <h3 className="text-sm font-semibold text-[#1D1D1F] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#86868B] leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
