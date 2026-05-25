import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { latex } = await req.json();
    if (!latex) {
      return new Response(JSON.stringify({ error: 'No LaTeX provided' }), { status: 400 });
    }

    const response = await fetch(
      `https://latexonline.cc/compile?text=${encodeURIComponent(latex)}`,
      { redirect: 'follow' }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return new Response(JSON.stringify({ error: `Compilation failed: ${text}` }), {
        status: 502,
      });
    }

    const pdfBuffer = await response.arrayBuffer();

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"',
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Compile error:', error);
    return new Response(JSON.stringify({ error: 'Compilation failed' }), { status: 500 });
  }
}
