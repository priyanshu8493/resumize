'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, FileText, Loader2, X, RefreshCw } from 'lucide-react';
import { useResumeStore } from '@/lib/store';
import { toast } from 'sonner';

export function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { masterResume, resumeFileName, isParsing, isLocked, setField } = useResumeStore();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB');
      return;
    }

    setField('resumeFileName', file.name);
    setField('isParsing', true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse PDF');
      }

      setField('masterResume', data.text);
      toast.success(`Parsed resume from ${file.name}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to parse PDF';
      toast.error(msg + '. Try pasting the text manually instead.');
      setField('resumeFileName', '');
    } finally {
      setField('isParsing', false);
    }
  }, [setField]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    if (!isLocked) inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setField('resumeFileName', '');
    setField('masterResume', '');
  };

  const hasContent = masterResume.length > 0;

  const dropZone = (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative flex flex-col items-center justify-center gap-2 px-4 py-7
        border-2 border-dashed rounded-xl cursor-pointer
        transition-all duration-200
        ${isDragOver
          ? 'border-[#0071E3] bg-[#E8F0FE]'
          : 'border-[#D1D1D6] bg-[#F5F5F7] hover:border-[#0071E3]/50 hover:bg-[#F5F7FA]'
        }
        ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}
      `}
    >
      {isParsing ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin text-[#0071E3]" />
          <span className="text-xs text-[#6E6E73]">Parsing resume...</span>
        </>
      ) : (
        <>
          <Upload className="w-5 h-5 text-[#86868B]" />
          <div className="text-center">
            <span className="text-sm font-medium text-[#1D1D1F]">
              {hasContent ? 'Replace PDF' : 'Upload PDF'}
            </span>
            <p className="text-xs text-[#86868B] mt-0.5">
              Drag & drop or click to browse
            </p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        className="hidden"
        disabled={isLocked}
      />

      {!hasContent ? (
        dropZone
      ) : (
        <>
          <div className="flex items-center gap-2.5 bg-[#F5F5F7] border border-[#D1D1D6] rounded-xl px-3.5 py-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8F0FE] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-[#0071E3]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1D1D1F] truncate">
                {resumeFileName || 'Parsed resume'}
              </p>
              <p className="text-xs text-[#86868B]">
                {masterResume.length.toLocaleString()} chars extracted
              </p>
            </div>
            {!isLocked && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClick}
                  className="h-7 w-7 rounded-lg hover:bg-white flex items-center justify-center text-[#86868B] hover:text-[#0071E3] transition-colors"
                  title="Replace file"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={clearFile}
                  className="h-7 w-7 rounded-lg hover:bg-white flex items-center justify-center text-[#86868B] hover:text-[#FF3B30] transition-colors"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <textarea
            value={masterResume}
            onChange={(e) => setField('masterResume', e.target.value)}
            disabled={isLocked}
            placeholder="Paste your existing resume text here..."
            className="min-h-[140px] w-full text-sm bg-[#F5F5F7] border border-[#D1D1D6] text-[#1D1D1F] placeholder:text-[#A1A1A6] focus-visible:ring-[#0071E3] focus-visible:border-[#0071E3] transition-all resize-none rounded-xl p-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </>
      )}
    </div>
  );
}
