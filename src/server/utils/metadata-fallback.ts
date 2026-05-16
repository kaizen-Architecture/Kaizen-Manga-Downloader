import { logger } from '../../utils/logging';

export interface FallbackMetadata {
  cover?: string;
  summary?: string;
  authors?: string[];
  genres?: string[];
  status?: string;
  tags?: string[];
  urls?: string[];
}

export async function fetchMetadataFromMangaDex(title: string): Promise<FallbackMetadata | null> {
  try {
    logger.info(`[MangaDex Fallback] Searching metadata for: "${title}"`);

    const searchUrl = new URL('https://api.mangadex.org/manga');
    searchUrl.searchParams.set('title', title);
    searchUrl.searchParams.set('limit', '5');
    searchUrl.searchParams.append('includes[]', 'cover_art');
    searchUrl.searchParams.append('includes[]', 'author');
    searchUrl.searchParams.append('includes[]', 'artist');
    searchUrl.searchParams.append('contentRating[]', 'safe');
    searchUrl.searchParams.append('contentRating[]', 'suggestive');
    searchUrl.searchParams.append('contentRating[]', 'erotica');

    const response = await fetch(searchUrl.toString(), {
      headers: { 'User-Agent': 'Kaizen-Manga-Downloader/2.2' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      logger.warn(`[MangaDex Fallback] API returned ${response.status} for "${title}"`);
      return null;
    }

    const data = (await response.json()) as any;
    if (!data.data || data.data.length === 0) {
      logger.warn(`[MangaDex Fallback] No results for "${title}"`);
      return null;
    }

    // Try exact match first, otherwise use first result
    const normalize = (s: string) => s.toLowerCase().trim();
    const exactMatch = data.data.find((m: any) => {
      const allTitles = [
        ...Object.values(m.attributes.title || {}),
        ...(m.attributes.altTitles || []).flatMap((t: any) => Object.values(t)),
      ];
      return allTitles.some((t: any) => normalize(t) === normalize(title));
    });

    const manga = exactMatch || data.data[0];
    const attrs = manga.attributes;

    // Cover
    const coverRel = manga.relationships?.find((r: any) => r.type === 'cover_art');
    const cover = coverRel?.attributes?.fileName
      ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.512.jpg`
      : undefined;

    // Summary (prefer English)
    const summary =
      attrs.description?.en ||
      (Object.values(attrs.description || {}).find((v) => v) as string | undefined);

    // Authors
    const authors = (manga.relationships || [])
      .filter((r: any) => r.type === 'author' || r.type === 'artist')
      .map((r: any) => r.attributes?.name)
      .filter(Boolean);

    // Tags & Genres
    const tags = (attrs.tags || []).map((t: any) => t.attributes?.name?.en).filter(Boolean);
    const genres = (attrs.tags || [])
      .filter((t: any) => t.attributes?.group === 'genre')
      .map((t: any) => t.attributes?.name?.en)
      .filter(Boolean);

    // Status
    const statusMap: Record<string, string> = {
      ongoing: 'RELEASING',
      completed: 'FINISHED',
      hiatus: 'HIATUS',
      cancelled: 'CANCELLED',
    };
    const status = statusMap[attrs.status] || attrs.status?.toUpperCase();

    const urls = [`https://mangadex.org/title/${manga.id}`];

    logger.info(`[MangaDex Fallback] Found: cover=${!!cover}, summary=${!!summary}, authors=${authors.length}`);
    return { cover, summary, authors, genres, status, tags, urls };
  } catch (err) {
    logger.error(`[MangaDex Fallback] Error for "${title}": ${err}`);
    return null;
  }
}
