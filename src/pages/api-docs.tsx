import { Box, Container, Paper, Stack, Title, Text, Button, Group, ThemeIcon } from '@mantine/core';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { IconChevronLeft, IconTerminal } from '@tabler/icons-react';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import Swagger UI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  const router = useRouter();
  const { t } = useTranslation('settings');

  return (
    <>
      <Head>
        <title>{t('auth.docsTitle', 'Documentación de la API REST - Kaizen')}</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <Container size="xl" py="md">
        <Stack spacing="lg">
          {/* Premium Header */}
          <Paper
            p="xl"
            radius="md"
            sx={(theme) => ({
              background:
                theme.colorScheme === 'dark'
                  ? 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)'
                  : 'linear-gradient(135deg, rgba(238, 242, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)',
              border: `1px solid ${theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              backdropFilter: 'blur(8px)',
            })}
          >
            <Group position="apart" align="center">
              <Group spacing="md">
                <ThemeIcon size={44} radius="md" color="indigo" variant="light">
                  <IconTerminal size={24} />
                </ThemeIcon>
                <Box>
                  <Title order={2} sx={{ fontSize: 22, fontWeight: 800 }}>
                    {t('auth.docsHeader', 'Documentación de la API REST')}
                  </Title>
                  <Text size="xs" color="dimmed">
                    {t('auth.docsSubheader', 'Explora y prueba las rutas de la API REST de Kaizen en tiempo real')}
                  </Text>
                </Box>
              </Group>
              <Button
                variant="subtle"
                leftIcon={<IconChevronLeft size={16} />}
                onClick={() => router.push('/settings')}
                color="indigo"
              >
                {t('common.back', 'Volver')}
              </Button>
            </Group>
          </Paper>

          {/* Swagger UI container with custom light/dark styling overrides */}
          <Paper
            p="md"
            radius="md"
            shadow="md"
            sx={(theme) => ({
              backgroundColor: theme.colorScheme === 'dark' ? '#1e293b' : '#ffffff',
              border: `1px solid ${theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              overflow: 'hidden',

              // Override styles of Swagger UI dynamically
              '& .swagger-ui': {
                fontFamily: 'inherit',
                color: theme.colorScheme === 'dark' ? '#f1f5f9' : '#0f172a',

                '& .info': {
                  margin: '20px 0',
                  '& .title': {
                    color: theme.colorScheme === 'dark' ? '#ffffff' : '#0f172a',
                    fontFamily: 'inherit',
                    fontWeight: 800,
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
        </Stack>
      </Container>
    </>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'settings'])),
    },
  };
}
