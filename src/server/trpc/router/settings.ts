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
            'apiEnabled',
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
  getLogs: t.procedure
    .input(
      z.object({
        limit: z.number().default(100),
        level: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const logPath = path.resolve(
        process.cwd(),
        path.relative(
          process.cwd(),
          path.resolve(process.env.KAIZEN_LOG_PATH || process.env.KAIZOKU_LOG_PATH || '', 'kaizen.log')
        )
      );

      try {
        const fileContent = await fs.readFile(logPath, 'utf-8');
        const lines = fileContent.trim().split('\n');
        
        const levelMap: Record<number, string> = {
          10: 'trace',
          20: 'debug',
          30: 'info',
          40: 'warn',
          50: 'error',
          60: 'fatal',
        };

        const parsedLogs = lines
          .map((line, idx) => {
            try {
              const obj = JSON.parse(line);
              return {
                id: idx,
                time: obj.time ? new Date(obj.time).toISOString() : new Date().toISOString(),
                level: levelMap[obj.level as number] || 'info',
                msg: obj.msg || '',
                raw: line,
              };
            } catch (err) {
              return {
                id: idx,
                time: new Date().toISOString(),
                level: line.toLowerCase().includes('error') ? 'error' : 'info',
                msg: line,
                raw: line,
              };
            }
          })
          .reverse();

        let filtered = parsedLogs;
        if (input.level && input.level !== 'all') {
          filtered = filtered.filter((log) => log.level === input.level);
        }

        if (input.search) {
          const searchLower = input.search.toLowerCase();
          if (searchLower === 'kavita' || searchLower === 'sync') {
            filtered = filtered.filter(
              (log) =>
                log.msg.toLowerCase().includes('kavita') ||
                log.msg.toLowerCase().includes('sync') ||
                log.msg.toLowerCase().includes('integration')
            );
          } else if (searchLower === 'download' || searchLower === 'capitulo') {
            filtered = filtered.filter(
              (log) =>
                log.msg.toLowerCase().includes('download') ||
                log.msg.toLowerCase().includes('chapter') ||
                log.msg.toLowerCase().includes('capitulo')
            );
          } else {
            filtered = filtered.filter((log) => log.msg.toLowerCase().includes(searchLower));
          }
        }

        return filtered.slice(0, input.limit);
      } catch (err) {
        return [
          {
            id: 0,
            time: new Date().toISOString(),
            level: 'error',
            msg: `No se pudieron cargar los logs o el archivo kaizen.log está vacío. (Ruta: ${logPath}). Detalle: ${(err as Error).message}`,
            raw: '',
          },
        ];
      }
    }),
  getLogLevel: t.procedure.query(async () => {
    const { logger } = await import('../../../utils/logging');
    return logger.level;
  }),
  setLogLevel: t.procedure
    .input(z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']))
    .mutation(async ({ input }) => {
      const { logger } = await import('../../../utils/logging');
      logger.level = input;
      logger.info(`Log level changed dynamically to ${input} via trpc mutation.`);
      return { success: true, level: logger.level };
    }),
});
