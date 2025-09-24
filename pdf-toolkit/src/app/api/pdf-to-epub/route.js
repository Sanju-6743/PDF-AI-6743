import { NextRequest, NextResponse } from 'next/server';
import { analyzePdfWithGemini } from '../../../../utils/aiUtils';

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

    // Use Gemini AI to extract ePub content structure
    const epubContent = await analyzePdfWithGemini(buffer, 'epub');

    // For now, return structured data that could be used to create an ePub
    // In a real implementation, you'd use a library like epub-gen
    return NextResponse.json({
      success: true,
      epubData: epubContent,
      format: 'json', // Would be 'epub' in full implementation
      fileName: file.name.replace('.pdf', '.epub'),
      originalFileName: file.name,
      fileSize: file.size,
      chapters: epubContent.split('\n\n').length // Rough chapter count
    });

  } catch (error) {
    console.error('PDF to ePub conversion error:', error);
    return NextResponse.json({
      error: 'Failed to convert PDF to ePub',
      details: error.message
    }, { status: 500 });
  }
}
