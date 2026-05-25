'use client';

import { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '@/lib/store';
import { Loader2, AlertCircle, FileText } from 'lucide-react';

export function PdfPreview() {
  const latexCode = useResumeStore((s) => s.latexCode);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectRef = useRef<HTMLObjectElement>(null);

  useEffect(() => {
    if (!latexCode) return;

    let cancelled = false;
    setIsCompiling(true);
    setError(null);

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }

    fetch('/api/compile-latex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latex: latexCode }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Compilation failed');
        const blob = await res.blob();
        if (cancelled) return;
        if (blob.size === 0) throw new Error('Empty PDF');
        setPdfUrl(URL.createObjectURL(blob));
        setIsCompiling(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Failed to compile PDF preview');
        setIsCompiling(false);
      });

    return () => {
      cancelled = true;
    };
  }, [latexCode]);

  if (isCompiling) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8F0FE] to-[#D0E4FF] flex items-center justify-center mb-4 shadow-sm">
          <Loader2 className="w-7 h-7 animate-spin text-[#0071E3]" />
        </div>
        <p className="text-sm text-[#1D1D1F] font-medium">Compiling your resume</p>
        <p className="text-xs text-[#86868B] mt-1">Rendering the PDF preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-sm text-[#1D1D1F] font-medium">Preview unavailable</p>
        <p className="text-xs text-[#86868B] mt-1 max-w-xs">{error}</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mb-4">
          <FileText className="w-7 h-7 text-[#A1A1A6]" />
        </div>
        <p className="text-sm text-[#1D1D1F] font-medium">No resume generated yet</p>
        <p className="text-xs text-[#86868B] mt-1">Generate a resume to see the preview here</p>
      </div>
    );
  }

  return (
    <object
      ref={objectRef}
      data={pdfUrl}
      type="application/pdf"
      className="w-full h-full"
    >
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <p className="text-sm text-[#86868B]">
          PDF preview is not supported in your browser.
        </p>
      </div>
    </object>
  );
}
