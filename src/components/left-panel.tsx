'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useResumeStore } from '@/lib/store';
import { Loader2, Sparkles, Code2, Globe, Briefcase } from 'lucide-react';
import { FileUpload } from './file-upload';

interface LeftPanelProps {
  onGenerate: () => void;
}

export function LeftPanel({ onGenerate }: LeftPanelProps) {
  const {
    githubUrl, linkedinUrl, masterResume, targetJd,
    isLocked, isGenerating, setField,
  } = useResumeStore();

  const canGenerate = masterResume.length > 0 && targetJd.length > 0;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-5">
        <div className="space-y-1">
          <h2 className="text-xs font-semibold text-[#86868B] tracking-[0.05em] uppercase">
            Context Engine
          </h2>
          <p className="text-sm text-[#86868B] leading-relaxed">
            Provide your background and the target role to tailor your resume.
          </p>
        </div>

        <div className="bg-[#F5F5F7] rounded-xl p-4 space-y-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[#6E6E73]">
              <Code2 className="w-3.5 h-3.5" />
              GitHub URL
            </label>
            <Input
              placeholder="https://github.com/username"
              value={githubUrl}
              onChange={(e) => setField('githubUrl', e.target.value)}
              disabled={isLocked}
              className="h-9 text-sm bg-white border-[#D1D1D6] text-[#1D1D1F] placeholder:text-[#A1A1A6] focus-visible:ring-[#0071E3] focus-visible:border-[#0071E3] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-[#6E6E73]">
              <Globe className="w-3.5 h-3.5" />
              LinkedIn URL
            </label>
            <Input
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setField('linkedinUrl', e.target.value)}
              disabled={isLocked}
              className="h-9 text-sm bg-white border-[#D1D1D6] text-[#1D1D1F] placeholder:text-[#A1A1A6] focus-visible:ring-[#0071E3] focus-visible:border-[#0071E3] transition-all"
            />
          </div>
        </div>

        <FileUpload />

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-[#6E6E73]">
            <Briefcase className="w-3.5 h-3.5" />
            Target Job Description
          </label>
          <Textarea
            placeholder="Paste the target job description here..."
            value={targetJd}
            onChange={(e) => setField('targetJd', e.target.value)}
            disabled={isLocked}
            className="min-h-[160px] text-sm bg-[#F5F5F7] border-[#D1D1D6] text-[#1D1D1F] placeholder:text-[#A1A1A6] focus-visible:ring-[#0071E3] focus-visible:border-[#0071E3] transition-all resize-none rounded-xl"
          />
        </div>
      </div>

      <div className="p-5 lg:p-6 border-t border-[#E5E5EA] bg-white">
        <Button
          onClick={onGenerate}
          disabled={isLocked || isGenerating}
          className="w-full h-11 bg-gradient-to-br from-[#0071E3] to-[#40A9FF] hover:from-[#0077ED] hover:to-[#45ADFF] text-white font-medium text-sm shadow-lg shadow-blue-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 rounded-xl"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Tailored Resume
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
