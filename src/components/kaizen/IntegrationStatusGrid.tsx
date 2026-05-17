import { Grid, Title, Stack, Button } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { IntegrationHealthCard } from './IntegrationHealthCard';
import { trpc } from '../../utils/trpc';

export function IntegrationStatusGrid() {
  const { t } = useTranslation('settings');
  const utils = trpc.useContext();
  const settingsQuery = trpc.settings.query.useQuery();
  const mangaQuery = trpc.manga.query.useQuery();

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
                  color="indigo"
                  size="xs"
                  compact
                  onClick={() => window.open('/api-docs', '_blank')}
                >
                  {t('auth.docsButton', 'Ver Docs')}
                </Button>
              }
            />
          </Grid.Col>
        )}
      </Grid>
    </Stack>
  );
}
