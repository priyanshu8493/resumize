'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, User, Bot } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

function extractLatexBlocks(content: string): Array<{ type: 'text' | 'latex'; content: string }> {
  const blocks: Array<{ type: 'text' | 'latex'; content: string }> = [];
  const regex = /```latex\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    }
    blocks.push({ type: 'latex', content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    blocks.push({ type: 'text', content: content.slice(lastIndex) });
  }

  return blocks;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const blocks = useMemo(() => extractLatexBlocks(content), [content]);

  const copyLatex = (latex: string, index: number) => {
    navigator.clipboard.writeText(latex);
    setCopiedIndex(index);
    toast.success('LaTeX copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={`flex gap-3 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'assistant' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#0071E3] to-[#40A9FF] flex items-center justify-center mt-0.5 shadow-sm">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-[85%] ${role === 'user' ? 'order-1' : 'order-2'}`}>
        {role === 'user' ? (
          <div className="bg-[#0071E3] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed shadow-sm">
            {content}
          </div>
        ) : (
          <div className="space-y-3">
            {blocks.length === 0 ? (
              <div className="bg-white border border-[#E5E5EA] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-[#1D1D1F] leading-relaxed whitespace-pre-wrap shadow-sm">
                {content}
              </div>
            ) : (
              blocks.map((block, idx) =>
                block.type === 'latex' ? (
                  <div key={idx} className="group relative bg-white border border-[#E5E5EA] rounded-xl overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#F5F5F7] border-b border-[#E5E5EA]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                        <span className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                        <span className="w-2 h-2 rounded-full bg-[#28C840]" />
                        <span className="text-xs font-mono text-[#6E6E73] font-medium ml-2">LaTeX</span>
                      </div>
                      <button
                        onClick={() => copyLatex(block.content, idx)}
                        className="flex items-center gap-1.5 text-xs text-[#86868B] hover:text-[#1D1D1F] transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {copiedIndex === idx ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="p-4 text-xs leading-relaxed text-[#1D1D1F] font-mono overflow-x-auto whitespace-pre-wrap">
                      {block.content}
                    </pre>
                  </div>
                ) : (
                  <div key={idx} className="bg-white border border-[#E5E5EA] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-[#1D1D1F] leading-relaxed whitespace-pre-wrap shadow-sm">
                    {block.content}
                  </div>
                )
              )
            )}
          </div>
        )}
      </div>

      {role === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center mt-0.5">
          <User className="w-4 h-4 text-[#6E6E73]" />
        </div>
      )}
    </div>
  );
}
