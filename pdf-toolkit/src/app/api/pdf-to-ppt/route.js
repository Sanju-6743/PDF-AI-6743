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

    // Use Gemini AI to extract presentation content
    const presentationContent = await analyzePdfWithGemini(buffer, 'presentation');

    // For now, return structured data that could be used to create a PPT
    // In a real implementation, you'd use a library like pptxgenjs
    return NextResponse.json({
      success: true,
      presentationData: presentationContent,
      format: 'json', // Would be 'pptx' in full implementation
      fileName: file.name.replace('.pdf', '.pptx'),
      originalFileName: file.name,
      fileSize: file.size,
      slides: presentationContent.split('\n\n').length // Rough slide count
    });

  } catch (error) {
    console.error('PDF to PPT conversion error:', error);
    return NextResponse.json({
      error: 'Failed to convert PDF to PowerPoint',
      details: error.message
    }, { status: 500 });
  }
}
