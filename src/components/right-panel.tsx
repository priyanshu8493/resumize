'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './chat-message';
import { useResumeStore } from '@/lib/store';
import { Send, Loader2, Download, ExternalLink, FileDown } from 'lucide-react';
import { toast } from 'sonner';

function extractLatex(content: string): string | null {
  const match = content.match(/```latex\n?([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  if (!message.parts) return '';
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && p.text != null)
    .map(p => p.text)
    .join('');
}

export function RightPanel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  const {
    githubUrl, linkedinUrl, masterResume, targetJd,
    isLocked, isGenerating, hasLatex, latexCode,
    setLatexCode, setGenerating,
  } = useResumeStore();

  const { messages, sendMessage, status } = useChat({
    onFinish: ({ message }) => {
      setGenerating(false);
      const text = getMessageText(message);
      const latex = extractLatex(text);
      if (latex) {
        setLatexCode(latex);
      }
    },
    onError: () => {
      setGenerating(false);
      toast.error('Failed to generate response. Please check your API key and try again.');
    },
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!isGenerating || messages.length > 0) return;
    if (!masterResume && !targetJd) {
      setGenerating(false);
      return;
    }
    const contextMessage = [
      'Generate a tailored LaTeX resume for me based on the following information.',
      '',
      githubUrl ? `GitHub URL: ${githubUrl}` : '',
      linkedinUrl ? `LinkedIn URL: ${linkedinUrl}` : '',
      '',
      '=== MASTER RESUME ===',
      masterResume || '(No master resume provided)',
      '',
      '=== TARGET JOB DESCRIPTION ===',
      targetJd || '(No target job description provided)',
    ]
      .filter(Boolean)
      .join('\n');

    sendMessage({ text: contextMessage });
  }, [isGenerating]);

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input.trim() });
    setInput('');
  }, [input, sendMessage]);

  const handleDownloadPdf = useCallback(async () => {
    if (!latexCode) return;
    const encoded = encodeURIComponent(latexCode);
    window.open(`https://latexonline.cc/compile?text=${encoded}`, '_blank');
    toast.success('Opening compiled PDF in new tab...');
  }, [latexCode]);

  const handleOverleafExport = useCallback(() => {
    if (!latexCode) return;
    const encoded = encodeURIComponent(latexCode);
    window.open(`https://www.overleaf.com/docs?snip_uri=data:text/x-tex;charset=utf-8,${encoded}`, '_blank');
    toast.success('Opening Overleaf...');
  }, [latexCode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.length === 0 && !isGenerating && (
            <div className="flex flex-col items-center justify-center h-[75vh] text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8F0FE] to-[#D0E4FF] flex items-center justify-center mb-6 shadow-sm">
                <FileDown className="w-7 h-7 text-[#0071E3]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-2 tracking-tight">
                Your tailored resume awaits
              </h2>
              <p className="text-sm text-[#86868B] max-w-md leading-relaxed">
                Fill in your details on the left panel, then click{' '}
                <span className="text-[#0071E3] font-medium">Generate Tailored Resume</span>
                {' '}to create an ATS-optimized LaTeX resume.
              </p>
            </div>
          )}

          {isGenerating && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[75vh] space-y-6">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-[#0071E3]" />
                <span className="text-sm text-[#6E6E73] font-medium">Generating your tailored resume...</span>
              </div>
              <div className="w-64 space-y-3">
                <div className="h-3 bg-[#E5E5EA] rounded-full animate-pulse" />
                <div className="h-3 bg-[#E5E5EA] rounded-full animate-pulse w-5/6" />
                <div className="h-3 bg-[#E5E5EA] rounded-full animate-pulse w-4/6" />
                <div className="h-3 bg-[#E5E5EA] rounded-full animate-pulse w-3/6" />
                <div className="h-3 bg-[#E5E5EA] rounded-full animate-pulse w-5/6" />
              </div>
            </div>
          )}

          {messages.map((m) => (
            <ChatMessage
              key={m.id}
              role={m.role as 'user' | 'assistant'}
              content={getMessageText(m)}
            />
          ))}

          {isLoading && messages.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-[#86868B] pl-11">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>AI is responding...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {hasLatex && (
        <div className="flex items-center gap-2 px-6 lg:px-10 py-3.5 bg-white/80 backdrop-blur-lg border-t border-[#E5E5EA]">
          <Button
            onClick={handleDownloadPdf}
            className="h-9 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium shadow-sm rounded-lg"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Generate & Download PDF
          </Button>
          <Button
            onClick={handleOverleafExport}
            variant="outline"
            className="h-9 border-[#D1D1D6] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] text-xs font-medium rounded-lg"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Export to Overleaf
          </Button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="px-6 lg:px-10 py-4 bg-white border-t border-[#E5E5EA]">
        <div className="max-w-3xl mx-auto flex gap-3">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for tweaks, refinements, or new sections..."
              disabled={!isLocked}
              rows={1}
              className="w-full resize-none rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] px-4 py-2.5 pr-12 text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[42px] max-h-[120px]"
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isLoading || !isLocked}
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
