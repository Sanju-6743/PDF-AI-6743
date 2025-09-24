import { NextRequest, NextResponse } from 'next/server';
import { analyzePdfWithGemini } from '../../../../utils/aiUtils';

export async function POST(request) {
  try {
    const { file, question, chatHistory = [] } = await request.json();

    if (!file || !question) {
      return NextResponse.json({ error: 'File and question are required' }, { status: 400 });
    }

    // Convert base64 file to buffer
    const buffer = Buffer.from(file, 'base64');

    // Create chat prompt with context
    const historyContext = chatHistory.length > 0
      ? `\n\nPrevious conversation:\n${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
      : '';

    const prompt = `You are a helpful AI assistant that can answer questions about PDF documents.

Based on the content of this PDF document, please answer the following question: "${question}"

${historyContext}

Please provide a clear, accurate, and helpful answer based only on the information contained in the PDF. If the question cannot be answered from the PDF content, please say so clearly.

Answer:`;

    // Use Gemini AI for chat
    const answer = await analyzePdfWithGemini(buffer, 'chat');

    return NextResponse.json({
      success: true,
      answer: answer,
      question: question,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat with PDF error:', error);
    return NextResponse.json({
      error: 'Failed to chat with PDF',
      details: error.message
    }, { status: 500 });
  }
}
