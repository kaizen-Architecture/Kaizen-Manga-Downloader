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

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const mangaId = parseInt(id, 10);
  if (isNaN(mangaId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const manga = await prisma.manga.findUnique({
      where: {
        id: mangaId,
      },
      include: {
        metadata: true,
        library: true,
        chapters: {
          orderBy: {
            index: 'desc',
          },
        },
      },
    });

    if (!manga) {
      return res.status(404).json({ error: 'Manga not found' });
    }

    return res.status(200).json(manga);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching manga:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
