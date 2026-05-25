import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (file.type !== 'application/pdf') {
      return new Response(JSON.stringify({ error: 'Only PDF files are accepted' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);

    const text = data.text.trim();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Could not extract text from PDF. The file may be scanned or image-based.' }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ text, pages: data.numpages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PDF Parse Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to parse PDF file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
