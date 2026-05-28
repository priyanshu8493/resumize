'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useResumeStore, type Project, type Experience, type Achievement, type Skill, type TemplateType } from '@/lib/store';
import { TEMPLATES } from '@/lib/templates';
import {
  Loader2, Sparkles, Code2, Briefcase, FileText,
  ChevronDown, FolderKanban, Building2, Award,
  UserRound, Wrench, Plus, X, Palette,
} from 'lucide-react';
import { FileUpload } from './file-upload';
import { EntryForm } from './entry-form';
import { EntryCard } from './entry-card';
import { cn } from '@/lib/utils';

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
    <div className="bg-[#F5F5F7] rounded-xl overflow-hidden transition-shadow hover:shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#EFEFF1] transition-colors active:bg-[#E8E8ED]"
      >
        <div className="flex items-center gap-2">
          <span className={`transition-colors ${open ? 'text-[#0071E3]' : 'text-[#6E6E73]'}`}>{icon}</span>
          <span className="text-xs font-semibold text-[#1D1D1F]">{title}</span>
        </div>
        <div className={`transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-90'}`}>
          <ChevronDown className="w-3.5 h-3.5 text-[#86868B]" />
        </div>
      </button>
      <div
        className={`transition-all duration-200 ease-out overflow-hidden ${
          open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 space-y-3">{children}</div>
      </div>
    </div>
  );
}

function SkillsManager() {
  const { skills, isLocked, addSkill, removeSkill } = useResumeStore();
  const [newCategory, setNewCategory] = useState('');
  const [newItems, setNewItems] = useState('');

  const handleAdd = () => {
    if (!newCategory.trim() || !newItems.trim()) return;
    const s: Skill = {
      id: crypto.randomUUID(),
      category: newCategory.trim(),
      items: newItems.trim(),
    };
    addSkill(s);
    setNewCategory('');
    setNewItems('');
  };

  return (
    <div className="space-y-2">
      {skills.map((s) => (
        <div key={s.id} className="flex items-start gap-2 bg-white border border-[#E5E5EA] rounded-xl p-3 group">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-[#0071E3] uppercase tracking-wide">{s.category}</p>
            <p className="text-sm text-[#1D1D1F] mt-0.5">{s.items}</p>
          </div>
          {!isLocked && (
            <button
              onClick={() => removeSkill(s.id)}
              className="shrink-0 h-7 w-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-[#A1A1A6] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
      {!isLocked && (
        <div className="flex gap-2">
          <div className="flex-1 space-y-1.5">
            <Input
              placeholder="Category (e.g. Languages)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="h-9 text-sm bg-white border-[#D1D1D6] text-[#1D1D1F] placeholder:text-[#A1A1A6]"
            />
            <Input
              placeholder="Skills (e.g. Python, TypeScript, Go)"
              value={newItems}
              onChange={(e) => setNewItems(e.target.value)}
              className="h-9 text-sm bg-white border-[#D1D1D6] text-[#1D1D1F] placeholder:text-[#A1A1A6]"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!newCategory.trim() || !newItems.trim()}
            className="self-end h-9 w-9 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function TemplateSelector() {
  const { selectedTemplate, isLocked, setField } = useResumeStore();

  return (
    <div className="grid grid-cols-3 gap-2">
      {(Object.entries(TEMPLATES) as [TemplateType, typeof TEMPLATES['modern']][]).map(([key, tpl]) => (
        <button
          key={key}
          onClick={() => !isLocked && setField('selectedTemplate', key)}
          disabled={isLocked}
          className={cn(
            'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center',
            selectedTemplate === key
              ? 'border-[#0071E3] bg-[#E8F0FE]'
              : 'border-[#D1D1D6] bg-white hover:border-[#0071E3]/50',
            isLocked && 'opacity-40 cursor-not-allowed',
          )}
        >
          <Palette className="w-4 h-4" style={{ color: tpl.color }} />
          <span className="text-[11px] font-semibold text-[#1D1D1F]">{tpl.label}</span>
          <span className="text-[9px] text-[#86868B] leading-tight">{tpl.description}</span>
        </button>
      ))}
    </div>
  );
}

export function LeftPanel() {
  const {
    githubUrl, linkedinUrl, masterResume, targetJd,
    targetRole, targetCompany, professionalSummary,
    projects, experiences, achievements,
    isLocked, isGenerating, setField,
    addProject, removeProject, updateProject,
    addExperience, removeExperience, updateExperience,
    addAchievement, removeAchievement, updateAchievement,
    startGeneration,
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

  const checks = [
    githubUrl, linkedinUrl,
    masterResume,
    targetJd,
    targetRole,
    projects.length > 0,
    experiences.length > 0,
    achievements.length > 0,
    professionalSummary,
  ];
  const filledFields = checks.filter(Boolean).length;
  const totalFields = checks.length;
  const progress = Math.min(filledFields / totalFields, 1);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-4">
        <div className="space-y-2 mb-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[#86868B] tracking-[0.05em] uppercase">
              Your Profile
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0071E3] to-[#40A9FF] rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-[#86868B] tabular-nums">{filledFields}/{totalFields}</span>
            </div>
          </div>
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

        {/* Professional Summary */}
        <Section title="Professional Summary" icon={<UserRound className="w-3.5 h-3.5" />}>
          <Textarea
            placeholder="e.g. Software engineer with 5+ years of experience building scalable web applications..."
            value={professionalSummary}
            onChange={(e) => setField('professionalSummary', e.target.value)}
            disabled={isLocked}
            className="min-h-[100px] text-sm bg-white border-[#D1D1D6] text-[#1D1D1F] placeholder:text-[#A1A1A6] focus-visible:ring-[#0071E3] focus-visible:border-[#0071E3] resize-none"
          />
        </Section>

        {/* Skills */}
        <Section title="Skills" icon={<Wrench className="w-3.5 h-3.5" />}>
          <SkillsManager />
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
                    onEdit={updateProject}
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
                    onEdit={updateExperience}
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
                    onEdit={updateAchievement}
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
          <div className="space-y-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#6E6E73]">Target Role</label>
              <Input
                placeholder="e.g. Senior Software Engineer"
                value={targetRole}
                onChange={(e) => setField('targetRole', e.target.value)}
                disabled={isLocked}
                className="h-9 text-sm bg-white border-[#D1D1D6] text-[#1D1D1F] placeholder:text-[#A1A1A6] focus-visible:ring-[#0071E3] focus-visible:border-[#0071E3]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#6E6E73]">Target Company</label>
              <Input
                placeholder="e.g. Google"
                value={targetCompany}
                onChange={(e) => setField('targetCompany', e.target.value)}
                disabled={isLocked}
                className="h-9 text-sm bg-white border-[#D1D1D6] text-[#1D1D1F] placeholder:text-[#A1A1A6] focus-visible:ring-[#0071E3] focus-visible:border-[#0071E3]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#6E6E73]">Job Description</label>
              <Textarea
                placeholder="Paste the full job description here..."
                value={targetJd}
                onChange={(e) => setField('targetJd', e.target.value)}
                disabled={isLocked}
                className="min-h-[120px] text-sm bg-white border-[#D1D1D6] text-[#1D1D1F] placeholder:text-[#A1A1A6] focus-visible:ring-[#0071E3] focus-visible:border-[#0071E3] resize-none"
              />
            </div>
          </div>
        </Section>

        {/* Template Selector */}
        <Section title="Resume Template" icon={<Palette className="w-3.5 h-3.5" />}>
          <TemplateSelector />
        </Section>
      </div>

      <div className="p-5 lg:p-6 border-t border-[#E5E5EA] bg-white space-y-2">
        <Button
          onClick={startGeneration}
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
