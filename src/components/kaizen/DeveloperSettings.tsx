import { Alert, Box, Group, SegmentedControl, Stack, Text, ThemeIcon, Title, Button, Collapse, Paper } from '@mantine/core';
import { IconAlertCircle, IconCode, IconExternalLink, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { trpc } from '../../utils/trpc';
import { useState } from 'react';
import { setCookie } from 'cookies-next';
import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export function DeveloperSettings() {
  const { t } = useTranslation('settings');
  const [showDocs, setShowDocs] = useState(false);

  const settings = trpc.settings.query.useQuery();
  const update = trpc.settings.update.useMutation({
    onSuccess: () => {
      settings.refetch().then(() => {
        window.location.reload();
      });
    },
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
        <Stack spacing="md" mt="sm">
          <Alert icon={<IconAlertCircle size={16} />} color="indigo" radius="md" variant="light">
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
                  color={showDocs ? 'red' : 'indigo'}
                  size="xs"
                  leftIcon={showDocs ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                  onClick={() => setShowDocs(!showDocs)}
                >
                  {showDocs ? t('common.close', 'Cerrar') : t('auth.docsButton', 'Ver Docs')}
                </Button>
              </Group>
            </Stack>
          </Alert>

          <Collapse in={showDocs}>
            <Paper
              p="md"
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
      )}
    </Stack>
  );
}
