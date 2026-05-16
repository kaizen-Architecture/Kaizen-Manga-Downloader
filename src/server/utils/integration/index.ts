import * as komga from './komga';
import * as kavita from './kavita';
import { prisma } from '../../db/client';
import { logger } from '../../../utils/logging';

export const scanLibrary = async () => {
  // 1. Process pending metadata injections first
  const pendingChapters = await prisma.chapter.findMany({
    where: { metadataInjected: false },
    select: { id: true },
  });

  if (pendingChapters.length > 0) {
    logger.info(`Integration: Processing ${pendingChapters.length} pending metadata injections...`);
    for (const chapter of pendingChapters) {
      try {
        await kavita.injectMetadata(chapter.id);
        // Add komga.injectMetadata here if needed in the future
      } catch (err) {
        logger.error(`Integration: Failed to process chapter ${chapter.id}: ${err}`);
      }
    }
  }

  // 2. Trigger library scans on external platforms
  await Promise.all([komga.scanLibrary(), kavita.scanLibrary()]);
};

export const refreshMetadata = async (mangaTitle: string) => {
  await Promise.all([komga.refreshMetadata(mangaTitle), kavita.refreshMetadata(mangaTitle)]);
};
