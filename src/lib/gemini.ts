import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateResponse(modelTag: string, prompt: string): Promise<string> {
  try {
    // Map model tags to actual Gemini models
    const modelMap: Record<string, string> = {
      'gemini-1.5-flash': 'gemini-1.5-flash',
      'gemini-1.5-pro': 'gemini-1.5-pro',
      'gpt-4o': 'gemini-1.5-flash', // fallback for fake model names
    };

    const actualModel = modelMap[modelTag] || 'gemini-1.5-flash';

    const model = genAI.getGenerativeModel({ model: actualModel });

    // ✅ NEW API structure (required for Gemini v1)
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    // ✅ Extract text response safely
    const text = result.response.text();
    return text;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw new Error(`Failed to generate response from Gemini: ${error.message}`);
  }
}
