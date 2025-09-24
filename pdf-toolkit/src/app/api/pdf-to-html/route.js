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

    // Use Gemini AI to convert to HTML structure
    const htmlContent = await analyzePdfWithGemini(buffer, 'structure');

    // Create basic HTML wrapper
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${file.name.replace('.pdf', '')}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1, h2, h3 { color: #333; margin-top: 30px; }
        p { margin-bottom: 15px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>${file.name.replace('.pdf', '')}</h1>
    ${htmlContent}
</body>
</html>`;

    return NextResponse.json({
      success: true,
      html: fullHtml,
      fileName: file.name.replace('.pdf', '.html'),
      originalFileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('PDF to HTML conversion error:', error);
    return NextResponse.json({
      error: 'Failed to convert PDF to HTML',
      details: error.message
    }, { status: 500 });
  }
}
