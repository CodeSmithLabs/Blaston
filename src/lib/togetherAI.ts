// lib/togetherAI.ts
import axios from 'axios';

const TOGETHER_AI_API_KEY = process.env.TOGETHER_AI_API_KEY;

export const generateTasks = async (goal: string) => {
  try {
    const response = await axios.post(
      'https://api.together.ai/generate',
      {
        model: 'mistral-7b-instruct',
        prompt: `Given the goal: "${goal}", generate three structured daily tasks to achieve it.`,
        max_tokens: 100
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_AI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error generating tasks:', error);
    return null;
  }
};
