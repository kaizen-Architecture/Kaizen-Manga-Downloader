import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../server/db/client';

export async function validateApiToken(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const authHeader = req.headers.authorization;
  const sessionCookie = req.cookies['kaizen-session'];

  const settings = await prisma.settings.findFirst();

  if (sessionCookie) {
    const authEnabled = (settings?.appConfig as any)?.authEnabled === true;
    if (!authEnabled) return true;

    try {
      const userObj = JSON.parse(sessionCookie);
      const user = await prisma.user.findUnique({ where: { id: userObj.id } });
      if (user && user.username === userObj.username && user.password === userObj.password) {
        return true;
      }
    } catch (e) {
      // Fallback to Bearer Token
    }
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return false;
  }

  const token = authHeader.substring(7);

  try {
    if (!settings || !settings.apiEnabled) {
      res.status(403).json({ error: 'Forbidden: API is disabled' });
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { apiToken: token },
    });

    if (user) {
      // Update last active time asynchronously
      prisma.user
        .update({
          where: { id: user.id },
          data: {
            lastActiveAt: new Date(),
            apiCallCount: {
              increment: 1,
            },
          },
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Failed to update user lastActiveAt:', err);
        });

      return true;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error validating API token:', e);
  }

  res.status(401).json({ error: 'Unauthorized: Invalid token' });
  return false;
}
