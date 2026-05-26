'use client';

import { useMemo } from 'react';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  hideLatex?: boolean;
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

export function ChatMessage({ role, content, hideLatex }: ChatMessageProps) {
  const { blocks, hasLatex } = useMemo(() => {
    const raw = extractLatexBlocks(content);
    const latexPresent = raw.some((b) => b.type === 'latex');
    return {
      blocks: hideLatex ? raw.filter((b) => b.type === 'text') : raw,
      hasLatex: latexPresent,
    };
  }, [content, hideLatex]);

  if (role === 'assistant' && hideLatex && blocks.length === 0 && hasLatex) {
    return null;
  }

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
              blocks.map((block, idx) => (
                <div key={idx} className="bg-white border border-[#E5E5EA] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-[#1D1D1F] leading-relaxed whitespace-pre-wrap shadow-sm">
                  {block.content}
                </div>
              ))
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
