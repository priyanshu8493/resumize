import { create } from 'zustand';

interface ResumeState {
  githubUrl: string;
  linkedinUrl: string;
  masterResume: string;
  resumeFileName: string;
  isParsing: boolean;
  targetJd: string;
  isLocked: boolean;
  latexCode: string;
  hasLatex: boolean;
  isGenerating: boolean;
  setField: (field: keyof Pick<ResumeState, 'githubUrl' | 'linkedinUrl' | 'masterResume' | 'targetJd' | 'resumeFileName' | 'isParsing'>, value: string | boolean) => void;
  lockInputs: () => void;
  unlockInputs: () => void;
  setLatexCode: (code: string) => void;
  setGenerating: (v: boolean) => void;
  reset: () => void;
}

const initialState = {
  githubUrl: '',
  linkedinUrl: '',
  masterResume: '',
  resumeFileName: '',
  isParsing: false,
  targetJd: '',
  isLocked: false,
  latexCode: '',
  hasLatex: false,
  isGenerating: false,
};

export const useResumeStore = create<ResumeState>((set) => ({
  ...initialState,
  setField: (field, value) => set({ [field]: value }),
  lockInputs: () => set({ isLocked: true }),
  unlockInputs: () => set({ isLocked: false }),
  setLatexCode: (code) => set({ latexCode: code, hasLatex: true }),
  setGenerating: (v) => set({ isGenerating: v }),
  reset: () => set(initialState),
}));
