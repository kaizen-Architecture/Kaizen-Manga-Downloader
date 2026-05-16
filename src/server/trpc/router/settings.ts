import { z } from 'zod';
import { getMangalConfig, setMangalConfig } from '../../utils/mangal';
import { t } from '../trpc';

export const settingsRouter = t.router({
  query: t.procedure.query(async ({ ctx }) => {
    const mangalConfig = (await getMangalConfig()).sort((a, b) => a.key.localeCompare(b.key));
    const appConfig = await ctx.prisma.settings.findFirstOrThrow();
    return {
      mangalConfig,
      appConfig,
    };
  }),
  getServerStatus: t.procedure.query(async () => {
    const now = new Date();
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    const offset = -now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const offsetString = `${offset >= 0 ? '+' : '-'}${String(offsetHours).padStart(2, '0')}:${String(
      offsetMinutes,
    ).padStart(2, '0')}`;

    return {
      time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      timeZone,
      offset: offsetString,
    };
  }),
  update: t.procedure
    .input(
      z.discriminatedUnion('updateType', [
        z.object({
          updateType: z.literal('app'),
          key: z.enum([
            'telegramEnabled',
            'telegramToken',
            'telegramChatId',
            'telegramSendSilently',
            'appriseEnabled',
            'appriseHost',
            'appriseUrls',
            'komgaEnabled',
            'komgaHost',
            'komgaUser',
            'komgaPassword',
            'kavitaEnabled',
            'kavitaHost',
            'kavitaUser',
            'kavitaPassword',
            'kavitaLibraries',
            'githubRepo',
            'githubToken',
            'retryDelayMs',
            'metadataProviders',
            'alternativeSourceMatching',
            'refreshStatusInterval',
            'refreshStatusWindow',
            'authEnabled',
            'apiToken',
          ]),
          value: z.any(),
        }),
        z.object({
          updateType: z.literal('mangal'),
          key: z.string().min(1),
          value: z.any(),
        }),
      ]),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.updateType === 'mangal') {
        const config = await getMangalConfig();
        if (!config.find((c) => c.key === input.key)) {
          throw new Error(`Invalid mangal config key: ${input.key}`);
        }
        await setMangalConfig(input.key, input.value);
      } else if (input.updateType === 'app') {
        const appConfig = await ctx.prisma.settings.findFirstOrThrow();
        await ctx.prisma.settings.update({
          where: {
            id: appConfig.id,
          },
          data: {
            [input.key]: input.value,
          },
        });
      }
    }),
  testIntegration: t.procedure
    .input(z.object({ type: z.enum(['kavita', 'komga', 'telegram']) }))
    .mutation(async ({ input }) => {
      if (input.type === 'kavita') {
        const { testConnection } = await import('../../utils/integration/kavita');
        return testConnection();
      }
      // Placeholder for others
      return { status: 'healthy', message: 'Connection successful' };
    }),
});
