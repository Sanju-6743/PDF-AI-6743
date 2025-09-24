import { NextRequest, NextResponse } from 'next/server';
import { analyzePdfWithGemini } from '../../../../utils/aiUtils';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const targetLanguage = formData.get('targetLanguage') || 'es'; // Default to Spanish
    const sourceLanguage = formData.get('sourceLanguage') || 'auto'; // Auto-detect

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Language mapping
    const languages = {
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi'
    };

    const targetLangName = languages[targetLanguage] || 'Spanish';

    // Create translation prompt
    const prompt = `Translate the entire content of this PDF document to ${targetLangName}.
    Maintain the original structure, formatting, and meaning as much as possible.
    If the source language is not English, first identify the source language, then translate to ${targetLangName}.
    Return only the translated content.`;

    // Use Gemini AI for translation
    const translatedContent = await analyzePdfWithGemini(buffer, 'translate');

    return NextResponse.json({
      success: true,
      translatedContent: translatedContent,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      targetLanguageName: targetLangName,
      fileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('AI translation error:', error);
    return NextResponse.json({
      error: 'Failed to translate PDF',
      details: error.message
    }, { status: 500 });
  }
}
