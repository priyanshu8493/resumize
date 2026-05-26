'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './chat-message';
import { PdfPreview } from './pdf-preview';
import { useResumeStore } from '@/lib/store';
import {
  Send, Loader2, Download, ExternalLink, FileDown,
  Sparkles, X, Bot, PanelRightClose,
} from 'lucide-react';
import { toast } from 'sonner';

const extractLatex = (content: string): string | null => {
  const match = content.match(/```latex\n?([\s\S]*?)```/);
  return match ? match[1].trim() : null;
};

const getMessageText = (
  message: { parts?: Array<{ type: string; text?: string }>; content?: string },
): string => {
  if (message.parts) {
    return message.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && p.text != null)
      .map((p) => p.text)
      .join('');
  }
  return message.content || '';
};

const LOADING_MESSAGES = [
  'Analyzing your background and the target role...',
  'Matching skills to job requirements...',
  'Optimizing bullet points for impact...',
  'Formatting with LaTeX precision...',
  'Almost there, adding final touches...',
];

function useLoadingMessages() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return LOADING_MESSAGES[index];
}

const COLORS = ['#0071E3', '#40A9FF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE'];

const dots = Array.from({ length: 20 }, (_, i) => ({
  color: COLORS[i % COLORS.length],
  left: 10 + ((i * 17 + 5) % 80),
  top: 10 + ((i * 13 + 7) % 80),
  delay: i * 80,
  duration: 1 + ((i * 7) % 10) / 10,
}));

