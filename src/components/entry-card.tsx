'use client';

import { Trash2 } from 'lucide-react';
import type { Project, Experience, Achievement } from '@/lib/store';

type Entry = Project | Experience | Achievement;

interface EntryCardProps {
  entry: Entry;
  type: 'project' | 'experience' | 'achievement';
  onDelete: (id: string) => void;
  onEdit: (entry: Entry) => void;
  isLocked: boolean;
}

const LABELS: Record<string, { primary: string; secondary: string }> = {
  project: { primary: 'title', secondary: 'techStack' },
  experience: { primary: 'role', secondary: 'company' },
  achievement: { primary: 'title', secondary: 'issuer' },
};

export function EntryCard({ entry, type, onDelete, isLocked }: EntryCardProps) {
  const cfg = LABELS[type];

  const e = entry as unknown as Record<string, string>;
  const primary = e[cfg.primary] || 'Untitled';
  const secondary = e[cfg.secondary] || '';

  const typeBadge =
    type === 'project' ? 'Project' : type === 'experience' ? 'Experience' : 'Achievement';

  const typeColor =
    type === 'project'
      ? 'bg-[#E8F0FE] text-[#0071E3]'
      : type === 'experience'
        ? 'bg-[#F0F0FF] text-[#6E4DFF]'
        : 'bg-[#FFF3E0] text-[#E67E22]';

  return (
    <div className="group relative flex items-start gap-3 bg-white border border-[#E5E5EA] rounded-xl p-3.5 hover:border-[#D1D1D6] transition-all">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md ${typeColor}`}>
            {typeBadge}
          </span>
          {type === 'achievement' && 'type' in entry && (
            <span className="text-[10px] text-[#86868B] capitalize">
              {(entry as Achievement).type}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-[#1D1D1F] truncate">{primary}</p>
        {secondary && (
          <p className="text-xs text-[#86868B] truncate mt-0.5">{secondary}</p>
        )}
      </div>
      {!isLocked && (
        <button
          onClick={() => onDelete(entry.id)}
          className="shrink-0 h-7 w-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-[#A1A1A6] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          title="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
