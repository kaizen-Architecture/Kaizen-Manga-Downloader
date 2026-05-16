import { Paper, Text, Group, ThemeIcon, Stack, RingProgress, Center, Title } from '@mantine/core';
import { IconCheck, IconX, IconRefresh } from '@tabler/icons-react';

interface IntegrationHealthCardProps {
  name: string;
  status: 'healthy' | 'unhealthy' | 'connecting';
  syncedCount: number;
  totalCount: number;
  onSync?: () => void;
  isLoading?: boolean;
}

export function IntegrationHealthCard({
  name,
  status,
  syncedCount,
  totalCount,
  onSync,
  isLoading,
}: IntegrationHealthCardProps) {
  const percentage = totalCount > 0 ? Math.round((syncedCount / totalCount) * 100) : 0;
  const color = status === 'healthy' ? 'teal' : status === 'unhealthy' ? 'red' : 'yellow';

  return (
    <Paper withBorder p="md" radius="md">
      <Group position="apart">
        <Stack spacing={0}>
          <Title order={5}>{name}</Title>
          <Group spacing={5}>
            <ThemeIcon color={color} size="xs" radius="xl">
              {status === 'healthy' ? <IconCheck size={10} /> : <IconX size={10} />}
            </ThemeIcon>
            <Text size="xs" color="dimmed">
              {status === 'healthy' ? 'Healthy' : status === 'unhealthy' ? 'Disconnected' : 'Connecting...'}
            </Text>
          </Group>
        </Stack>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: percentage, color: 'indigo' }]}
          label={
            <Center>
              <Text size="xs" weight={700}>
                {percentage}%
              </Text>
            </Center>
          }
        />
      </Group>

      <Stack spacing="xs" mt="md">
        <Group position="apart">
          <Text size="sm" color="dimmed">Sync Status</Text>
          <Text size="sm" weight={500}>{syncedCount} / {totalCount} mangas</Text>
        </Group>
        
        {onSync && (
          <Group position="right">
            <ThemeIcon 
              variant="light" 
              color="indigo" 
              size="sm" 
              sx={{ cursor: 'pointer' }}
              onClick={onSync}
            >
              <IconRefresh size={14} className={isLoading ? 'animate-spin' : ''} />
            </ThemeIcon>
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
