//api/generated-tasks/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const TOGETHER_AI_API_KEY = process.env.TOGETHER_AI_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { goals } = req.body;
    if (!goals || !Array.isArray(goals)) {
      return res.status(400).json({ error: 'Goals array is required' });
    }

    const tasks = await Promise.all(
      goals.map(async (goal: string) => {
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

        return {
          goal,
          tasks:
            response.data?.output
              ?.split('\n')
              .filter((t: string) => t.trim())
              .slice(0, 3)
              .map((t: string) => t.replace(/^\d+\.\s*/, '').trim()) || []
        };
      })
    );

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error generating tasks:', error);
    res.status(500).json({ error: 'Failed to generate tasks' });
  }
}
