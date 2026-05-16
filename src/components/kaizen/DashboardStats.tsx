import { Grid } from '@mantine/core';
import { IconActivity, IconClock, IconCalendarStats, IconAlertTriangle, IconCircleCheck } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { StatCard } from './StatCard';

export function DashboardStats({
  activity,
  t,
  setIsQueueModalOpen,
  setIsFailedModalOpen,
}: {
  activity: any;
  t: any;
  setIsQueueModalOpen: (val: boolean) => void;
  setIsFailedModalOpen: (val: boolean) => void;
}) {
  const router = useRouter();

  if (!activity) return null;

  return (
    <Grid mb="xl" justify="center">
      {[
        {
          label: t('dashboard.stats.downloading'),
          value: activity.active,
          icon: IconActivity,
          color: 'teal',
          onClick: () => setIsQueueModalOpen(true),
        },
        {
          label: t('dashboard.stats.queued'),
          value: activity.queued,
          icon: IconClock,
          color: 'cyan',
          onClick: () => setIsQueueModalOpen(true),
        },
        {
          label: t('dashboard.stats.scheduled'),
          value: activity.scheduled,
          icon: IconCalendarStats,
          color: 'indigo',
          onClick: () => router.push('/scheduler'),
        },
        {
          label: t('dashboard.stats.failed'),
          value: activity.failed,
          icon: IconAlertTriangle,
          color: 'red',
          onClick: () => setIsFailedModalOpen(true),
        },
        {
          label: t('dashboard.stats.completed'),
          value: activity.completed,
          icon: IconCircleCheck,
          color: 'gray',
        },
      ].map((stat) => (
        <Grid.Col key={stat.label} xs={6} sm={4} md={4} lg={2}>
          <StatCard {...stat} />
        </Grid.Col>
      ))}
    </Grid>
  );
}
