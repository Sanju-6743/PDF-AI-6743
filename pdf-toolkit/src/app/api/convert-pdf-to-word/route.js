import { NextResponse } from 'next/server';
import { extractTextWithGemini, isGeminiAvailable } from '../../../../utils/aiUtils';

export async function POST(request) {
  try {
    console.log('Starting PDF to Word conversion...');

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('File received:', file.name, 'Size:', file.size);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('File converted to buffer, size:', buffer.length);

    let extractedText = '';
    let extractionMethod = 'pdf-parse';

    // Try primary method first (pdf-parse)
    try {
      console.log('Extracting text from PDF using pdf-parse...');
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(buffer);
      extractedText = data.text || '';
      console.log('pdf-parse text extracted, length:', extractedText.length);

      // If pdf-parse extracted very little text, try Gemini as fallback
      if (extractedText.trim().length < 100 && isGeminiAvailable()) {
        console.log('pdf-parse extracted minimal text, trying Gemini fallback...');
        try {
          const geminiText = await extractTextWithGemini(buffer);
          if (geminiText && geminiText.trim().length > extractedText.trim().length) {
            extractedText = geminiText;
            extractionMethod = 'gemini-ai';
            console.log('Gemini fallback successful, new text length:', extractedText.length);
          }
        } catch (geminiError) {
          console.log('Gemini fallback failed, using pdf-parse result:', geminiError.message);
        }
      }
    } catch (pdfParseError) {
      console.error('pdf-parse failed:', pdfParseError.message);

      // If pdf-parse fails completely, try Gemini as fallback
      if (isGeminiAvailable()) {
        console.log('pdf-parse failed, trying Gemini as primary method...');
        try {
          extractedText = await extractTextWithGemini(buffer);
          extractionMethod = 'gemini-ai';
          console.log('Gemini primary extraction successful, text length:', extractedText.length);
        } catch (geminiError) {
          console.error('Both pdf-parse and Gemini failed:', geminiError.message);
          extractedText = "Text extraction failed. The PDF may be corrupted, password-protected, or contain only images without selectable text.";
        }
      } else {
        console.error('pdf-parse failed and Gemini not available');
        extractedText = "Text extraction failed. The PDF may be corrupted, password-protected, or contain only images without selectable text.";
      }
    }

    // Create text document
    console.log('Creating text document using method:', extractionMethod);
    const textContent = `PDF to Word Conversion

Converted from: ${file.name}
Extraction method: ${extractionMethod}

${extractedText || "No text could be extracted from the PDF."}`;

    const wordBuffer = Buffer.from(textContent, 'utf-8');
    console.log('Text document created, size:', wordBuffer.length);

    // Return the text document
    return new NextResponse(wordBuffer, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', '')}.txt"`,
      },
    });

  } catch (error) {
    console.error('PDF to Word conversion error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json({
      error: 'Failed to convert PDF to Word',
      details: error.message
    }, { status: 500 });
  }
}
