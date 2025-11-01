import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateResponse(modelTag: string, prompt: string): Promise<string> {
  try {
    // ✅ Only support Gemini 2.5 Flash
    if (modelTag !== 'gemini-2.5-flash') {
      throw new Error(`Unsupported model: ${modelTag}`);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = result.response.text();
    return text;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw new Error(`Failed to generate response from Gemini: ${error.message}`);
  }
}