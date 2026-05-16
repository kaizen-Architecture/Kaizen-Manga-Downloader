import { Paper, Group, ThemeIcon, Title, Center, Loader, Stack, Text, Grid, useMantineTheme } from '@mantine/core';
import { IconDatabase, IconChartBarOff } from '@tabler/icons-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Label,
} from 'recharts';
import { trpc } from '../../utils/trpc';

const formatBytes = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

const COLORS = ['#4f46e5', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981'];

export function SourceStatsChart() {
  const theme = useMantineTheme();
  const query = trpc.manga.sourceStats.useQuery();

  if (query.isLoading) {
    return (
      <Paper
        withBorder
        p="md"
        radius="md"
        sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white })}
      >
        <Center sx={{ height: 200 }}>
          <Loader variant="dots" />
        </Center>
      </Paper>
    );
  }

  if (!query.data || query.data.length === 0) {
    return (
      <Paper
        withBorder
        p="md"
        radius="md"
        sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white })}
      >
        <Stack align="center" justify="center" sx={{ height: 200 }}>
          <ThemeIcon size={64} radius="xl" color="gray" variant="light">
            <IconChartBarOff size={32} />
          </ThemeIcon>
          <Text color="dimmed" size="sm">
            No source statistics available
          </Text>
        </Stack>
      </Paper>
    );
  }

  const { data } = query;

  return (
    <Grid>
      <Grid.Col md={6}>
        <Paper
          withBorder
          p="md"
          radius="md"
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            height: '100%',
          })}
        >
          <Group mb="md">
            <ThemeIcon size={32} radius="md" color="pink" variant="light">
              <IconDatabase size={16} />
            </ThemeIcon>
            <Title order={4}>Mangas per Source</Title>
          </Group>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="source" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <RechartsTooltip formatter={(value: number) => [`${value} mangas`, 'Count']} />
              <Bar dataKey="mangaCount" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid.Col>

      <Grid.Col md={6}>
        <Paper
          withBorder
          p="md"
          radius="md"
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            height: '100%',
          })}
        >
          <Group mb="md">
            <ThemeIcon size={32} radius="md" color="teal" variant="light">
              <IconDatabase size={16} />
            </ThemeIcon>
            <Title order={4}>Storage per Source</Title>
          </Group>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="totalSize"
                nameKey="source"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <Label
                  value={formatBytes(data.reduce((acc, curr) => acc + curr.totalSize, 0))}
                  position="center"
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fill: theme.colorScheme === 'dark' ? theme.white : theme.black,
                  }}
                />
              </Pie>
              <RechartsTooltip formatter={(value: number) => formatBytes(value)} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
