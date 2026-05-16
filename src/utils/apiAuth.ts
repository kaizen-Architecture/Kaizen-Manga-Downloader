import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../server/db/client';

export async function validateApiToken(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return false;
  }

  const token = authHeader.substring(7);

  // Check against environment variable first
  const envToken = process.env.KAIZEN_API_TOKEN;
  if (envToken && token === envToken) {
    return true;
  }

  // Fallback to checking against database settings
  try {
    const settings = await prisma.settings.findFirst();
    if (settings && settings.apiToken && token === settings.apiToken) {
      return true;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error fetching settings for API auth:', e);
  }

  res.status(401).json({ error: 'Unauthorized: Invalid token' });
  return false;
}
