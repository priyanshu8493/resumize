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

function formatInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /\*\*(.*?)\*\*/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={match.index}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
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

  const renderedBlocks = blocks.map((block, idx) => (
    <div
      key={idx}
      className={`${
        role === 'user'
          ? 'bg-[#0071E3] text-white rounded-2xl rounded-tr-sm'
          : 'bg-white border border-[#E5E5EA] rounded-2xl rounded-tl-sm shadow-sm'
      } px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap`}
    >
      {formatInline(block.content)}
    </div>
  ));

  return (
    <div className={`flex gap-3 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'assistant' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#0071E3] to-[#40A9FF] flex items-center justify-center mt-0.5 shadow-sm">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-[85%] space-y-1.5 ${role === 'user' ? 'order-1' : 'order-2'}`}>
        {renderedBlocks}
      </div>

      {role === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center mt-0.5">
          <User className="w-4 h-4 text-[#6E6E73]" />
        </div>
      )}
    </div>
  );
}
