import { NextRequest, NextResponse } from 'next/server';
import { analyzePdfWithGemini } from '../../../../utils/aiUtils';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const keywords = formData.get('keywords');
    const searchType = formData.get('searchType') || 'exact'; // exact, fuzzy, semantic

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!keywords) {
      return NextResponse.json({ error: 'Keywords are required' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create search prompt based on type
    const searchPrompts = {
      exact: `Search for the exact keywords "${keywords}" in this PDF document. Find all occurrences and provide:
1. The exact text matches found
2. Page numbers or sections where they appear
3. Context around each match (2-3 sentences)
4. Frequency of each keyword`,

      fuzzy: `Perform a fuzzy search for keywords similar to "${keywords}" in this PDF document. Find:
1. Exact matches
2. Similar terms and variations
3. Related concepts
4. Context and locations for each finding`,

      semantic: `Perform semantic search for content related to "${keywords}" in this PDF document. Find:
1. Direct mentions of the topic
2. Related concepts and ideas
3. Contextual information
4. Relevant sections and their summaries`
    };

    const prompt = searchPrompts[searchType] || searchPrompts.exact;

    // Use Gemini AI for keyword search
    const searchResults = await analyzePdfWithGemini(buffer, 'search');

    return NextResponse.json({
      success: true,
      results: searchResults,
      keywords: keywords,
      searchType: searchType,
      fileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('Keyword search error:', error);
    return NextResponse.json({
      error: 'Failed to search PDF',
      details: error.message
    }, { status: 500 });
  }
}
