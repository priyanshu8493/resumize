'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useResumeStore } from '@/lib/store';
import { Loader2, AlertCircle, FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

export function PdfPreview() {
  const latexCode = useResumeStore((s) => s.latexCode);
  const [state, setState] = useState<'compiling' | 'loading' | 'ready' | 'error'>('compiling');
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);

  useEffect(() => {
    if (!latexCode) return;
    let cancelled = false;

    setState('compiling');
    setError(null);
    setPageNumber(1);
    pdfDocRef.current = null;

    fetch('/api/compile-latex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latex: latexCode }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Compilation failed');
        }
        const blob = await res.blob();
        if (cancelled) return;
        if (blob.size === 0) throw new Error('Empty PDF');

        setState('loading');

        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await blob.arrayBuffer();
        if (cancelled) return;
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setState('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Failed to load PDF');
        setState('error');
      });

    return () => { cancelled = true; };
  }, [latexCode]);

  useEffect(() => {
    if (state !== 'ready' || !canvasRef.current) return;
    let cancelled = false;

    const renderPage = async () => {
      const pdf = pdfDocRef.current;
      if (!pdf) return;
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      await page.render({ canvasContext: ctx, viewport }).promise;
    };

    renderPage();

    return () => { cancelled = true; };
  }, [state, pageNumber, scale]);

  const goPrev = useCallback(() => setPageNumber((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(() => setPageNumber((p) => Math.min(numPages, p + 1)), [numPages]);
  const zoomIn = useCallback(() => setScale((s) => Math.min(3, s + 0.2)), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(0.4, s - 0.2)), []);

  if (state === 'compiling') {
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

  if (state === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-sm text-[#1D1D1F] font-medium">Preview unavailable</p>
        <p className="text-xs text-[#86868B] mt-1.5 max-w-xs leading-relaxed">{error}</p>
        <p className="text-xs text-[#A1A1A6] mt-3 max-w-xs leading-relaxed">
          Ask the AI assistant to fix the LaTeX and regenerate.
        </p>
      </div>
    );
  }

  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8F0FE] to-[#D0E4FF] flex items-center justify-center mb-4 shadow-sm">
          <Loader2 className="w-7 h-7 animate-spin text-[#0071E3]" />
        </div>
        <p className="text-sm text-[#1D1D1F] font-medium">Loading PDF</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#E5E5EA] bg-[#FAFAFA]">
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="h-7 w-7 rounded-lg hover:bg-[#E5E5EA] flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-[#86868B] font-medium tabular-nums w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="h-7 w-7 rounded-lg hover:bg-[#E5E5EA] flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
        {numPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={pageNumber <= 1}
              className="h-7 w-7 rounded-lg hover:bg-[#E5E5EA] flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-[#86868B] font-medium tabular-nums">
              {pageNumber} / {numPages}
            </span>
            <button
              onClick={goNext}
              disabled={pageNumber >= numPages}
              className="h-7 w-7 rounded-lg hover:bg-[#E5E5EA] flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto bg-[#F0F0F2] flex items-start justify-center p-6">
        <canvas ref={canvasRef} className="shadow-xl rounded-sm" />
      </div>
    </div>
  );
}
