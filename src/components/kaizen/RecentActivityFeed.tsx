import { Paper, Title, Stack, Center, Loader, Group, Image, Box, Text, ThemeIcon } from '@mantine/core';
import { IconHistory } from '@tabler/icons-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function RecentActivityFeed({ historyQuery }: { historyQuery: any }) {
  return (
    <Paper withBorder p="md" radius="md" sx={{ height: '100%' }}>
      <Title order={4} mb="md">
        Recent Downloads
      </Title>
      <Stack spacing="xs">
        {historyQuery.isLoading ? (
          <Center py="xl">
            <Loader variant="dots" />
          </Center>
        ) : historyQuery.data && historyQuery.data.length > 0 ? (
          historyQuery.data.slice(0, 8).map((chapter: any) => (
            <Group key={chapter.id} spacing="sm" noWrap>
              <Image src={chapter.manga.metadata.cover} width={32} height={48} radius="xs" withPlaceholder />
              <Box sx={{ overflow: 'hidden', flex: 1 }}>
                <Text size="xs" weight={600} lineClamp={1}>
                  {chapter.manga.title}
                </Text>
                <Text size="xs" color="dimmed" lineClamp={1}>
                  {chapter.fileName}
                </Text>
                <Text size="xs" color="dimmed">
                  {dayjs(chapter.createdAt).fromNow()}
                </Text>
              </Box>
            </Group>
          ))
        ) : (
          <Stack align="center" justify="center" py="xl">
            <ThemeIcon size={64} radius="xl" color="gray" variant="light">
              <IconHistory size={32} />
            </ThemeIcon>
            <Text color="dimmed" size="sm">
              No recent downloads
            </Text>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
