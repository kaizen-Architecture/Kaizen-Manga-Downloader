import { Group, Paper, Text, ThemeIcon, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';
import { trpc } from '../../utils/trpc';

export function SourceFailureChart() {
  const failureStatsQuery = trpc.manga.failureStatsBySource.useQuery();

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      })}
    >
      <Group mb="md">
        <ThemeIcon size={32} radius="md" color="red" variant="light">
          <IconAlertTriangle size={16} />
        </ThemeIcon>
        <Title order={4}>Kaizen Source Health — Failures</Title>
      </Group>
      {failureStatsQuery.data && failureStatsQuery.data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={failureStatsQuery.data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis dataKey="source" type="category" tick={{ fontSize: 11 }} width={100} />
            <RechartsTooltip formatter={(value: number) => [`${value} failures`, 'Count']} />
            <Bar dataKey="count" fill="#fa5252" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Text color="dimmed" size="sm" align="center" py="xl">
          No failed jobs recorded.
        </Text>
      )}
    </Paper>
  );
}
