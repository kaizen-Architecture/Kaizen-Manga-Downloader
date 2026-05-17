import { Grid, Title, Stack, Button, Collapse, Paper } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { IntegrationHealthCard } from './IntegrationHealthCard';
import { trpc } from '../../utils/trpc';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export function IntegrationStatusGrid() {
  const { t } = useTranslation('settings');
  const utils = trpc.useContext();
  const settingsQuery = trpc.settings.query.useQuery();
  const mangaQuery = trpc.manga.query.useQuery();
  const [showDocs, setShowDocs] = useState(false);

  const scanMutation = trpc.manga.scanLibrary.useMutation({
    onSuccess: () => {
      utils.manga.query.invalidate();
    },
  });

  if (!settingsQuery.data) return null;

  const { appConfig } = settingsQuery.data;
  const mangas = mangaQuery.data || [];
  const totalMangas = mangas.length;

  const syncedMangas = mangas.filter(
    (m) => m.chapters && m.chapters.length > 0 && m.chapters.every((c: any) => c.metadataInjected),
  ).length;

  return (
    <Stack mb="xl">
      <Title order={4}>Integrations Status</Title>
      <Grid>
        {appConfig.kavitaEnabled && (
          <Grid.Col md={4}>
            <IntegrationHealthCard
              name="Kavita"
              status="healthy"
              syncedCount={syncedMangas}
              totalCount={totalMangas}
              onSync={() => scanMutation.mutate()}
            />
          </Grid.Col>
        )}

        {appConfig.komgaEnabled && (
          <Grid.Col md={4}>
            <IntegrationHealthCard
              name="Komga"
              status="healthy"
              syncedCount={0}
              totalCount={totalMangas}
              onSync={() => scanMutation.mutate()}
            />
          </Grid.Col>
        )}

        {appConfig.telegramEnabled && (
          <Grid.Col md={4}>
            <IntegrationHealthCard
              name="Telegram Bot"
              status="healthy"
              syncedCount={totalMangas}
              totalCount={totalMangas}
            />
          </Grid.Col>
        )}

        {appConfig.apiEnabled && (
          <Grid.Col md={4}>
            <IntegrationHealthCard
              name="REST API"
              status="healthy"
              syncedCount={totalMangas}
              totalCount={totalMangas}
              action={
                <Button
                  variant="light"
                  color={showDocs ? 'red' : 'indigo'}
                  size="xs"
                  compact
                  onClick={() => setShowDocs(!showDocs)}
                >
                  {showDocs ? t('common.close', 'Cerrar') : t('auth.docsButton', 'Ver Docs')}
                </Button>
              }
            />
          </Grid.Col>
        )}
      </Grid>

      <Collapse in={showDocs}>
        <Paper
          p="md"
          mt="md"
          radius="md"
          shadow="md"
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? '#1e293b' : '#ffffff',
            border: `1px solid ${theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            overflow: 'hidden',

            '& .swagger-ui': {
              fontFamily: 'inherit',
              color: theme.colorScheme === 'dark' ? '#f1f5f9' : '#0f172a',

              '& .info': {
                margin: '10px 0',
                '& .title': {
                  color: theme.colorScheme === 'dark' ? '#ffffff' : '#0f172a',
                  fontFamily: 'inherit',
                  fontWeight: 800,
                  fontSize: '20px',
                },
                '& p, & li, & a, & td': {
                  color: theme.colorScheme === 'dark' ? '#94a3b8' : '#475569',
                },
              },

              '& .scheme-container': {
                backgroundColor: theme.colorScheme === 'dark' ? '#0f172a' : '#f8fafc',
                border: `1px solid ${theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                borderRadius: theme.radius.md,
                boxShadow: 'none',
                padding: '16px',
                '& select': {
                  backgroundColor: theme.colorScheme === 'dark' ? '#1e293b' : '#ffffff',
                  color: theme.colorScheme === 'dark' ? '#f1f5f9' : '#0f172a',
                  border: `1px solid ${theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: theme.radius.sm,
                },
              },

              '& .opblock': {
                backgroundColor: theme.colorScheme === 'dark' ? '#0f172a' : '#f8fafc',
                borderRadius: theme.radius.md,
                border: `1px solid ${theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                '& .opblock-summary': {
                  borderBottom: `1px solid ${theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                },
                '& .opblock-summary-path': {
                  color: theme.colorScheme === 'dark' ? '#f1f5f9' : '#0f172a',
                  fontWeight: 600,
                },
                '& .opblock-summary-description': {
                  color: theme.colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                },
              },

              '& input[type=text], & textarea, & select': {
                backgroundColor: theme.colorScheme === 'dark' ? '#0f172a' : '#ffffff',
                color: theme.colorScheme === 'dark' ? '#f1f5f9' : '#0f172a',
                border: `1px solid ${theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: theme.radius.sm,
                padding: '8px 12px',
              },

              '& .btn': {
                backgroundColor: theme.colorScheme === 'dark' ? '#1e293b' : '#ffffff',
                color: theme.colorScheme === 'dark' ? '#f1f5f9' : '#0f172a',
                border: `1px solid ${theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: theme.radius.sm,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: theme.colorScheme === 'dark' ? '#334155' : '#f1f5f9',
                },
                '&.execute': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                  color: '#ffffff',
                  border: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  },
                },
              },

              '& table thead tr td, & table thead tr th': {
                color: theme.colorScheme === 'dark' ? '#f1f5f9' : '#0f172a',
                borderBottom: `2px solid ${theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              },
              '& .response-col_status': {
                color: theme.colorScheme === 'dark' ? '#f1f5f9' : '#0f172a',
                fontWeight: 700,
              },
              '& .parameter__name': {
                color: theme.colorScheme === 'dark' ? '#f1f5f9' : '#0f172a',
                fontWeight: 600,
              },
              '& .parameter__type, & .parameter__in': {
                color: theme.colorScheme === 'dark' ? '#94a3b8' : '#64748b',
              },
              '& .model-box-control:focus, & .servers-control:focus': {
                outline: 'none',
              },
              '& .opblock-bodypre': {
                backgroundColor: theme.colorScheme === 'dark' ? '#020617' : '#0f172a',
                color: '#38bdf8',
                borderRadius: theme.radius.sm,
              },
            },
          })}
        >
          <SwaggerUI url="/swagger.json" />
        </Paper>
      </Collapse>
    </Stack>
  );
}
