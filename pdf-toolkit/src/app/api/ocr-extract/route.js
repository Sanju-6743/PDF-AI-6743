import { NextResponse } from 'next/server';
import { extractTextWithOptic } from '../../../../utils/aiUtils';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Prefer Optic; falls back to Gemini inside utility
    const extractedText = await extractTextWithOptic(buffer);

    return NextResponse.json({
      success: true,
      text: extractedText,
      fileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('OCR extraction error:', error);
    return NextResponse.json({
      error: 'Failed to extract text from PDF',
      details: error.message
    }, { status: 500 });
  }
}
