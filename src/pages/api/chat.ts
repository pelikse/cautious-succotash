import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);

// Define type for incoming messages
type Role = 'user' | 'assistant' | 'system' | 'model';
type Message = {
  role: Role;
  content: string;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const messages: Message[] = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid or empty message array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Gemini expects role = 'user' or 'model'
    const filteredMessages = messages.filter(
      (msg) => msg.role === 'user' || msg.role === 'model'
    );

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const chat = model.startChat({
      history: filteredMessages.slice(0, -1).map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    const latest = filteredMessages[filteredMessages.length - 1];

    const result = await chat.sendMessage(latest.content);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ message: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
