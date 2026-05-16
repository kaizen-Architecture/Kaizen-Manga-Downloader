import { Container, Grid, Text, Title, Stack, ScrollArea } from '@mantine/core';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { trpc } from '../utils/trpc';
import { FailedJobsModal } from '../components/kaizen/FailedJobsModal';
import { SourceFailureChart } from '../components/kaizen/SourceFailureChart';
import { DownloadQueueModal } from '../components/kaizen/DownloadQueueModal';
import { DashboardStats } from '../components/kaizen/DashboardStats';
import { DownloadsChart } from '../components/kaizen/DownloadsChart';
import { RecentActivityFeed } from '../components/kaizen/RecentActivityFeed';
import { SourceStatsChart } from '../components/kaizen/SourceStatsChart';

// ─── Main Page ─────────────────────────────────────────────
export default function DashboardPage() {
  const { t } = useTranslation('common');
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);

  const activityQuery = trpc.manga.activity.useQuery(undefined, {
    refetchInterval: 5 * 1000,
  });
  const historyQuery = trpc.manga.history.useQuery(undefined, {
    refetchInterval: 10 * 1000,
  });
  const activityHistoryQuery = trpc.manga.activityHistory.useQuery();

  const activity = activityQuery.data;

  return (
    <ScrollArea sx={{ height: 'calc(100vh - 88px)' }}>
      <Container fluid px="md" py="md">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Title order={2} mb={4}>
            {t('dashboard.title')}
          </Title>
          <Text color="dimmed" size="sm" mb="xl">
            {t('dashboard.description')}
          </Text>
        </motion.div>

        {/* Stat Cards */}
        <DashboardStats
          activity={activity}
          t={t}
          setIsQueueModalOpen={setIsQueueModalOpen}
          setIsFailedModalOpen={setIsFailedModalOpen}
        />

        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <SourceStatsChart />
        </div>

        <Grid>
          {/* Downloads chart */}
          <Grid.Col md={8}>
            <Stack>
              <DownloadsChart activityHistoryQuery={activityHistoryQuery} />
              <SourceFailureChart />
            </Stack>
          </Grid.Col>

          {/* Recent activity feed */}
          <Grid.Col md={4}>
            <RecentActivityFeed historyQuery={historyQuery} />
          </Grid.Col>
        </Grid>

        <FailedJobsModal opened={isFailedModalOpen} onClose={() => setIsFailedModalOpen(false)} />
        <DownloadQueueModal opened={isQueueModalOpen} onClose={() => setIsQueueModalOpen(false)} />
      </Container>
    </ScrollArea>
  );
}
export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
