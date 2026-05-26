'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useResumeStore, type Project, type Experience, type Achievement } from '@/lib/store';
import {
  Loader2, Sparkles, Code2, Briefcase, FileText,
  ChevronDown, ChevronRight, FolderKanban, Building2, Award,
} from 'lucide-react';
import { FileUpload } from './file-upload';
import { EntryForm } from './entry-form';
import { EntryCard } from './entry-card';

interface LeftPanelProps {
  onGenerate: () => void;
}

function Section({
  title,
  icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#F5F5F7] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#EFEFF1] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#6E6E73]">{icon}</span>
          <span className="text-xs font-semibold text-[#1D1D1F]">{title}</span>
        </div>
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-[#86868B]" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-[#86868B]" />
        )}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

export function LeftPanel({ onGenerate }: LeftPanelProps) {
  const {
    githubUrl, linkedinUrl, targetJd,
    projects, experiences, achievements,
    isLocked, isGenerating, setField,
    addProject, removeProject,
    addExperience, removeExperience,
    addAchievement, removeAchievement,
  } = useResumeStore();



  const handleAddProject = (vals: Record<string, string>) => {
    const p: Project = {
      id: crypto.randomUUID(),
      title: vals.title,
      description: vals.description,
      problemStatement: vals.problemStatement,
      techStack: vals.techStack,
      link: vals.link,
      duration: vals.duration,
    };
    addProject(p);
  };

  const handleAddExperience = (vals: Record<string, string>) => {
    const e: Experience = {
      id: crypto.randomUUID(),
      company: vals.company,
      role: vals.role,
      duration: vals.duration,
      description: vals.description,
      achievements: vals.achievements,
    };
    addExperience(e);
  };

  const handleAddAchievement = (vals: Record<string, string>) => {
    const a: Achievement = {
      id: crypto.randomUUID(),
      title: vals.title,
      type: vals.type as Achievement['type'],
      issuer: vals.issuer,
      date: vals.date,
      description: vals.description,
    };
    addAchievement(a);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-4">
        <div className="space-y-1 mb-1">
          <h2 className="text-xs font-semibold text-[#86868B] tracking-[0.05em] uppercase">
            Context Engine
          </h2>
          <p className="text-sm text-[#86868B] leading-relaxed">
            Load up your profile so the AI can tailor your resume.
          </p>
        </div>

        {/* Basic Info */}
        <Section title="Basic Info" icon={<Code2 className="w-3.5 h-3.5" />}>
          <div className="space-y-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#6E6E73]">GitHub URL</label>
              <Input
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setField('githubUrl', e.target.value)}
                disabled={isLocked}
                className="h-9 text-sm bg-white border-[#D1D1D6] text-[#1D1D1F] placeholder:text-[#A1A1A6] focus-visible:ring-[#0071E3] focus-visible:border-[#0071E3]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#6E6E73]">LinkedIn URL</label>
              <Input
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setField('linkedinUrl', e.target.value)}
                disabled={isLocked}
                className="h-9 text-sm bg-white border-[#D1D1D6] text-[#1D1D1F] placeholder:text-[#A1A1A6] focus-visible:ring-[#0071E3] focus-visible:border-[#0071E3]"
              />
            </div>
          </div>
        </Section>

        {/* Resume Upload */}
        <Section title="Master Resume" icon={<FileText className="w-3.5 h-3.5" />}>
          <FileUpload />
        </Section>

        {/* Projects */}
        <Section title="Projects" icon={<FolderKanban className="w-3.5 h-3.5" />} defaultOpen={projects.length > 0}>
          {projects.length > 0 && (
            <div className="space-y-2">
              {projects.map((p) => (
                <EntryCard
                  key={p.id}
                  entry={p}
                  type="project"
                  onDelete={removeProject}
                  onEdit={() => {}}
                  isLocked={isLocked}
                />
              ))}
            </div>
          )}
          {!isLocked && (
            <EntryForm type="project" onSave={handleAddProject} />
          )}
        </Section>

        {/* Experience */}
        <Section title="Experience" icon={<Building2 className="w-3.5 h-3.5" />} defaultOpen={experiences.length > 0}>
          {experiences.length > 0 && (
            <div className="space-y-2">
              {experiences.map((e) => (
                <EntryCard
                  key={e.id}
                  entry={e}
                  type="experience"
                  onDelete={removeExperience}
                  onEdit={() => {}}
                  isLocked={isLocked}
                />
              ))}
            </div>
          )}
          {!isLocked && (
            <EntryForm type="experience" onSave={handleAddExperience} />
          )}
        </Section>

        {/* Achievements & Education */}
        <Section title="Education & Achievements" icon={<Award className="w-3.5 h-3.5" />} defaultOpen={achievements.length > 0}>
          {achievements.length > 0 && (
            <div className="space-y-2">
              {achievements.map((a) => (
                <EntryCard
                  key={a.id}
                  entry={a}
                  type="achievement"
                  onDelete={removeAchievement}
                  onEdit={() => {}}
                  isLocked={isLocked}
                />
              ))}
            </div>
          )}
          {!isLocked && (
            <EntryForm type="achievement" onSave={handleAddAchievement} />
          )}
        </Section>

        {/* Target Job Description */}
        <Section title="Target Job" icon={<Briefcase className="w-3.5 h-3.5" />}>
          <Textarea
            placeholder="Paste the full job description here..."
            value={targetJd}
            onChange={(e) => setField('targetJd', e.target.value)}
            disabled={isLocked}
            className="min-h-[140px] text-sm bg-white border-[#D1D1D6] text-[#1D1D1F] placeholder:text-[#A1A1A6] focus-visible:ring-[#0071E3] focus-visible:border-[#0071E3] resize-none"
          />
        </Section>
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
