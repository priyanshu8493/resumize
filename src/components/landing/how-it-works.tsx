import { Upload, Sparkles, Download } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Paste Your Context',
    description: 'Add your GitHub, LinkedIn, paste your existing resume, and the job description you want to target.',
    step: '01',
  },
  {
    icon: Sparkles,
    title: 'AI Generates Your Resume',
    description: 'Our AI instantly creates a tailored, ATS-optimized LaTeX resume with Google X-Y-Z bullet points. Review and chat to refine any section.',
    step: '02',
  },
  {
    icon: Download,
    title: 'Export & Apply',
    description: 'Download a polished PDF, export to Overleaf for further tweaks, or copy the LaTeX directly.',
    step: '03',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1D1D1F] tracking-tight mb-4">
            Three steps to your perfect resume
          </h2>
          <p className="text-lg text-[#86868B] leading-relaxed">
            No templates, no formatting headaches. Just your best resume in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#D1D1D6] to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8F0FE] to-[#D0E4FF] flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Icon className="w-7 h-7 text-[#0071E3]" />
                </div>
                <div className="text-xs font-semibold text-[#0071E3] tracking-wider mb-2">{step.step}</div>
                <h3 className="text-base font-semibold text-[#1D1D1F] mb-2">{step.title}</h3>
                <p className="text-sm text-[#86868B] leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
