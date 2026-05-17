import { Navbar, Stack, UnstyledButton, Text, Divider, Avatar, Group, Box, ActionIcon, Tooltip } from '@mantine/core';
import { useModals } from '@mantine/modals';
import {
  IconLayoutDashboard,
  IconBooks,
  IconCalendarStats,
  IconPuzzle,
  IconSettings,
  IconUsers,
  IconLogout,
} from '@tabler/icons-react';
import { getCookie, deleteCookie } from 'cookies-next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MadeWith } from './madeWith';
import { trpc } from '../utils/trpc';

interface KaizenNavbarProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export function KaizenNavbar({ opened, setOpened }: KaizenNavbarProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');
  const modals = useModals();
  const settings = trpc.settings.query.useQuery();

  const isAuthEnabled = (settings.data?.appConfig as any)?.authEnabled === true;

  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    const session = getCookie('kaizen-session');
    if (session) {
      try {
        setCurrentUser(JSON.parse(session as string));
      } catch (e) {
        // ignore
      }
    }
  }, [isAuthEnabled]);

  const handleLogout = () => {
    modals.openConfirmModal({
      title: tSettings('auth.logout', 'Cerrar Sesión'),
      children: (
        <Text size="sm">
          {tSettings('auth.logoutConfirm', '¿Estás seguro de que deseas cerrar tu sesión actual?')}
        </Text>
      ),
      labels: { confirm: tSettings('auth.logout', 'Cerrar Sesión'), cancel: t('common.cancel', 'Cancelar') },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteCookie('kaizen-session');
        window.location.reload();
      },
    });
  };

  const navItems = [
    { label: t('nav.dashboard'), icon: IconLayoutDashboard, href: '/' },
    { label: t('nav.library'), icon: IconBooks, href: '/library' },
    { label: t('nav.planner'), icon: IconCalendarStats, href: '/scheduler' },
    { label: t('nav.sources'), icon: IconPuzzle, href: '/sources' },
    ...(isAuthEnabled ? [{ label: t('nav.users', 'Cuentas'), icon: IconUsers, href: '/users' }] : []),
    { label: t('nav.settings'), icon: IconSettings, href: '/settings' },
  ];

  const handleNav = (href: string) => {
    router.push(href);
    setOpened(false); // cerrar al navegar en móvil
  };

  return (
    <Navbar
      width={{ sm: 220 }}
      p="md"
      hiddenBreakpoint="md"
      hidden={!opened}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? 'rgba(30, 27, 75, 0.85)' : 'rgba(67, 56, 202, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        boxShadow: theme.shadows.md,
        zIndex: 200,
      })}
    >
      <Navbar.Section grow>
        <Stack spacing={4}>
          {navItems.map((item) => {
            const isActive = item.href === '/' ? router.pathname === '/' : router.pathname.startsWith(item.href);
            return (
              <UnstyledButton
                key={item.href}
                onClick={() => handleNav(item.href)}
                sx={(theme) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: theme.radius.md,
                  color: isActive ? theme.white : 'rgba(255,255,255,0.65)',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: theme.fontSizes.sm,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: theme.white,
                  },
                })}
              >
                <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <Text>{item.label}</Text>
              </UnstyledButton>
            );
          })}
        </Stack>
      </Navbar.Section>

      {isAuthEnabled && currentUser && (
        <Navbar.Section
          p="xs"
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 8,
            marginBottom: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Group position="apart" spacing="xs">
            <Group spacing="xs" sx={{ overflow: 'hidden', flex: 1 }}>
              <Avatar
                size="sm"
                radius="xl"
                color="violet"
                styles={{
                  placeholder: {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                    color: '#fff',
                    fontWeight: 700,
                  },
                }}
              >
                {currentUser.username.substring(0, 2).toUpperCase()}
              </Avatar>
              <Box sx={{ overflow: 'hidden', flex: 1 }}>
                <Text size="xs" weight={600} color="white" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {currentUser.username}
                </Text>
                <Text size="10px" color="rgba(255,255,255,0.45)">
                  {currentUser.role === 'SUPERADMIN'
                    ? tSettings('users.roles.superadmin', 'Admin')
                    : currentUser.role === 'MANAGER'
                    ? tSettings('users.roles.manager', 'Gestor')
                    : tSettings('users.roles.reader', 'Lector')}
                </Text>
              </Box>
            </Group>
            <Tooltip label={tSettings('auth.logout', 'Cerrar Sesión')} position="top" withArrow>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={handleLogout}
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                  },
                }}
              >
                <IconLogout size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Navbar.Section>
      )}

      <Divider opacity={0.2} />
      <Navbar.Section sx={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
        <MadeWith minimized={false} />
      </Navbar.Section>
    </Navbar>
  );
}
