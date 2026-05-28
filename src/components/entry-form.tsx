'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

type EntryType = 'project' | 'experience' | 'achievement';

interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: { label: string; value: string }[];
}

const FIELDS: Record<EntryType, Field[]> = {
  project: [
    { key: 'title', label: 'Project Title', type: 'text', placeholder: 'e.g. E-commerce Platform' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief overview of the project...' },
    { key: 'problemStatement', label: 'Problem Statement', type: 'textarea', placeholder: 'What problem did it solve?' },
    { key: 'techStack', label: 'Tech Stack', type: 'text', placeholder: 'e.g. React, Node.js, PostgreSQL' },
    { key: 'link', label: 'Link (optional)', type: 'text', placeholder: 'https://github.com/...' },
    { key: 'duration', label: 'Duration (optional)', type: 'text', placeholder: 'e.g. Jan 2025 - Mar 2025' },
  ],
  experience: [
    { key: 'company', label: 'Company', type: 'text', placeholder: 'e.g. Google' },
    { key: 'role', label: 'Role', type: 'text', placeholder: 'e.g. Software Engineer Intern' },
    { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. Jun 2025 - Sep 2025' },
    { key: 'description', label: 'Role Description', type: 'textarea', placeholder: 'Describe your responsibilities...' },
    { key: 'achievements', label: 'Key Achievements', type: 'textarea', placeholder: 'Quantifiable achievements and impact...' },
  ],
  achievement: [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. AWS Certified Solutions Architect' },
    {
      key: 'type', label: 'Type', type: 'select',
      options: [
        { label: 'Certification', value: 'certification' },
        { label: 'Education', value: 'education' },
        { label: 'Achievement', value: 'achievement' },
        { label: 'Publication', value: 'publication' },
      ],
    },
    { key: 'issuer', label: 'Issuer / Institution', type: 'text', placeholder: 'e.g. Amazon Web Services' },
    { key: 'date', label: 'Date', type: 'text', placeholder: 'e.g. 2025' },
    { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Details about this achievement...' },
  ],
};

const INITIAL_VALUES: Record<EntryType, Record<string, string>> = {
  project: { title: '', description: '', problemStatement: '', techStack: '', link: '', duration: '' },
  experience: { company: '', role: '', duration: '', description: '', achievements: '' },
  achievement: { title: '', type: 'certification', issuer: '', date: '', description: '' },
};

interface EntryFormProps {
  type: EntryType;
  onSave: (values: Record<string, string>) => void;
  initialValues?: Record<string, string>;
}

export function EntryForm({ type, onSave, initialValues }: EntryFormProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(initialValues ?? INITIAL_VALUES[type]);

  const fields = FIELDS[type];
  const isEditing = !!initialValues;

  const handleSave = () => {
    onSave(values);
    if (!isEditing) {
      setValues(INITIAL_VALUES[type]);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    if (!isEditing) {
      setValues(INITIAL_VALUES[type]);
      setOpen(false);
    }
  };

  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const isValid = fields.every((f) => {
    if (f.type === 'select') return true;
    const val = values[f.key]?.trim();
    const isRequired = f.key !== 'link' && f.key !== 'duration';
    return isRequired ? val && val.length > 0 : true;
  });

  const dialogTitle =
    type === 'project' ? 'Add Project' : type === 'experience' ? 'Add Experience' : 'Add Achievement';

  if (isEditing) {
    return (
      <div className="space-y-3">
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {fields.map((field) => (
            <div key={field.key} className="space-y-1">
              <label className="text-[11px] font-medium text-[#6E6E73]">{field.label}</label>
              {field.type === 'textarea' ? (
                <Textarea
                  value={values[field.key] ?? ''}
                  onChange={(e) => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="min-h-[70px] text-sm bg-[#F5F5F7] border-[#D1D1D6]"
                />
              ) : field.type === 'select' ? (
                <select
                  value={values[field.key] ?? ''}
                  onChange={(e) => set(field.key, e.target.value)}
                  className="w-full h-9 rounded-lg border border-[#D1D1D6] bg-[#F5F5F7] px-2.5 text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all"
                >
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <Input
                  value={values[field.key] ?? ''}
                  onChange={(e) => set(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="h-9 text-sm bg-[#F5F5F7] border-[#D1D1D6]"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isValid}
            className="text-xs"
          >
            Save Changes
          </Button>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-1.5 h-9 rounded-xl border border-dashed border-[#D1D1D6] text-xs font-medium text-[#6E6E73] hover:border-[#0071E3] hover:text-[#0071E3] hover:bg-[#E8F0FE] transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        {dialogTitle}
      </button>
    );
  }

  return (
    <div className="bg-white border border-[#D1D1D6] rounded-xl p-4 space-y-3 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#1D1D1F]">{dialogTitle}</span>
        <button
          onClick={handleCancel}
          className="h-6 w-6 rounded-lg hover:bg-[#F5F5F7] flex items-center justify-center text-[#86868B] hover:text-[#1D1D1F] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-2.5 max-h-[50vh] overflow-y-auto">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1">
            <label className="text-[11px] font-medium text-[#6E6E73]">{field.label}</label>
            {field.type === 'textarea' ? (
              <Textarea
                value={values[field.key] ?? ''}
                onChange={(e) => set(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="min-h-[70px] text-sm bg-[#F5F5F7] border-[#D1D1D6]"
              />
            ) : field.type === 'select' ? (
              <select
                value={values[field.key] ?? ''}
                onChange={(e) => set(field.key, e.target.value)}
                className="w-full h-9 rounded-lg border border-[#D1D1D6] bg-[#F5F5F7] px-2.5 text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all"
              >
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <Input
                value={values[field.key] ?? ''}
                onChange={(e) => set(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="h-9 text-sm bg-[#F5F5F7] border-[#D1D1D6]"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="text-xs"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isValid}
          className="text-xs"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
