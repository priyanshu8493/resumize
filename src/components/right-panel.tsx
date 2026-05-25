'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './chat-message';
import { PdfPreview } from './pdf-preview';
import { useResumeStore } from '@/lib/store';
import { Send, Loader2, Download, ExternalLink, FileDown, MessageSquare } from 'lucide-react';
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const showEmptyState = messages.length === 0 && !store.isGenerating;
  const showGenerationLoading = store.isGenerating && messages.length === 0;
  const showPdfView = store.hasLatex;
  const showChatOnly = !showPdfView && !showEmptyState && !showGenerationLoading;

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* Empty state */}
      {showEmptyState && (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8F0FE] to-[#D0E4FF] flex items-center justify-center mb-6 mx-auto shadow-sm">
              <FileDown className="w-7 h-7 text-[#0071E3]" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-2 tracking-tight">
              Your tailored resume awaits
            </h2>
            <p className="text-sm text-[#86868B] leading-relaxed">
              Fill in your details on the left panel, then click{' '}
              <span className="text-[#0071E3] font-medium">Generate Tailored Resume</span>
              {' '}to create an ATS-optimized LaTeX resume.
            </p>
          </div>
        </div>
      )}

      {/* Loading animation */}
      {showGenerationLoading && (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E8F0FE] to-[#D0E4FF] flex items-center justify-center mx-auto shadow-sm">
                <Loader2 className="w-8 h-8 animate-spin text-[#0071E3]" />
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-base text-[#1D1D1F] font-medium">Generating your tailored resume</span>
              <p className="text-sm text-[#86868B] max-w-xs mx-auto">
                Analyzing your background and the target role to create the perfect resume...
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

      {/* PDF Preview + Chat view */}
      {showPdfView && (
        <>
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-0 bg-white mx-4 lg:mx-6 mt-4 rounded-xl border border-[#E5E5EA] overflow-hidden shadow-sm">
              <PdfPreview />
            </div>

            <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between bg-white/80 backdrop-blur-lg border-b border-[#E5E5EA]">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleDownloadPdf}
                  className="h-8 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium shadow-sm rounded-lg"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download PDF
                </Button>
                <Button
                  onClick={handleOverleafExport}
                  variant="outline"
                  className="h-8 border-[#D1D1D6] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] text-xs font-medium rounded-lg"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Export to Overleaf
                </Button>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#86868B]">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat below to tweak</span>
              </div>
            </div>

            <div className="max-h-[200px] overflow-y-auto px-4 lg:px-6 py-3 space-y-3">
              {messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  role={m.role as 'user' | 'assistant'}
                  content={getMessageText(m)}
                  hideLatex
                />
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-[#86868B] pl-11">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI is responding...</span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        </>
      )}

      {/* Chat-only view (during initial conversation or when no PDF yet) */}
      {showChatOnly && (
        <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          <div className="max-w-3xl mx-auto space-y-5">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role as 'user' | 'assistant'}
                content={getMessageText(m)}
              />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-[#86868B] pl-11">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI is responding...</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      )}

      {/* Chat input */}
      <form onSubmit={handleSendMessage} className="px-4 lg:px-6 py-3 bg-white border-t border-[#E5E5EA]">
        <div className="max-w-3xl mx-auto flex gap-3">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for tweaks, refinements, or new sections..."
              disabled={!store.isLocked}
              rows={1}
              className="w-full resize-none rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] px-4 py-2.5 pr-12 text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[42px] max-h-[120px]"
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isLoading || !store.isLocked}
            size="icon"
            className="h-[42px] w-[42px] rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm"
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
}
