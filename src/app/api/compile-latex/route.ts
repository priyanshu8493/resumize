import { NextRequest } from 'next/server';

const LATEXONLINE_URL = 'https://latexonline.cc/compile';
const ABORT_TIMEOUT = 30000;

function sanitizeLatex(raw: string): string {
  let latex = raw.replace(/^```latex\s*/i, '').replace(/```\s*$/, '').trim();

  // Strip packages that often cause issues on shared TeX distros
  latex = latex.replace(/\\usepackage\{(?:fontawesome|fontawsome|fa|moderncv|marvosym)\}/gi, '');
  latex = latex.replace(/\\includegraphics\{[^}]*\}/g, '');

  // Replace unsupported enumitem `left=` syntax with compatible variant
  // Old TeX distros (like on latexonline) don't support left=0pt on itemize
  latex = latex.replace(/\\begin\{itemize\}\[left=0pt\]/g, '\\begin{itemize}');
  latex = latex.replace(/\\setlist\{[^}]*left=0pt[^}]*\}/g, '\\setlist{nosep,leftmargin=*}');
  latex = latex.replace(/\\setlist\{[^}]*left=0pt\.\.[^}]*\}/g, '\\setlist{nosep,leftmargin=*}');

  // Remove \\definecolor — xcolor may have conflicts
  latex = latex.replace(/\\definecolor\{[^}]*\}\{[^}]*\}\{[^}]*\}/g, '');

  // Replace problematic unicode with safe LaTeX equivalents
  latex = latex.replace(/[–—]/g, '--');
  latex = latex.replace(/[''""]/g, "'");
  latex = latex.replace(/…/g, '...');
  latex = latex.replace(/[−]/g, '-');

  // Ensure it ends with \\end{document}
  if (!latex.endsWith('\\end{document}') && !latex.endsWith('\\end{document} ')) {
    latex = latex + '\n\\end{document}';
  }

  return latex;
}

export async function POST(req: NextRequest) {
  try {
    const { latex } = await req.json();
    if (!latex) {
      return new Response(JSON.stringify({ error: 'No LaTeX provided' }), { status: 400 });
    }

    const sanitized = sanitizeLatex(latex);

    const url = `${LATEXONLINE_URL}?text=${encodeURIComponent(sanitized)}`;
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(ABORT_TIMEOUT),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const errorMsg = text.slice(0, 800)
        .split('\n').slice(0, 10).join('\n');
      return new Response(
        JSON.stringify({
          error: `LaTeX compilation failed`,
          detail: errorMsg,
        }),
        { status: 422 },
      );
    }

    const pdfBuffer = await res.arrayBuffer();
    if (pdfBuffer.byteLength === 0) {
      return new Response(JSON.stringify({ error: 'Empty PDF returned' }), { status: 422 });
    }

    // Validate it's actually a PDF
    const header = new Uint8Array(pdfBuffer.slice(0, 5));
    const isPdf = header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46;

    if (!isPdf) {
      const text = new TextDecoder().decode(pdfBuffer.slice(0, 200));
      return new Response(
        JSON.stringify({
          error: 'Compilation did not produce a PDF',
          detail: text,
        }),
        { status: 422 },
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
      JSON.stringify({ error: 'Compilation service timed out. Try again.' }),
      { status: 500 },
    );
  }
}
