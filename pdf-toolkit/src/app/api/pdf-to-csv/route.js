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

    // Use Gemini AI to extract tabular data for CSV
    const csvData = await analyzePdfWithGemini(buffer, 'csv');

    // For now, return the extracted data as JSON
    // In a real implementation, you'd use a library like csv-writer
    return NextResponse.json({
      success: true,
      csvData: csvData,
      format: 'json', // Would be 'csv' in full implementation
      fileName: file.name.replace('.pdf', '.csv'),
      originalFileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('PDF to CSV conversion error:', error);
    return NextResponse.json({
      error: 'Failed to convert PDF to CSV',
      details: error.message
    }, { status: 500 });
  }
}
