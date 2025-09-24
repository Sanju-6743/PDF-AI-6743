import { NextRequest, NextResponse } from 'next/server';
import { analyzePdfWithGemini } from '../../../../utils/aiUtils';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const summaryLength = formData.get('length') || 'medium'; // short, medium, long

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create summary prompt based on length
    const lengthPrompts = {
      short: 'Provide a brief 2-3 sentence summary of this PDF document.',
      medium: 'Provide a comprehensive summary of this PDF document, covering the main points and key information.',
      long: 'Provide a detailed summary of this PDF document, including all major sections, key points, and important details.'
    };

    const prompt = lengthPrompts[summaryLength] || lengthPrompts.medium;

    // Use Gemini AI for summarization
    const summary = await analyzePdfWithGemini(buffer, 'summary');

    return NextResponse.json({
      success: true,
      summary: summary,
      length: summaryLength,
      fileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('AI summarization error:', error);
    return NextResponse.json({
      error: 'Failed to summarize PDF',
      details: error.message
    }, { status: 500 });
  }
}
