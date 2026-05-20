import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import AdmZip from 'adm-zip';
import { sanitizer } from '../../../utils';
import { prisma } from '../../../server/db/client';

// Cache zip entries to prevent memory spikes
const zipCache: Record<string, { time: number; entries: any[] }> = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, chapterId } = req.query;
    const { favoritePages } = req.body;

    if (!id || !chapterId) return res.status(400).json({ error: 'Missing params' });

    const mangaId = parseInt(id as string, 10);
    const chId = parseInt(chapterId as string, 10);

    if (Number.isNaN(mangaId) || Number.isNaN(chId)) return res.status(400).json({ error: 'Invalid ID' });

    await prisma.chapter.update({
      where: { id: chId },
      data: { favoritePages },
    });

    return res.status(200).json({ success: true });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const sessionCookie = req.cookies['kaizen-session'];
  const settings = await prisma.settings.findFirst();
  const authEnabled = (settings?.appConfig as any)?.authEnabled === true;

  if (authEnabled) {
    if (!sessionCookie) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const userObj = JSON.parse(sessionCookie);
      const user = await prisma.user.findUnique({ where: { id: userObj.id } });
      if (!user || user.username !== userObj.username || user.password !== userObj.password) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    } catch (e) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const { id, chapterId, pageIndex } = req.query;

  if (!id || Array.isArray(id) || !chapterId || Array.isArray(chapterId)) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  const mangaId = parseInt(id, 10);
  const chId = parseInt(chapterId, 10);

  if (Number.isNaN(mangaId) || Number.isNaN(chId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const manga = await prisma.manga.findUnique({
      where: { id: mangaId },
      include: { library: true },
    });

    if (!manga) return res.status(404).json({ error: 'Manga not found' });

    const chapter = await prisma.chapter.findFirst({
      where: { id: chId, mangaId },
    });

    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    const mangaDir = path.resolve(manga.library.path, sanitizer(manga.title));
    const cbzPath = path.join(mangaDir, chapter.fileName);

    if (!fs.existsSync(cbzPath)) {
      return res.status(404).json({ error: 'CBZ file not found' });
    }

    const cacheKey = cbzPath;
    let entries: any[] = [];

    // Clean up old cache
    const now = Date.now();
    Object.keys(zipCache).forEach((key) => {
      if (now - zipCache[key].time > CACHE_TTL) {
        delete zipCache[key];
      }
    });

    if (zipCache[cacheKey]) {
      zipCache[cacheKey].time = now;
      entries = zipCache[cacheKey].entries;
    } else {
      const zip = new AdmZip(cbzPath);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];
      entries = zip
        .getEntries()
        .filter((entry) => {
          if (entry.isDirectory) return false;
          const entryPath = entry.entryName;
          if (path.basename(entryPath).startsWith('._')) return false;
          if (entryPath.includes('__MACOSX')) return false;

          const ext = path.extname(entryPath).toLowerCase();
          return imageExtensions.includes(ext);
        })
        .sort((a, b) => a.entryName.localeCompare(b.entryName, undefined, { numeric: true, sensitivity: 'base' }));

      zipCache[cacheKey] = { time: now, entries };
    }

    if (pageIndex !== undefined) {
      const pIdx = parseInt(Array.isArray(pageIndex) ? pageIndex[0] : pageIndex, 10);
      if (Number.isNaN(pIdx) || pIdx < 0 || pIdx >= entries.length) {
        return res.status(400).json({ error: 'Page index out of range' });
      }

      const entry = entries[pIdx];
      const data = entry.getData();
      const ext = path.extname(entry.entryName).toLowerCase();

      let contentType = 'image/jpeg';
      if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.bmp') contentType = 'image/bmp';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(data);
    }

    // Return JSON index
    const baseUrl = `/api/reader/pages`;
    const pages = entries.map((entry, idx) => ({
      index: idx,
      name: entry.entryName,
      url: `${baseUrl}?id=${mangaId}&chapterId=${chId}&pageIndex=${idx}`,
    }));

    if (!chapter.isRead) {
      await prisma.chapter.update({
        where: { id: chId },
        data: {
          isRead: true,
          lastReadAt: new Date(),
        },
      });
    }

    return res.status(200).json({
      chapterId: chId,
      totalPages: pages.length,
      pages,
    });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Reader API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
