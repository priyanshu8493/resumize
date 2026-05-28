import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return Response.json({ error: 'Only PDF files are accepted' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const data = new Uint8Array(arrayBuffer);
    const doc = await pdfjs.getDocument({ data }).promise;
    const pages: string[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item: { str?: string }) => item.str ?? '').join(' ');
      pages.push(text);
    }

    const text = pages.join('\n\n').trim();

    if (!text) {
      return Response.json({
        error: 'Could not extract text from this PDF. It may be a scanned document or image-based file.',
      }, { status: 422 });
    }

    return Response.json({ text, pages: doc.numPages });
  } catch (error) {
    console.error('PDF Parse Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to parse PDF file';
    return Response.json({ error: message }, { status: 500 });
  }
}
