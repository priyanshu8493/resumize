import { NextRequest } from 'next/server';
import { extractText, getDocumentProxy } from 'unpdf';

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

    const buffer = await file.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { totalPages, text } = await extractText(pdf, { mergePages: true });

    if (!text.trim()) {
      return Response.json({
        error: 'Could not extract text from this PDF. It may be a scanned document or image-based file.',
      }, { status: 422 });
    }

    return Response.json({ text, pages: totalPages });
  } catch (error) {
    console.error('PDF Parse Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to parse PDF file';
    return Response.json({ error: message }, { status: 500 });
  }
}
