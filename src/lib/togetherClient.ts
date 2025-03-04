// lib/togetherClient.ts
import Together from 'together-ai';

const TOGETHER_AI_API_KEY = process.env.TOGETHER_AI_API_KEY;
const together = new Together({ apiKey: TOGETHER_AI_API_KEY });

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateTasks(messages: Message[]) {
  try {
    const response = await together.chat.completions.create({
      messages,
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
      max_tokens: 300,
      temperature: 0.5,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ['<|eot_id|>', '<|eom_id|>'],
      stream: false
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No response from Together AI');
    }

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Together AI Error:', error);
    throw new Error('Failed to fetch tasks from Together AI');
  }
}
