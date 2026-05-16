import { Settings } from '@prisma/client';
import { prisma } from '../db/client';

let cachedSettings: Settings | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60000; // 60 seconds

export async function getCachedSettings(): Promise<Settings> {
  const now = Date.now();
  if (cachedSettings && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedSettings;
  }

  cachedSettings = await prisma.settings.findFirstOrThrow();
  lastFetchTime = now;
  return cachedSettings;
}

export function invalidateSettingsCache() {
  cachedSettings = null;
  lastFetchTime = 0;
}
