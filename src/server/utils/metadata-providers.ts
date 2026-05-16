import { logger } from '../../utils/logging';
import { getCachedSettings } from './settings-cache';
import { fetchMetadataFromMangaDex, FallbackMetadata } from './metadata-fallback';
/* eslint-disable import/no-cycle */
import { mangalExec } from './mangal';

interface IOutput {
  result: any[];
}

// Convert FallbackMetadata to the Metadata structure expected by Prisma
const mapFallbackToMetadata = (fallback: FallbackMetadata): any => {
  return {
    cover: fallback.cover ? { extraLarge: fallback.cover, large: fallback.cover, medium: fallback.cover, color: '' } : undefined,
    summary: fallback.summary,
    genres: fallback.genres || [],
    tags: fallback.tags || [],
    urls: fallback.urls || [],
    staff: { story: fallback.authors || [], art: [], translation: [], lettering: [] },
    characters: [],
    status: fallback.status || '',
    startDate: { year: 0, month: 0, day: 0 },
    endDate: { year: 0, month: 0, day: 0 },
    synonyms: [],
    chapters: 0,
    bannerImage: '',
  };
};

const mergeMetadata = (base: any, overlay: any): any => {
  if (!base) return overlay;
  if (!overlay) return base;

  return {
    ...base,
    cover: overlay.cover?.extraLarge || overlay.cover?.large ? overlay.cover : base.cover,
    summary: overlay.summary || base.summary,
    genres: overlay.genres?.length ? overlay.genres : base.genres,
    tags: overlay.tags?.length ? overlay.tags : base.tags,
    urls: overlay.urls?.length ? [...(base.urls || []), ...overlay.urls] : base.urls,
    staff: overlay.staff?.story?.length ? overlay.staff : base.staff,
    status: overlay.status || base.status,
  };
};

const runAnilistMetadata = async (source: string, title: string): Promise<any | undefined> => {
  const args = [
    'inline',
    '--source',
    source,
    '--query',
    title,
    '--manga',
    'exact',
    '--include-anilist-manga',
    '-j',
  ];
  try {
    const { stdout } = await mangalExec(args);
    const output: IOutput = JSON.parse(stdout);
    if (output && output.result.length === 1) {
      return output.result[0].mangal?.metadata;
    }
  } catch (err: any) {
    logger.warn(`Anilist fetch failed for ${title}: ${err.message}`);
  }
  return undefined;
};

const runSourceMetadataOnly = async (source: string, title: string): Promise<any | undefined> => {
  const args = [
    'inline',
    '--source',
    source,
    '--query',
    title,
    '--manga',
    'exact',
    '-j',
  ];
  try {
    const { stdout } = await mangalExec(args);
    const output: IOutput = JSON.parse(stdout);
    if (output && output.result.length === 1) {
      return output.result[0].mangal?.metadata;
    }
  } catch (err: any) {
    logger.warn(`Source fetch failed for ${title}: ${err.message}`);
  }
  return undefined;
};

export const getMangaMetadataModular = async (source: string, title: string): Promise<any | undefined> => {
  const settings = await getCachedSettings();
  const providers = settings.metadataProviders || ['anilist', 'mangadex'];

  logger.info(`Running metadata providers for "${title}" in order: ${providers.join(' -> ')}`);

  let currentMetadata: any = undefined;

  // We always want to get the base metadata from the source itself first
  // if Anilist is not the first provider, or if we just need base info.
  // Actually, Mangal's `inline` returns metadata from the source natively if `--include-anilist-manga` is omitted.
  let sourceMetadata = await runSourceMetadataOnly(source, title);
  currentMetadata = sourceMetadata;

  for (const provider of providers) {
    // If we already have cover and summary, we can stop early
    if (currentMetadata?.cover?.extraLarge && currentMetadata?.summary) {
      logger.info(`Metadata fully resolved for "${title}" before hitting ${provider}`);
      break;
    }

    if (provider === 'anilist') {
      logger.info(`Trying Anilist provider for "${title}"`);
      const anilistData = await runAnilistMetadata(source, title);
      currentMetadata = mergeMetadata(currentMetadata, anilistData);
    } else if (provider === 'mangadex') {
      logger.info(`Trying MangaDex provider for "${title}"`);
      const mdData = await fetchMetadataFromMangaDex(title);
      if (mdData) {
        currentMetadata = mergeMetadata(currentMetadata, mapFallbackToMetadata(mdData));
      }
    }
  }

  return currentMetadata;
};

export const applyModularFallbackToDetail = async (source: string, title: string, detail: any): Promise<any> => {
  if (!detail) return detail;

  const settings = await getCachedSettings();
  const providers = settings.metadataProviders || ['anilist', 'mangadex'];

  let currentMetadata = detail.metadata;

  for (const provider of providers) {
    if (currentMetadata?.cover?.extraLarge && currentMetadata?.summary) break;

    if (provider === 'mangadex') {
      const fallback = await fetchMetadataFromMangaDex(title);
      if (fallback) {
        currentMetadata = mergeMetadata(currentMetadata, mapFallbackToMetadata(fallback));
      }
    }
    // Note: anilist is usually already applied in getMangaDetail via inline flag,
    // but if we decouple it entirely we can run anilist manually here.
  }

  return {
    ...detail,
    metadata: currentMetadata,
  };
};
