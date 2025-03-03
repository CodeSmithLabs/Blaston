import { NextApiRequest, NextApiResponse } from 'next';
import { generateTasks } from '@/lib/togetherAI';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { goal } = req.body;
  if (!goal) {
    return res.status(400).json({ error: 'Goal is required' });
  }

  const tasks = await generateTasks(goal);
  if (!tasks) {
    return res.status(500).json({ error: 'Failed to generate tasks' });
  }

  res.status(200).json({ tasks });
}
