import { Navbar, Stack, UnstyledButton, Text, Divider } from '@mantine/core';
import {
  IconLayoutDashboard,
  IconBooks,
  IconCalendarStats,
  IconPuzzle,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { MadeWith } from './madeWith';
import { trpc } from '../utils/trpc';

interface KaizenNavbarProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export function KaizenNavbar({ opened, setOpened }: KaizenNavbarProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const settings = trpc.settings.query.useQuery();

  const isAuthEnabled = (settings.data?.appConfig as any)?.authEnabled === true;

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

      <Divider opacity={0.2} />
      <Navbar.Section sx={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
        <MadeWith minimized={false} />
      </Navbar.Section>
    </Navbar>
  );
}
