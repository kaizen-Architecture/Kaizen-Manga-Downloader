import { logger } from '../../utils/logging';

export async function fetchLightweightStatusAnilist(title: string): Promise<string | null> {
  try {
    const query = `
      query ($search: String) {
        Media (search: $search, type: MANGA) {
          status
        }
      }
    `;

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query, variables: { search: title } }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as any;
    const status = json?.data?.Media?.status;
    return status ? status.toUpperCase() : null;
  } catch (err) {
    logger.debug(`[Status Audit] AniList fetch failed for "${title}": ${err}`);
    return null;
  }
}

export async function fetchLightweightStatusMangaDex(title: string): Promise<string | null> {
  try {
    const searchUrl = new URL('https://api.mangadex.org/manga');
    searchUrl.searchParams.set('title', title);
    searchUrl.searchParams.set('limit', '1');

    const response = await fetch(searchUrl.toString(), {
      headers: { 'User-Agent': 'Kaizen-Manga-Downloader/2.2' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as any;
    if (!data?.data || data.data.length === 0) {
      return null;
    }

    const statusMap: Record<string, string> = {
      ongoing: 'RELEASING',
      completed: 'FINISHED',
      hiatus: 'HIATUS',
      cancelled: 'CANCELLED',
    };

    const rawStatus = data.data[0]?.attributes?.status;
    return rawStatus ? statusMap[rawStatus] || rawStatus.toUpperCase() : null;
  } catch (err) {
    logger.debug(`[Status Audit] MangaDex fetch failed for "${title}": ${err}`);
    return null;
  }
}

export async function checkMangaStatusLightweight(title: string, providers: string[]): Promise<string | null> {
  for (const provider of providers) {
    if (provider === 'anilist') {
      const status = await fetchLightweightStatusAnilist(title);
      if (status) return status;
    } else if (provider === 'mangadex') {
      const status = await fetchLightweightStatusMangaDex(title);
      if (status) return status;
    }
  }
  return null;
}
