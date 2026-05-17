import { Box, Group, SegmentedControl, Slider, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconClockPlay, IconAdjustments } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';

const DELAY_MARKS = [
  { value: 1000, label: '1s' },
  { value: 2000, label: '2s' },
  { value: 3000, label: '3s' },
  { value: 5000, label: '5s' },
  { value: 7500, label: '7.5s' },
  { value: 10000, label: '10s' },
];

export function DownloadSettings() {
  const { t } = useTranslation('settings');
  const settings = trpc.settings.query.useQuery();
  const update = trpc.settings.update.useMutation({
    onSuccess: () => settings.refetch(),
  });

  const currentDelay = settings.data?.appConfig?.retryDelayMs ?? 2000;
  const currentMatching = settings.data?.appConfig?.alternativeSourceMatching ?? 'exact';
  const [localDelay, setLocalDelay] = useState<number | null>(null);
  const displayDelay = localDelay ?? currentDelay;

  const handleChangeEnd = (val: number) => {
    setLocalDelay(null);
    update.mutate({ updateType: 'app', key: 'retryDelayMs' as const, value: val });
  };

  if (settings.isLoading || !settings.data) return null;

  return (
    <Stack spacing="xl">
      <Group spacing="sm">
        <ThemeIcon size={36} radius="md" color="indigo" variant="light">
          <IconClockPlay size={20} />
        </ThemeIcon>
        <Box>
          <Title order={5}>{t('downloads.retryDelay.label')}</Title>
          <Text size="xs" color="dimmed">
            {t('downloads.retryDelay.description')}
          </Text>
        </Box>
      </Group>

      <Box px="md">
        <Text size="sm" weight={600} mb="xs">
          {t('downloads.retryDelay.current', { delay: (displayDelay / 1000).toFixed(1) })}
        </Text>
        <Slider
          min={1000}
          max={10000}
          step={500}
          value={displayDelay}
          onChange={setLocalDelay}
          onChangeEnd={handleChangeEnd}
          marks={DELAY_MARKS}
          label={(val) => `${(val / 1000).toFixed(1)}s`}
          disabled={update.isLoading}
          styles={(theme) => ({
            root: { paddingBottom: 28 },
            mark: { borderColor: theme.colors.indigo[4] },
            markLabel: { fontSize: 11, color: theme.colors.gray[5] },
            thumb: { borderWidth: 2 },
          })}
        />
      </Box>

      <Stack spacing="xs">
        <Group spacing="sm">
          <ThemeIcon size={36} radius="md" color="indigo" variant="light">
            <IconAdjustments size={20} />
          </ThemeIcon>
          <Box>
            <Title order={5}>Alternative Source Matching Strategy</Title>
            <Text size="xs" color="dimmed">
              Configures title mapping behavior when identifying or proposing alternative sources for chapter recovery.
            </Text>
          </Box>
        </Group>

        <Box px="md">
          <SegmentedControl
            data={[
              { label: 'Exact Match', value: 'exact' },
              { label: 'Include Confidence Alternative Names', value: 'fuzzy' },
            ]}
            value={currentMatching}
            onChange={(value) => update.mutate({ updateType: 'app', key: 'alternativeSourceMatching', value })}
            disabled={update.isLoading}
            color="indigo"
            size="sm"
          />
        </Box>
      </Stack>
    </Stack>
  );
}