function CelebrationDots() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full animate-ping"
          style={{
            backgroundColor: dot.color,
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            animationDelay: `${dot.delay}ms`,
            animationDuration: `${dot.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function RightPanel() {
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const prevHasLatex = useRef(false);

  const store = useResumeStore();

  const { messages, sendMessage, status } = useChat({
    onFinish: ({
      message,
    }: {
      message: { parts?: Array<{ type: string; text?: string }>; content?: string };
    }) => {
      store.setGenerating(false);
      const text = getMessageText(message);
      const latex = extractLatex(text);
      if (latex) {
        store.setLatexCode(latex);
      }
    },
    onError: () => {
      store.setGenerating(false);
      toast.error('Failed to generate response. Please check your API key and try again.');
    },
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (store.generateTrigger === 0) return;
    if (!store.masterResume && !store.targetJd) {
      store.setGenerating(false);
      toast.error('Please provide your Master Resume and Target Job Description');
      return;
    }

    const contextMessage = [
      'Generate a tailored LaTeX resume for me based on the following information.',
      '',
      store.githubUrl ? `GitHub URL: ${store.githubUrl}` : '',
      store.linkedinUrl ? `LinkedIn URL: ${store.linkedinUrl}` : '',
      '',
      '=== MASTER RESUME ===',
      store.masterResume || '(No master resume provided)',
      '',
      '=== TARGET JOB DESCRIPTION ===',
      store.targetJd || '(No target job description provided)',
    ]
      .filter(Boolean)
      .join('\n');

    sendMessage({ text: contextMessage });
  }, [store.generateTrigger]);

  useEffect(() => {
    if (store.hasLatex && !prevHasLatex.current) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      prevHasLatex.current = true;
      return () => clearTimeout(timer);
    }
    if (!store.hasLatex) {
      prevHasLatex.current = false;
    }
  }, [store.hasLatex]);

  const loadingMessage = useLoadingMessages();

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      sendMessage({ text: input.trim() });
      setInput('');
    },
    [input, sendMessage],
  );

  const handleDownloadPdf = useCallback(async () => {
    if (!store.latexCode) return;
    const encoded = encodeURIComponent(store.latexCode);
    window.open(`https://latexonline.cc/compile?text=${encoded}`, '_blank');
    toast.success('Opening compiled PDF in new tab...');
  }, [store.latexCode]);

  const handleOverleafExport = useCallback(() => {
    if (!store.latexCode) return;
    const encoded = encodeURIComponent(store.latexCode);
    window.open(
      `https://www.overleaf.com/docs?snip_uri=data:text/x-tex;charset=utf-8,${encoded}`,
      '_blank',
    );
    toast.success('Opening Overleaf...');
  }, [store.latexCode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const toggleChat = () => {
    setChatOpen((v) => !v);
    if (!chatOpen) {
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const hasTriggered = store.generateTrigger > 0 || messages.length > 0;
  const showEmptyState = !hasTriggered;
  const showGenerationLoading = hasTriggered && !store.hasLatex;
  const showPdfView = store.hasLatex;

  const displayMessages = messages.filter((m, i) => {
    if (i === 0 && m.role === 'user') {
      const txt = getMessageText(m);
      if (txt.startsWith('Generate a tailored LaTeX resume')) return false;
    }
    return true;
  });

  const chatPanel = (
    <div className="w-[380px] flex-shrink-0 border-r border-[#E5E5EA] bg-white flex flex-col animate-in slide-in-from-left duration-200">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E5EA]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0071E3] to-[#40A9FF] flex items-center justify-center shadow-sm">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[#1D1D1F]">AI Assistant</span>
            <span className="text-[11px] text-[#86868B] ml-2 font-medium">live</span>
          </div>
        </div>
        <button
          onClick={toggleChat}
          className="h-7 w-7 rounded-lg hover:bg-[#F5F5F7] flex items-center justify-center text-[#86868B] hover:text-[#1D1D1F] transition-colors"
          title="Close chat"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {displayMessages.length === 0 && (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8F0FE] to-[#D0E4FF] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-5 h-5 text-[#0071E3]" />
            </div>
            <p className="text-sm font-medium text-[#1D1D1F] mb-1">
              Refine your resume
            </p>
            <p className="text-xs text-[#86868B] leading-relaxed max-w-[240px] mx-auto">
              Ask to reword bullet points, adjust the layout, or tailor for a specific company.
            </p>
          </div>
        )}
        {displayMessages.map((m) => (
          <ChatMessage
            key={m.id}
            role={m.role as 'user' | 'assistant'}
            content={getMessageText(m)}
            hideLatex
          />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2.5 text-sm text-[#86868B] pl-11">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="border-t border-[#E5E5EA] px-4 py-3 bg-white"
      >
        <div className="flex gap-2.5 items-end">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for a tweak..."
              rows={2}
              className="w-full resize-none rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all min-h-[40px] max-h-[120px]"
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-10 w-10 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative">
      {/* Celebration overlay */}
      {showCelebration && <CelebrationDots />}

      {/* Empty state */}
      {showEmptyState && (
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="text-center max-w-sm animate-in fade-in duration-500">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#E8F0FE] to-[#D0E4FF] flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-105 transition-transform">
              <FileDown className="w-9 h-9 text-[#0071E3]" />
            </div>
            <h2 className="text-[22px] font-semibold text-[#1D1D1F] mb-3 tracking-tight">
              Ready for your next role?
            </h2>
            <p className="text-sm text-[#86868B] leading-relaxed max-w-xs mx-auto">
              Drop in your resume and the job description, then{' '}
              <span className="text-[#0071E3] font-medium">generate</span> a tailored resume designed to land the interview.
            </p>
            <div className="mt-8 flex justify-center gap-2">
              <div className="flex -space-x-1.5">
                {['#FF5F57', '#FEBC2E', '#28C840', '#0071E3', '#AF52DE'].map((c, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <span className="text-xs text-[#A1A1A6] font-medium">ATS-friendly · One page · LaTeX</span>
            </div>
          </div>
        </div>
      )}

      {/* Loading animation */}
      {showGenerationLoading && (
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="text-center space-y-8 animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#E8F0FE] to-[#D0E4FF] flex items-center justify-center mx-auto shadow-sm">
                <Loader2 className="w-9 h-9 animate-spin text-[#0071E3]" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0071E3] opacity-30" />
                <span className="relative inline-flex w-5 h-5 rounded-full bg-[#0071E3]" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-base text-[#1D1D1F] font-medium">Crafting your resume</p>
              <p className="text-sm text-[#86868B] max-w-xs mx-auto leading-relaxed transition-all duration-500">
                {loadingMessage}
              </p>
            </div>
            <div className="w-64 mx-auto">
              <div className="h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0071E3] to-[#40A9FF] rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview view */}
      {showPdfView && (
        <div className="flex-1 flex min-h-0">
          {chatOpen && chatPanel}

          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E5EA] bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold text-[#1D1D1F]">Resume</span>
                </div>
                <span className="text-xs text-[#A1A1A6] font-mono bg-[#F5F5F7] px-2 py-0.5 rounded-md font-medium">
                  PDF
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="h-8 px-3.5 bg-[#0071E3] hover:bg-[#0077ED] active:scale-95 text-white text-xs font-medium rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  onClick={handleOverleafExport}
                  className="h-8 px-3.5 border border-[#D1D1D6] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] active:scale-95 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Overleaf
                </button>
                <div className="w-px h-5 bg-[#E5E5EA] mx-1" />
                <button
                  onClick={toggleChat}
                  className={`h-8 px-3.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 ${
                    chatOpen
                      ? 'bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#E8E8ED] border border-[#D1D1D6] shadow-none'
                      : 'bg-gradient-to-br from-[#0071E3] to-[#40A9FF] text-white hover:from-[#0077ED] hover:to-[#45ADFF] shadow-blue-500/20'
                  }`}
                >
                  {chatOpen ? (
                    <>
                      <X className="w-3.5 h-3.5" />
                      Close Chat
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Tweak with AI
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 p-5">
              <div className="h-full rounded-2xl border border-[#E5E5EA] overflow-hidden bg-white shadow-sm animate-in fade-in duration-500">
                <PdfPreview />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
