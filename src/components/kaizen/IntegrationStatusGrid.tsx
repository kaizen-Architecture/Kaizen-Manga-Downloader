import { Grid, Title, Stack, Button, Collapse, Paper } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { IntegrationHealthCard } from './IntegrationHealthCard';
import { trpc } from '../../utils/trpc';
import { useState } from 'react';
import { ApiExplorer } from './ApiExplorer';

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

  // Optimized sync check using the non-injected query constraint
  const syncedMangas = mangas.filter(
    (m) => m._count && m._count.chapters > 0 && m.chapters && m.chapters.length === 0,
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
          withBorder
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? '#1e293b' : '#ffffff',
            borderColor: theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          })}
        >
          <ApiExplorer />
        </Paper>
      </Collapse>
    </Stack>
  );
}
