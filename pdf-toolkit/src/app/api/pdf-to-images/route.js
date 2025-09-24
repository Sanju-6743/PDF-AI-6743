import { NextRequest, NextResponse } from 'next/server';
import { extractImagesWithGemini } from '../../../../utils/aiUtils';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const format = formData.get('format') || 'png'; // png, jpg, jpeg

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use Gemini AI to extract images
    const extractedImages = await extractImagesWithGemini(buffer);

    // Process images (in a real implementation, you'd convert PDF pages to images)
    // For now, return the extracted images info
    const processedImages = extractedImages.map((img, index) => ({
      ...img,
      name: img.name || `page_${index + 1}.${format}`,
      format: format,
      index: index
    }));

    return NextResponse.json({
      success: true,
      images: processedImages,
      count: processedImages.length,
      format: format,
      originalFileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('PDF to Images conversion error:', error);
    return NextResponse.json({
      error: 'Failed to convert PDF to images',
      details: error.message
    }, { status: 500 });
  }
}
