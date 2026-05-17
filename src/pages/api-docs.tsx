import { AppShell, Container, Header, Title } from '@mantine/core';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import Swagger UI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  return (
    <>
      <Head>
        <title>Kaizen API Documentation</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <AppShell
        padding="md"
        header={
          <Header height={60} p="xs">
            <Container size="xl" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Title order={3}>Kaizen API Documentation</Title>
            </Container>
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            // Add custom styles for swagger UI if necessary, especially for dark mode
            '& .swagger-ui': {
              filter: theme.colorScheme === 'dark' ? 'invert(88%) hue-rotate(180deg)' : 'none',
            },
          },
        })}
      >
        <Container size="xl" style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px' }}>
          <SwaggerUI url="/swagger.json" />
        </Container>
      </AppShell>
    </>
  );
}
