import { Paper, Group, ThemeIcon, Title, Center, Loader, Stack, Text } from '@mantine/core';
import { IconDownload, IconChartBarOff } from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export function DownloadsChart({ activityHistoryQuery }: { activityHistoryQuery: any }) {
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
        <ThemeIcon size={32} radius="md" color="indigo" variant="light">
          <IconDownload size={16} />
        </ThemeIcon>
        <Title order={4}>Downloads — Last 14 Days</Title>
      </Group>
      {activityHistoryQuery.isLoading ? (
        <Center sx={{ height: 200 }}>
          <Loader variant="dots" />
        </Center>
      ) : activityHistoryQuery.data && activityHistoryQuery.data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={activityHistoryQuery.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={1} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <RechartsTooltip formatter={(value: number) => [`${value} chapters`, 'Downloaded']} />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Stack align="center" justify="center" sx={{ height: 200 }}>
          <ThemeIcon size={64} radius="xl" color="gray" variant="light">
            <IconChartBarOff size={32} />
          </ThemeIcon>
          <Text color="dimmed" size="sm">
            No download data available
          </Text>
        </Stack>
      )}
    </Paper>
  );
}
