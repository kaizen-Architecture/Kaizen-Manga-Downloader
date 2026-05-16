import {
  ActionIcon,
  Box,
  Divider,
  Drawer,
  Kbd,
  ScrollArea,
  Title,
  Tooltip,
  UnstyledButton,
  Group,
  Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { IconSettings, IconServer } from '@tabler/icons-react';
import { useState } from 'react';
import { IntegrationSettings } from './settings/integration';
import { MangalSettings } from './settings/mangal';
import { NotificationSettings } from './settings/notification';
import { SwitchTheme } from './settings/switchTheme';

function SettingsMenu() {
  return (
    <Box pr={20}>
      <Divider
        sx={{ fontWeight: 'bolder' }}
        variant="dashed"
        my="xs"
        label={
          <>
            <Title mr="xs" order={3}>
              Theme
            </Title>
            <Kbd mr="xs">Shift</Kbd> +{' '}
            <Kbd px="xs" ml="xs">
              T
            </Kbd>
          </>
        }
      />
      <SwitchTheme />
      <Divider
        mt={40}
        sx={{ fontWeight: 'bolder' }}
        variant="dashed"
        my="xs"
        label={<Title order={3}>Notification</Title>}
      />
      <NotificationSettings />
      <Divider
        mt={40}
        sx={{ fontWeight: 'bolder' }}
        variant="dashed"
        my="xs"
        label={<Title order={3}>Integration</Title>}
      />
      <IntegrationSettings />
      <Divider mt={40} sx={{ fontWeight: 'bolder' }} variant="dashed" my="xs" label={<Title order={3}>Mangal</Title>} />
      <MangalSettings />
      <Divider my="xs" mt={40} />
      <UnstyledButton
        component="a"
        href="/bull/queues"
        target="_blank"
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
          '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <IconServer size={16} />
          <Text size="sm" color="dimmed">
            Queue Monitor (Advanced)
          </Text>
        </Group>
      </UnstyledButton>
    </Box>
  );
}

export function SettingsMenuButton() {
  const router = useRouter();
  return (
    <Tooltip withinPortal withArrow label="Settings" position="bottom-end">
      <ActionIcon
        variant="subtle"
        aria-label="Open settings"
        sx={(theme) => ({
          color: theme.white,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        })}
        onClick={() => router.push('/settings')}
        size="lg"
      >
        <IconSettings size={20} strokeWidth={1.5} />
      </ActionIcon>
    </Tooltip>
  );
}
