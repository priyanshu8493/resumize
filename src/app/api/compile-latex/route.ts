import { NextRequest } from 'next/server';

const LATEXONLINE_URL = 'https://latexonline.cc/compile';
const ABORT_TIMEOUT = 30000;

function sanitizeLatex(raw: string): string {
  let latex = raw
    .replace(/^```latex\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  // Strip ALL problematic packages that aren't in the allowed set
  const allowedPackages = ['inputenc', 'fontenc', 'geometry', 'enumitem', 'hyperref', 'xcolor'];
  latex = latex.replace(/\\usepackage\{([^}]*)\}/gi, (match, pkg) => {
    const pkgName = pkg.trim().toLowerCase();
    return allowedPackages.includes(pkgName) ? match : '';
  });

  // Strip includes and graphics
  latex = latex.replace(/\\includegraphics\{[^}]*\}/g, '');
  latex = latex.replace(/\\includesvg\{[^}]*\}/g, '');
  latex = latex.replace(/\\include\{[^}]*\}/g, '');

  // Strip definecolor AND all \textcolor{...} usages (since definecolor may fail on old TeX distros)
  latex = latex.replace(/\\definecolor\{[^}]*\}\{[^}]*\}\{[^}]*\}/gi, '');
  latex = latex.replace(/\\textcolor\{[^}]*\}/g, '');

  // Strip fontawesome and other icon commands
  latex = latex.replace(/\\fa[A-Z][a-zA-Z]*/g, '');

  // Replace unsupported enumitem syntax
  latex = latex.replace(/\\begin\{itemize\}\[left=0pt\]/g, '\\begin{itemize}');
  latex = latex.replace(/\\begin\{itemize\}\[left=\s*0*\.?\s*0*\s*pt\s*\]/g, '\\begin{itemize}');
  latex = latex.replace(/\\setlist\{[^}]*left\s*=\s*0\s*pt[^}]*\}/g, '\\setlist{nosep,leftmargin=*}');
  latex = latex.replace(/\\setlist\{[^}]*left\s*=\s*0\.\.[^}]*\}/g, '\\setlist{nosep,leftmargin=*}');

  // Fix common font size nesting issues: \textsc{\large\bfseries ...} -> {\large\bfseries ...}
  latex = latex.replace(/\\textsc\{/g, '{');
  // Ensure proper brace matching for font commands
  latex = latex.replace(/\\textbf\{/g, '\\textbf{');
  latex = latex.replace(/\\textit\{/g, '\\textit{');

  // Replace problematic unicode with safe LaTeX equivalents
  latex = latex.replace(/[–—]/g, '--');
  latex = latex.replace(/[''""]/g, "'");
  latex = latex.replace(/…/g, '...');
  latex = latex.replace(/[−]/g, '-');
  latex = latex.replace(/[•]/g, '*');
  latex = latex.replace(/[′´`]/g, "'");
  latex = latex.replace(/[←↑→↓↔↕]/g, '');

  // Replace common HTML entities that might be in AI output
  latex = latex.replace(/&amp;/g, '&');
  latex = latex.replace(/&lt;/g, '<');
  latex = latex.replace(/&gt;/g, '>');
  latex = latex.replace(/&quot;/g, '"');

  // Remove bare \small, \footnotesize, \normalsize at top level
  latex = latex.replace(/\\small\s*$/gm, '');
  latex = latex.replace(/\\footnotesize\s*$/gm, '');
  latex = latex.replace(/\\normalsize\s*$/gm, '');

  // Ensure no \\begin{document} appears twice
  const docStartCount = (latex.match(/\\begin\{document\}/g) || []).length;
  if (docStartCount > 1) {
    const firstDoc = latex.indexOf('\\begin{document}');
    const lastDoc = latex.lastIndexOf('\\begin{document}');
    latex = latex.substring(0, firstDoc + '\\begin{document}'.length) +
            latex.substring(lastDoc + '\\begin{document}'.length);
  }

  // Ensure it ends with \\end{document}
  const cleanLatex = latex.trim();
  if (!cleanLatex.endsWith('\\end{document}')) {
    latex = cleanLatex + '\n\\end{document}';
  } else {
    latex = cleanLatex;
  }

  return latex;
}

export async function POST(req: NextRequest) {
  try {
    const { latex } = await req.json();
    if (!latex) {
      return new Response(JSON.stringify({ error: 'No LaTeX provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sanitized = sanitizeLatex(latex);

    // First try: send to latexonline.cc
    const url = `${LATEXONLINE_URL}?text=${encodeURIComponent(sanitized)}`;
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(ABORT_TIMEOUT),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      // Extract meaningful error from HTML response
      const errorLines = errorText
        .split('\n')
        .map(l => l.replace(/<[^>]+>/g, '').trim())
        .filter(l => l.length > 0 && !l.includes('DOCTYPE') && !l.includes('html') && !l.includes('meta') && !l.includes('body') && !l.includes('head'));
      const errorMsg = errorLines.slice(0, 20).join('\n');

      console.error('LaTeX compilation error:', errorMsg);
      console.error('Sanitized LaTeX:', sanitized.substring(0, 2000));

      return new Response(
        JSON.stringify({
          error: 'LaTeX compilation failed',
          detail: errorMsg || 'Unknown compilation error. Try asking the AI to fix the LaTeX.',
        }),
        {
          status: 422,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const pdfBuffer = await res.arrayBuffer();
    if (pdfBuffer.byteLength === 0) {
      return new Response(JSON.stringify({ error: 'Empty PDF returned' }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate it's actually a PDF
    const header = new Uint8Array(pdfBuffer.slice(0, 5));
    const isPdf = header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46;

    if (!isPdf) {
      const text = new TextDecoder().decode(pdfBuffer.slice(0, 500));
      console.error('Non-PDF response:', text);
      return new Response(
        JSON.stringify({
          error: 'Compilation did not produce a PDF',
          detail: text.slice(0, 300),
        }),
        {
          status: 422,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"',
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Compile error:', error);
    return new Response(
      JSON.stringify({
        error: 'Compilation service timed out or failed. Try again or ask the AI to simplify the LaTeX.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
