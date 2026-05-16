import { Alert, Box, Group, SegmentedControl, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconAlertCircle, IconLock } from '@tabler/icons-react';
import { setCookie } from 'cookies-next';
import { useTranslation } from 'next-i18next';
import { trpc } from '../../utils/trpc';

export function AuthSettings() {
  const { t } = useTranslation('settings');

  const settings = trpc.settings.query.useQuery();
  const update = trpc.settings.update.useMutation({
    onSuccess: () => settings.refetch(),
  });

  const authEnabledValue = (settings.data?.appConfig as any)?.authEnabled === true ? 'yes' : 'no';

  const handleAuthToggle = (val: string) => {
    const isEnabled = val === 'yes';
    if (isEnabled) {
      // Inyectar sesión inmediatamente para que el administrador activo no sea expulsado a Login
      setCookie('kaizen-session', 'admin-default-session', { path: '/' });
    }
    update.mutate({ updateType: 'app', key: 'authEnabled' as any, value: isEnabled });
  };

  if (settings.isLoading || !settings.data) return null;

  return (
    <Stack spacing="md" mt="xs">
      <Group spacing="sm">
        <ThemeIcon size={36} radius="md" color="violet" variant="light">
          <IconLock size={20} />
        </ThemeIcon>
        <Box>
          <Title order={5}>{t('auth.title', 'Autenticación y Control de Acceso Web')}</Title>
          <Text size="xs" color="dimmed">
            {t(
              'auth.desc',
              'Protege tu interfaz web requiriendo credenciales e instaura un entorno seguro con acceso exclusivo.',
            )}
          </Text>
        </Box>
      </Group>

      <Stack spacing="xs">
        <Text size="xs" weight={500} color="dimmed">
          {t('auth.toggleLabel', 'Requerir Inicio de Sesión Web')}
        </Text>
        <SegmentedControl
          fullWidth
          value={authEnabledValue}
          onChange={handleAuthToggle}
          disabled={update.isLoading}
          data={[
            { value: 'yes', label: t('common.enabled', 'Activado (Pide Credenciales)') },
            { value: 'no', label: t('common.disabled', 'Desactivado (Acceso Directo Sin Login)') },
          ]}
        />
      </Stack>

      {authEnabledValue === 'yes' && (
        <Alert icon={<IconAlertCircle size={16} />} color="violet" radius="md" variant="light" mt="sm">
          <Text size="sm" weight={600} mb={4}>
            ¡Modo de Cuentas Desbloqueado!
          </Text>
          <Text size="xs">
            La sección de <b>Cuentas</b> se ha vuelto visible en el menú de navegación principal.
          </Text>
          <Text size="xs" mt={4}>
            💡 <b>Usuario por defecto</b>:{' '}
            <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: 4 }}>admin</code> |{' '}
            <b>Contraseña</b>:{' '}
            <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: 4 }}>admin</code>
          </Text>
          <Text size="xs" color="dimmed" mt={6} sx={{ fontStyle: 'italic' }}>
            ⚠️ Te recomendamos encarecidamente acceder a la sección de <b>Cuentas</b> para cambiar la contraseña
            predeterminada en tu primer reinicio o añadir usuarios con roles personalizados.
          </Text>
        </Alert>
      )}
    </Stack>
  );
}
