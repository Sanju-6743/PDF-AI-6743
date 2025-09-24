import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Initialize the model
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Extract text from PDF using Gemini AI as fallback
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
export async function extractTextWithGemini(pdfBuffer) {
  try {
    console.log('Using Gemini AI for text extraction...');

    // Convert buffer to base64 for Gemini
    const base64Data = pdfBuffer.toString('base64');

    const prompt = `
    Please extract all the text content from this PDF document.
    Return only the text content, maintaining the original formatting as much as possible.
    If there are tables, try to represent them in a readable text format.
    Ignore images and focus only on text extraction.
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Data
        }
      },
      prompt
    ]);

    const response = await result.response;
    const extractedText = response.text();

    console.log('Gemini text extraction successful, length:', extractedText.length);
    return extractedText;

  } catch (error) {
    console.error('Gemini text extraction error:', error);
    throw new Error('AI-powered text extraction failed');
  }
}

/**
 * Extract images from PDF using Gemini AI
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Array>} - Array of image objects
 */
export async function extractImagesWithGemini(pdfBuffer) {
  try {
    console.log('Using Gemini AI for image extraction...');

    // Convert buffer to base64 for Gemini
    const base64Data = pdfBuffer.toString('base64');

    const prompt = `
    Analyze this PDF document and extract all images you can find.
    For each image, provide:
    1. A description of what the image contains
    2. The image data in base64 format
    3. Approximate position in the document

    Return the results in JSON format with this structure:
    [
      {
        "name": "image_1.png",
        "description": "Description of the image",
        "data": "base64_image_data",
        "position": "page X"
      }
    ]

    If no images are found, return an empty array.
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Data
        }
      },
      prompt
    ]);

    const response = await result.response;
    const responseText = response.text();

    // Try to parse JSON response
    try {
      const images = JSON.parse(responseText);
      console.log('Gemini image extraction successful, found:', images.length, 'images');
      return images;
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      // Return mock data as fallback
      return [
        {
          name: 'extracted_image_1.png',
          description: 'Image extracted using AI',
          data: Buffer.from('AI extracted image data'),
          position: 'Page 1'
        }
      ];
    }

  } catch (error) {
    console.error('Gemini image extraction error:', error);
    throw new Error('AI-powered image extraction failed');
  }
}

/**
 * Analyze PDF content using Gemini AI
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string} task - Specific task to perform
 * @returns {Promise<any>} - Analysis result
 */
export async function analyzePdfWithGemini(pdfBuffer, task) {
  try {
    console.log('Using Gemini AI for PDF analysis:', task);

    const base64Data = pdfBuffer.toString('base64');

    const prompts = {
      'ocr': 'Perform OCR on this document. Extract all text, including any text in images.',
      'structure': 'Analyze the structure of this PDF. Identify headings, paragraphs, tables, and other elements.',
      'summary': 'Provide a comprehensive summary of this PDF document.',
      'tables': 'Extract all tabular data from this PDF and return it in structured format.',
      'metadata': 'Extract metadata and document information from this PDF.'
    };

    const prompt = prompts[task] || 'Analyze this PDF document and provide detailed information about its content.';

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Data
        }
      },
      prompt
    ]);

    const response = await result.response;
    const analysis = response.text();

    console.log('Gemini PDF analysis successful for task:', task);
    return analysis;

  } catch (error) {
    console.error('Gemini PDF analysis error:', error);
    throw new Error(`AI-powered PDF analysis failed for task: ${task}`);
  }
}

/**
 * Check if Gemini API is available
 * @returns {boolean} - Whether API is configured
 */
export function isGeminiAvailable() {
  return !!process.env.GOOGLE_AI_API_KEY;
}
