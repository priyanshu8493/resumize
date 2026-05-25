'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './chat-message';
import { PdfPreview } from './pdf-preview';
import { useResumeStore } from '@/lib/store';
import { Send, Loader2, Download, ExternalLink, FileDown, Sparkles, X, MessageSquare, Bot } from 'lucide-react';
import { toast } from 'sonner';

const extractLatex = (content: string): string | null => {
  const match = content.match(/```latex\n?([\s\S]*?)```/);
  return match ? match[1].trim() : null;
};

const getMessageText = (message: { parts?: Array<{ type: string; text?: string }>; content?: string }): string => {
  if (message.parts) {
    return message.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && p.text != null)
      .map(p => p.text)
      .join('');
  }
  return message.content || '';
};

export function RightPanel() {
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  const store = useResumeStore();

  const { messages, sendMessage, status } = useChat({
    onFinish: ({ message }: { message: { parts?: Array<{ type: string; text?: string }>; content?: string } }) => {
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

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input.trim() });
    setInput('');
  }, [input, sendMessage]);

  const handleDownloadPdf = useCallback(async () => {
    if (!store.latexCode) return;
    const encoded = encodeURIComponent(store.latexCode);
    window.open(`https://latexonline.cc/compile?text=${encoded}`, '_blank');
    toast.success('Opening compiled PDF in new tab...');
  }, [store.latexCode]);

  const handleOverleafExport = useCallback(() => {
    if (!store.latexCode) return;
    const encoded = encodeURIComponent(store.latexCode);
    window.open(`https://www.overleaf.com/docs?snip_uri=data:text/x-tex;charset=utf-8,${encoded}`, '_blank');
    toast.success('Opening Overleaf...');
  }, [store.latexCode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const toggleChat = () => setChatOpen((v) => !v);

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

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* Empty state */}
      {showEmptyState && (
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#E8F0FE] to-[#D0E4FF] flex items-center justify-center mx-auto mb-8 shadow-sm">
              <FileDown className="w-9 h-9 text-[#0071E3]" />
            </div>
            <h2 className="text-[22px] font-semibold text-[#1D1D1F] mb-3 tracking-tight">
              Your tailored resume awaits
            </h2>
            <p className="text-sm text-[#86868B] leading-relaxed">
              Fill in your details on the left panel, then click{' '}
              <span className="text-[#0071E3] font-medium">Generate Tailored Resume</span>
              {' '}to create an ATS-optimized resume.
            </p>
          </div>
        </div>
      )}

      {/* Loading animation — covers ALL states before LaTeX is extracted */}
      {showGenerationLoading && (
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="text-center space-y-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#E8F0FE] to-[#D0E4FF] flex items-center justify-center mx-auto shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin text-[#0071E3]" />
            </div>
            <div className="space-y-2">
              <p className="text-base text-[#1D1D1F] font-medium">Generating your resume</p>
              <p className="text-sm text-[#86868B] max-w-xs mx-auto leading-relaxed">
                Analyzing your background and the target role...
              </p>
            </div>
            <div className="w-72 mx-auto space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="h-2 w-2 rounded-full bg-[#0071E3] animate-pulse shrink-0"
                    style={{ animationDelay: `${i * 300}ms` }}
                  />
                  <div
                    className="h-3 bg-[#E5E5EA] rounded-full flex-1 animate-pulse"
                    style={{ animationDelay: `${i * 300}ms` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview view (post-generation, default) */}
      {showPdfView && (
        <>
          <div className="flex-1 flex flex-col min-h-0 p-4 lg:p-5 pb-0">
            <div className="flex-1 min-h-0 rounded-2xl border border-[#E5E5EA] overflow-hidden bg-white shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-[#E5E5EA]">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-[#6E6E73] tracking-wide">Resume Ready</span>
                </div>
                <span className="text-[11px] text-[#A1A1A6] font-mono">PDF</span>
              </div>
              <PdfPreview />
            </div>
          </div>

          {/* Action bar */}
          <div className="px-4 lg:px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDownloadPdf}
                className="h-9 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium shadow-sm rounded-xl px-4"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download PDF
              </Button>
              <Button
                onClick={handleOverleafExport}
                variant="outline"
                className="h-9 border-[#D1D1D6] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] hover:border-[#B0B0B5] text-xs font-medium rounded-xl px-4"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Overleaf
              </Button>
            </div>
            <Button
              onClick={toggleChat}
              className={`h-9 text-xs font-medium rounded-xl px-4 shadow-sm transition-all duration-200 ${
                chatOpen
                  ? 'bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#E8E8ED] border border-[#D1D1D6]'
                  : 'bg-gradient-to-br from-[#0071E3] to-[#40A9FF] text-white hover:from-[#0077ED] hover:to-[#45ADFF] shadow-blue-500/20'
              }`}
            >
              {chatOpen ? (
                <>
                  <X className="w-3.5 h-3.5 mr-1.5" />
                  Close Chat
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Tweak with AI
                </>
              )}
            </Button>
          </div>

          {/* Chat drawer */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              chatOpen ? 'max-h-[320px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="border-t border-[#E5E5EA] bg-white">
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 lg:px-5 py-2.5 bg-[#FAFAFA] border-b border-[#E5E5EA]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0071E3] to-[#40A9FF] flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-[#1D1D1F]">AI Assistant</span>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-[#A1A1A6] hover:text-[#6E6E73] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="max-h-[180px] overflow-y-auto px-4 lg:px-5 py-3 space-y-2.5">
                {displayMessages.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-xs text-[#86868B]">
                      Ask for tweaks, refinements, or new sections for your resume.
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
                  <div className="flex items-center gap-2 text-xs text-[#86868B] pl-10">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>AI is responding...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat input */}
              <form
                onSubmit={handleSendMessage}
                className="px-4 lg:px-5 py-3 border-t border-[#E5E5EA] bg-white"
              >
                <div className="flex gap-2.5">
                  <div className="relative flex-1">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Suggest a tweak..."
                      rows={1}
                      className="w-full resize-none rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] px-3.5 py-2 pr-10 text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all min-h-[36px] max-h-[80px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-9 w-9 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
