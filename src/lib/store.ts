import { create } from 'zustand';

export type TemplateType = 'modern' | 'classic' | 'minimal';

export interface Project {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  techStack: string;
  link: string;
  duration: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  achievements: string;
}

export interface Achievement {
  id: string;
  title: string;
  type: 'certification' | 'education' | 'achievement' | 'publication';
  issuer: string;
  date: string;
  description: string;
}

export interface Skill {
  id: string;
  category: string;
  items: string;
}

export interface ResumeVersion {
  id: string;
  latexCode: string;
  label: string;
  timestamp: number;
  template: TemplateType;
}

interface ResumeState {
  githubUrl: string;
  linkedinUrl: string;
  masterResume: string;
  resumeFileName: string;
  isParsing: boolean;
  targetJd: string;
  targetRole: string;
  targetCompany: string;
  professionalSummary: string;
  projects: Project[];
  experiences: Experience[];
  achievements: Achievement[];
  skills: Skill[];
  selectedTemplate: TemplateType;
  isLocked: boolean;
  latexCode: string;
  hasLatex: boolean;
  isGenerating: boolean;
  generateTrigger: number;
  resumeVersions: ResumeVersion[];
  currentVersionId: string | null;
  setField: (field: keyof Pick<ResumeState, 'githubUrl' | 'linkedinUrl' | 'masterResume' | 'targetJd' | 'targetRole' | 'targetCompany' | 'professionalSummary' | 'resumeFileName' | 'isParsing' | 'selectedTemplate'>, value: string | boolean) => void;
  addProject: (p: Project) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, p: Partial<Project>) => void;
  addExperience: (e: Experience) => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, e: Partial<Experience>) => void;
  addAchievement: (a: Achievement) => void;
  removeAchievement: (id: string) => void;
  updateAchievement: (id: string, a: Partial<Achievement>) => void;
  addSkill: (s: Skill) => void;
  removeSkill: (id: string) => void;
  updateSkill: (id: string, s: Partial<Skill>) => void;
  lockInputs: () => void;
  unlockInputs: () => void;
  setLatexCode: (code: string) => void;
  setGenerating: (v: boolean) => void;
  startGeneration: () => void;
  addResumeVersion: (label?: string) => void;
  switchResumeVersion: (id: string) => void;
  deleteResumeVersion: (id: string) => void;
  reset: () => void;
}

const initialState = {
  githubUrl: '',
  linkedinUrl: '',
  masterResume: '',
  resumeFileName: '',
  isParsing: false,
  targetJd: '',
  targetRole: '',
  targetCompany: '',
  professionalSummary: '',
  projects: [] as Project[],
  experiences: [] as Experience[],
  achievements: [] as Achievement[],
  skills: [] as Skill[],
  selectedTemplate: 'modern' as TemplateType,
  isLocked: false,
  latexCode: '',
  hasLatex: false,
  isGenerating: false,
  generateTrigger: 0,
  resumeVersions: [] as ResumeVersion[],
  currentVersionId: null as string | null,
};

export const useResumeStore = create<ResumeState>((set) => ({
  ...initialState,
  setField: (field, value) => set({ [field]: value }),
  addProject: (p) => set((s) => ({ projects: [...s.projects, p] })),
  removeProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
  updateProject: (id, partial) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    })),
  addExperience: (e) => set((s) => ({ experiences: [...s.experiences, e] })),
  removeExperience: (id) => set((s) => ({ experiences: s.experiences.filter((e) => e.id !== id) })),
  updateExperience: (id, partial) =>
    set((s) => ({
      experiences: s.experiences.map((e) => (e.id === id ? { ...e, ...partial } : e)),
    })),
  addAchievement: (a) => set((s) => ({ achievements: [...s.achievements, a] })),
  removeAchievement: (id) => set((s) => ({ achievements: s.achievements.filter((a) => a.id !== id) })),
  updateAchievement: (id, partial) =>
    set((s) => ({
      achievements: s.achievements.map((a) => (a.id === id ? { ...a, ...partial } : a)),
    })),
  addSkill: (s) => set((state) => ({ skills: [...state.skills, s] })),
  removeSkill: (id) => set((state) => ({ skills: state.skills.filter((sk) => sk.id !== id) })),
  updateSkill: (id, partial) =>
    set((state) => ({
      skills: state.skills.map((sk) => (sk.id === id ? { ...sk, ...partial } : sk)),
    })),
  lockInputs: () => set({ isLocked: true }),
  unlockInputs: () => set({ isLocked: false }),
  setLatexCode: (code) => set({ latexCode: code, hasLatex: true }),
  setGenerating: (v) => set({ isGenerating: v }),
  startGeneration: () =>
    set((s) => ({
      isGenerating: true,
      isLocked: true,
      generateTrigger: s.generateTrigger + 1,
    })),
  addResumeVersion: (label) =>
    set((s) => {
      if (!s.hasLatex || !s.latexCode) return s;
      const version: ResumeVersion = {
        id: crypto.randomUUID(),
        latexCode: s.latexCode,
        label: label || `Version ${s.resumeVersions.length + 1}`,
        timestamp: Date.now(),
        template: s.selectedTemplate,
      };
      return {
        resumeVersions: [...s.resumeVersions, version],
        currentVersionId: version.id,
      };
    }),
  switchResumeVersion: (id) =>
    set((s) => {
      const version = s.resumeVersions.find((v) => v.id === id);
      if (!version) return s;
      return {
        currentVersionId: id,
        latexCode: version.latexCode,
        selectedTemplate: version.template,
      };
    }),
  deleteResumeVersion: (id) =>
    set((s) => {
      const versions = s.resumeVersions.filter((v) => v.id !== id);
      const wasCurrent = s.currentVersionId === id;
      return {
        resumeVersions: versions,
        currentVersionId: wasCurrent
          ? versions.length > 0
            ? versions[versions.length - 1].id
            : null
          : s.currentVersionId,
        latexCode: wasCurrent
          ? versions.length > 0
            ? versions[versions.length - 1].latexCode
            : s.latexCode
          : s.latexCode,
      };
    }),
  reset: () => set(initialState),
}));
