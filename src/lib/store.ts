import { create } from 'zustand';

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

interface ResumeState {
  githubUrl: string;
  linkedinUrl: string;
  masterResume: string;
  resumeFileName: string;
  isParsing: boolean;
  targetJd: string;
  projects: Project[];
  experiences: Experience[];
  achievements: Achievement[];
  isLocked: boolean;
  latexCode: string;
  hasLatex: boolean;
  isGenerating: boolean;
  generateTrigger: number;
  setField: (field: keyof Pick<ResumeState, 'githubUrl' | 'linkedinUrl' | 'masterResume' | 'targetJd' | 'resumeFileName' | 'isParsing'>, value: string | boolean) => void;
  addProject: (p: Project) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, p: Partial<Project>) => void;
  addExperience: (e: Experience) => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, e: Partial<Experience>) => void;
  addAchievement: (a: Achievement) => void;
  removeAchievement: (id: string) => void;
  updateAchievement: (id: string, a: Partial<Achievement>) => void;
  lockInputs: () => void;
  unlockInputs: () => void;
  setLatexCode: (code: string) => void;
  setGenerating: (v: boolean) => void;
  startGeneration: () => void;
  reset: () => void;
}

const initialState = {
  githubUrl: '',
  linkedinUrl: '',
  masterResume: '',
  resumeFileName: '',
  isParsing: false,
  targetJd: '',
  projects: [] as Project[],
  experiences: [] as Experience[],
  achievements: [] as Achievement[],
  isLocked: false,
  latexCode: '',
  hasLatex: false,
  isGenerating: false,
  generateTrigger: 0,
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
  lockInputs: () => set({ isLocked: true }),
  unlockInputs: () => set({ isLocked: false }),
  setLatexCode: (code) => set({ latexCode: code, hasLatex: true }),
  setGenerating: (v) => set({ isGenerating: v }),
  startGeneration: () => set((s) => ({ isGenerating: true, isLocked: true, generateTrigger: s.generateTrigger + 1 })),
  reset: () => set(initialState),
}));
