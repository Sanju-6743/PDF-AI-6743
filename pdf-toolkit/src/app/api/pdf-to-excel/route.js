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

    // Use Gemini AI to extract tabular data
    const extractedData = await analyzePdfWithGemini(buffer, 'tables');

    // For now, return the extracted data as JSON
    // In a real implementation, you'd use a library like xlsx to create Excel files
    return NextResponse.json({
      success: true,
      data: extractedData,
      format: 'json', // Would be 'xlsx' in full implementation
      fileName: file.name.replace('.pdf', '.xlsx'),
      originalFileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('PDF to Excel conversion error:', error);
    return NextResponse.json({
      error: 'Failed to convert PDF to Excel',
      details: error.message
    }, { status: 500 });
  }
}
