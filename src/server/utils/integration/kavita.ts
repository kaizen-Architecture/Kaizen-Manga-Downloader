import AdmZip from 'adm-zip';
import path from 'path';
import { prisma } from '../../db/client';
import { getCachedSettings } from '../settings-cache';
import { logger } from '../../../utils/logging';

interface Library {
  name: string;
  id: string;
}

interface Series {
  id: string;
  libraryId: string;
  name: string;
}

interface LoginResponse {
  token: string;
}

const getBaseUrl = (host: string) => {
  return host.toLowerCase().startsWith('http') ? host : `http://${host}`;
};

const getToken = async (baseKavitaUrl: string, username: string, password: string) => {
  const kavitaLoginUrl = new URL('/api/Account/login', baseKavitaUrl).href;
  const response: LoginResponse = await (
    await fetch(kavitaLoginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
  ).json();

  return response.token;
};

export const testConnection = async () => {
  const settings = await getCachedSettings();
  if (!settings.kavitaEnabled || !settings.kavitaHost || !settings.kavitaUser || !settings.kavitaPassword) {
    return { status: 'unhealthy', message: 'Kavita is not fully configured' };
  }

  try {
    const baseUrl = getBaseUrl(settings.kavitaHost);
    const token = await getToken(baseUrl, settings.kavitaUser, settings.kavitaPassword);
    if (!token) throw new Error('Could not get token');

    return { status: 'healthy', message: 'Connected to Kavita successfully' };
  } catch (err) {
    return { status: 'unhealthy', message: `${err}` };
  }
};

export const injectMetadata = async (chapterId: number) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { manga: { include: { metadata: true, library: true } } },
  });

  if (!chapter) return;

  const mangaPath = path.join(chapter.manga.library.path, chapter.manga.title);
  const filePath = path.join(mangaPath, chapter.fileName);

  logger.debug(`Kavita: Attempting to inject metadata into ${filePath}`);

  try {
    const zip = new AdmZip(filePath);
    const comicInfo = `<?xml version="1.0"?>
<ComicInfo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <Title>${chapter.fileName.replace('.cbz', '')}</Title>
  <Series>${chapter.manga.title}</Series>
  <Number>${chapter.index}</Number>
  <Summary>${chapter.manga.metadata.summary}</Summary>
  <Writer>${chapter.manga.metadata.authors.join(', ')}</Writer>
  <Genre>${chapter.manga.metadata.genres.join(', ')}</Genre>
  <Web>${chapter.manga.metadata.urls[0] || ''}</Web>
  <LanguageISO>${chapter.manga.metadata.summary.match(/[áéíóúñ]/i) ? 'es' : 'en'}</LanguageISO>
</ComicInfo>`;

    zip.addFile('ComicInfo.xml', Buffer.from(comicInfo, 'utf8'));
    zip.writeZip();

    await prisma.chapter.update({
      where: { id: chapterId },
      data: { metadataInjected: true },
    });

    logger.info(`Kavita: Successfully injected metadata into ${chapter.fileName}`);
  } catch (err) {
    logger.error(`Kavita: Failed to inject metadata into ${filePath}. Error: ${err}`);
  }
};

export const scanLibrary = async () => {
  const settings = await getCachedSettings();

  if (settings.kavitaEnabled && settings.kavitaHost && settings.kavitaUser && settings.kavitaPassword) {
    const baseKavitaUrl = getBaseUrl(settings.kavitaHost);

    const token = await getToken(baseKavitaUrl, settings.kavitaUser, settings.kavitaPassword);

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const kavitaLibrariesUrl = new URL('/api/Library', baseKavitaUrl).href;

    const libraries: Library[] = await (
      await fetch(kavitaLibrariesUrl, {
        headers,
      })
    ).json();

    const includedLibraries = settings.kavitaLibraries;

    await Promise.all(
      libraries
        .filter((library) => (includedLibraries.length > 0 ? includedLibraries.includes(library.name) : library.name))
        .map(async (library) => {
          const kavitaLibraryUrl = new URL(`/api/Library/scan?libraryId=${library.id}&force=false`, baseKavitaUrl).href;
          await fetch(kavitaLibraryUrl, {
            method: 'POST',
            headers,
          });
        }),
    );
  }
};

export const refreshMetadata = async (mangaName: string) => {
  const settings = await getCachedSettings();

  if (settings.kavitaEnabled && settings.kavitaHost && settings.kavitaUser && settings.kavitaPassword) {
    const baseKavitaUrl = getBaseUrl(settings.kavitaHost);

    const token = await getToken(baseKavitaUrl, settings.kavitaUser, settings.kavitaPassword);

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const kavitaSeriesUrl = new URL('/api/Series', baseKavitaUrl).href;

    const series: Series[] = await (
      await fetch(kavitaSeriesUrl, {
        method: 'POST',
        body: JSON.stringify({}),
        headers,
      })
    ).json();

    const content = series.find((c) => c.name === mangaName);

    if (!content) {
      return;
    }

    const kavitaSeriesRefreshUrl = new URL(`/api/Series/scan`, baseKavitaUrl).href;
    await fetch(kavitaSeriesRefreshUrl, {
      method: 'POST',
      body: JSON.stringify({
        libraryId: content.libraryId,
        seriesId: content.id,
        forceUpdate: true,
      }),
      headers,
    });
  }
};
