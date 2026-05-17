import { Alert, Box, Group, SegmentedControl, Stack, Text, ThemeIcon, Title, Button } from '@mantine/core';
import { IconAlertCircle, IconCode, IconExternalLink } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { trpc } from '../../utils/trpc';

export function DeveloperSettings() {
  const { t } = useTranslation('settings');

  const settings = trpc.settings.query.useQuery();
  const update = trpc.settings.update.useMutation({
    onSuccess: () => settings.refetch(),
  });

  const apiEnabledValue = (settings.data?.appConfig as any)?.apiEnabled === true ? 'yes' : 'no';

  const handleApiToggle = (val: string) => {
    update.mutate({ updateType: 'app', key: 'apiEnabled' as any, value: val === 'yes' });
  };

  if (settings.isLoading || !settings.data) return null;

  return (
    <Stack spacing="md" mt="xs">
      <Group spacing="sm">
        <ThemeIcon size={36} radius="md" color="indigo" variant="light">
          <IconCode size={20} />
        </ThemeIcon>
        <Box>
          <Title order={5}>{t('auth.developerTitle', 'Opciones de la API de Desarrollo')}</Title>
          <Text size="xs" color="dimmed">
            {t(
              'auth.developerDesc',
              'Habilita el acceso externo a los metadatos de tu biblioteca mediante una REST API segura para clientes de terceros y scripts personalizados.',
            )}
          </Text>
        </Box>
      </Group>

      <Stack spacing="xs">
        <Text size="xs" weight={500} color="dimmed">
          {t('auth.apiEnabledLabel', 'REST API Externa')}
        </Text>
        <SegmentedControl
          fullWidth
          value={apiEnabledValue}
          onChange={handleApiToggle}
          disabled={update.isLoading}
          data={[
            { value: 'yes', label: t('auth.apiEnabled', 'Activada') },
            { value: 'no', label: t('auth.apiDisabled', 'Desactivada') },
          ]}
        />
      </Stack>

      {apiEnabledValue === 'yes' && (
        <Alert icon={<IconAlertCircle size={16} />} color="indigo" radius="md" variant="light" mt="sm">
          <Stack spacing="xs">
            <Box>
              <Text size="sm" weight={600} mb={4}>
                {t('auth.docsTitle', 'Documentación Interactiva de la API')}
              </Text>
              <Text size="xs">
                {t('auth.docsDesc', 'Explora y prueba las rutas REST disponibles en vivo usando nuestra interfaz de Swagger.')}
              </Text>
            </Box>
            <Group position="left">
              <Button
                variant="light"
                color="indigo"
                size="xs"
                leftIcon={<IconExternalLink size={14} />}
                onClick={() => window.open('/api-docs', '_blank')}
              >
                {t('auth.docsButton', 'Ver Docs')}
              </Button>
            </Group>
          </Stack>
        </Alert>
      )}
    </Stack>
  );
}
