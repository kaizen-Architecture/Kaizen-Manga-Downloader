import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../server/db/client';
import { validateApiToken } from '../../../../utils/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const isValid = await validateApiToken(req, res);
  if (!isValid) return;

  try {
    const mangas = await prisma.manga.findMany({
      include: {
        metadata: true,
        library: true,
      },
    });

    return res.status(200).json(mangas);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching mangas:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
