import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  SegmentedControl,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconCheck,
  IconKey,
  IconPlus,
  IconShieldLock,
  IconTrash,
  IconUserPlus,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { trpc } from '../utils/trpc';

export default function UsersPage() {
  const { t } = useTranslation('settings');
  const modals = useModals();

  const users = trpc.auth.getUsers.useQuery();
  const isDefaultPasswordQuery = trpc.auth.checkAdminDefaultPassword.useQuery();

  // Formularios de Estado
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'SUPERADMIN' | 'MANAGER' | 'READER'>('MANAGER');

  const updatePasswordMutation = trpc.auth.updateUserPassword.useMutation({
    onSuccess: () => {
      isDefaultPasswordQuery.refetch();
      showNotification({
        title: t('users.notifications.passwordUpdatedTitle', 'Contraseña Actualizada'),
        message: t('users.notifications.passwordUpdatedDesc', 'La contraseña del administrador ha sido cambiada exitosamente.'),
        color: 'teal',
        icon: <IconCheck size={18} />,
      });
      setAdminNewPassword('');
      setAdminConfirmPassword('');
    },
    onError: (err) => {
      showNotification({
        title: t('common.error', 'Error'),
        message: err.message,
        color: 'red',
      });
    },
  });

  const generateTokenMutation = trpc.auth.generateApiToken.useMutation({
    onSuccess: () => {
      users.refetch();
      showNotification({
        title: t('users.notifications.tokenGeneratedTitle', 'Token Generado'),
        message: t('users.notifications.tokenGeneratedDesc', 'El API Token ha sido generado correctamente.'),
        color: 'teal',
        icon: <IconCheck size={18} />,
      });
    },
    onError: (err) => {
      showNotification({
        title: t('users.notifications.tokenErrorTitle', 'Error Generando Token'),
        message: err.message,
        color: 'red',
      });
    },
  });

  const createUser = trpc.auth.createUser.useMutation({
    onSuccess: () => {
      users.refetch();
      showNotification({
        title: t('users.notifications.userCreatedTitle', 'Usuario Creado'),
        message: t('users.notifications.userCreatedDesc', 'La nueva cuenta de usuario se ha registrado correctamente.'),
        color: 'teal',
        icon: <IconCheck size={18} />,
      });
      setNewUsername('');
      setNewPassword('');
    },
    onError: (err) => {
      showNotification({
        title: t('common.error', 'Error'),
        message: err.message,
        color: 'red',
      });
    },
  });

  const deleteUser = trpc.auth.deleteUser.useMutation({
    onSuccess: () => {
      users.refetch();
      showNotification({
        title: t('users.notifications.userDeletedTitle', 'Cuenta Eliminada'),
        message: t('users.notifications.userDeletedDesc', 'El acceso del usuario ha sido revocado permanentemente.'),
        color: 'teal',
        icon: <IconCheck size={18} />,
      });
    },
    onError: (err) => {
      showNotification({
        title: t('common.error', 'Error'),
        message: err.message,
        color: 'red',
      });
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNewPassword) return;
    if (adminNewPassword !== adminConfirmPassword) {
      showNotification({
        title: t('users.adminPassword.mismatchTitle', 'Contraseñas no coinciden'),
        message: t('users.adminPassword.mismatchDesc', 'Por favor, asegúrate de escribir exactamente la misma contraseña en ambos campos.'),
        color: 'orange',
      });
      return;
    }

    const adminAccount = users.data?.find((u) => u.username === 'admin');
    if (!adminAccount) {
      showNotification({
        title: t('common.error', 'Error'),
        message: t('users.adminPassword.notFound', 'No se pudo localizar la cuenta principal del administrador.'),
        color: 'red',
      });
      return;
    }

    updatePasswordMutation.mutate({ id: adminAccount.id, newPassword: adminNewPassword });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;
    createUser.mutate({ username: newUsername, password: newPassword, role: newRole });
  };

  const confirmDelete = (userId: number, username: string) => {
    modals.openConfirmModal({
      title: t('users.delete.confirmTitle', 'Confirmar eliminación de cuenta'),
      children: (
        <Text size="sm">
          {t('users.delete.confirmDesc', '¿Estás completamente seguro de que deseas revocar y eliminar el acceso para el usuario ', { username })} <b>{username}</b>?
        </Text>
      ),
      labels: { confirm: t('users.delete.confirmButton', 'Eliminar'), cancel: t('users.delete.cancelButton', 'Cancelar') },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUser.mutate({ id: userId }),
    });
  };

  return (
    <Container size="xl" py="md">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Stack spacing="xs" mb="xl">
          <Group spacing="xs">
            <IconShieldLock size={28} style={{ color: '#8B5CF6' }} />
            <Title order={2}>{t('users.title', 'Centro de Cuentas y Control de Acceso')}</Title>
          </Group>
          <Text size="sm" color="dimmed">
            {t('users.description', 'Gestiona la seguridad y los niveles de autorización de todos los usuarios de la plataforma Kaizen.')}
          </Text>
        </Stack>
      </motion.div>

      {isDefaultPasswordQuery.data === true && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert icon={<IconAlertTriangle size={20} />} color="orange" radius="md" variant="filled" mb="xl">
            <Text size="sm" weight={700}>
              {t('users.defaultPasswordAlert.title', '¡Atención! Contraseña Predeterminada de Administrador Activa')}
            </Text>
            <Text size="xs" mt={2}>
              {t('users.defaultPasswordAlert.desc', 'Hemos detectado que tu cuenta principal admin sigue configurada con la contraseña de fábrica. Por tu absoluta privacidad y seguridad web, es de suma importancia que la modifiques en este momento utilizando el panel inferior.')}
              importancia que la modifiques en este momento utilizando el panel inferior.
            </Text>
          </Alert>
        </motion.div>
      )}

      <Stack spacing="lg">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Paper
            withBorder
            p="lg"
            radius="md"
            shadow="sm"
            sx={{ borderColor: isDefaultPasswordQuery.data ? '#F97316' : undefined }}
          >
            <Group spacing="sm" mb="md">
              <IconKey size={20} style={{ color: '#8B5CF6' }} />
              <Title order={4}>{t('users.adminPassword.title', 'Actualizar Contraseña del Administrador Principal')}</Title>
            </Group>
            <Text size="xs" color="dimmed" mb="md">
              {t('users.adminPassword.desc', 'Cambia la contraseña de la cuenta raíz admin para salvaguardar la configuración del descargador.')}
            </Text>

            <form onSubmit={handlePasswordSubmit}>
              <Group align="flex-end" spacing="md">
                <PasswordInput
                  label={t('users.adminPassword.newPassword', 'Nueva Contraseña')}
                  placeholder={t('users.adminPassword.newPasswordPlaceholder', 'Escribe la nueva clave segura')}
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.currentTarget.value)}
                  required
                  sx={{ flex: 1 }}
                />
                <PasswordInput
                  label={t('users.adminPassword.confirmPassword', 'Confirmar Contraseña')}
                  placeholder={t('users.adminPassword.confirmPasswordPlaceholder', 'Vuelve a escribir la clave')}
                  value={adminConfirmPassword}
                  onChange={(e) => setAdminConfirmPassword(e.currentTarget.value)}
                  required
                  sx={{ flex: 1 }}
                />
                <Button type="submit" color="violet" loading={updatePasswordMutation.isLoading}>
                  {t('users.adminPassword.saveButton', 'Guardar Contraseña')}
                </Button>
              </Group>
            </form>
          </Paper>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Paper withBorder p="lg" radius="md" shadow="sm">
            <Group spacing="sm" mb="md">
              <IconUserPlus size={20} style={{ color: '#8B5CF6' }} />
              <Title order={4}>{t('users.management.title', 'Gestión y Creación de Usuarios Locales')}</Title>
            </Group>
            <Text size="xs" color="dimmed" mb="md">
              {t('users.management.desc', 'Crea sub-cuentas con roles específicos de acceso: Admin (control total), Gestor (descargas y series) o Lector (sólo lectura de la biblioteca).')}
            </Text>

            <Box
              p="md"
              mb="lg"
              sx={{
                background: 'rgba(139, 92, 246, 0.04)',
                borderRadius: 8,
                border: '1px solid rgba(139, 92, 246, 0.12)',
              }}
            >
              <Text size="xs" weight={600} color="violet" mb="xs">
                {t('users.management.addAccount', 'Añadir Nueva Cuenta')}
              </Text>
              <form onSubmit={handleCreateSubmit}>
                <Group align="flex-end" spacing="xs">
                  <TextInput
                    size="xs"
                    label={t('users.management.username', 'Nombre de Usuario')}
                    placeholder={t('users.management.usernamePlaceholder', 'ej. editor')}
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.currentTarget.value)}
                    required
                    sx={{ flex: 1 }}
                  />
                  <PasswordInput
                    size="xs"
                    label={t('users.management.password', 'Contraseña')}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.currentTarget.value)}
                    required
                    sx={{ flex: 1 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Text size="xs" weight={500} sx={{ fontSize: 11 }}>
                      {t('users.management.role', 'Nivel de Permisos')}
                    </Text>
                    <SegmentedControl
                      size="xs"
                      fullWidth
                      value={newRole}
                      onChange={(val: any) => setNewRole(val)}
                      data={[
                        { value: 'SUPERADMIN', label: t('users.roles.superadmin', 'Admin') },
                        { value: 'MANAGER', label: t('users.roles.manager', 'Gestor') },
                        { value: 'READER', label: t('users.roles.reader', 'Lector') },
                      ]}
                    />
                  </Box>
                  <Button
                    type="submit"
                    size="xs"
                    color="violet"
                    leftIcon={<IconPlus size={14} />}
                    loading={createUser.isLoading}
                  >
                    {t('users.management.addButton', 'Añadir Usuario')}
                  </Button>
                </Group>
              </form>
            </Box>

            <Text size="sm" weight={600} mb="xs">
              {t('users.list.title', 'Usuarios Registrados Activos')}
            </Text>
            <Table fontSize="sm" highlightOnHover verticalSpacing="sm">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>{t('users.list.id', 'ID')}</th>
                  <th>{t('users.list.username', 'Usuario')}</th>
                  <th>{t('users.list.role', 'Rol Asignado')}</th>
                  <th>{t('users.list.apiToken', 'API Token')}</th>
                  <th style={{ width: 80, textAlign: 'right' }}>{t('users.list.actions', 'Acciones')}</th>
                </tr>
              </thead>
              <tbody>
                {users.data?.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td style={{ fontWeight: 600 }}>{u.username}</td>
                    <td>
                      <Badge
                        color={u.role === 'SUPERADMIN' ? 'violet' : u.role === 'MANAGER' ? 'teal' : 'gray'}
                        variant="light"
                      >
                        {u.role === 'SUPERADMIN'
                          ? t('users.roles.superadmin', 'Admin')
                          : u.role === 'MANAGER'
                          ? t('users.roles.manager', 'Gestor')
                          : t('users.roles.reader', 'Lector')}
                      </Badge>
                    </td>
                    <td>
                      {u.apiToken ? (
                        <Group spacing="xs">
                          <Text size="xs" color="dimmed" sx={{ fontFamily: 'monospace' }}>
                            {u.apiToken.substring(0, 8)}...
                          </Text>
                          <Button
                            variant="subtle"
                            size="xs"
                            compact
                            onClick={() => {
                              modals.openConfirmModal({
                                title: t('users.list.regenerateConfirmTitle', 'Regenerate API Token'),
                                children: (
                                  <Text size="sm">
                                    {t('users.list.regenerate', 'Are you sure you want to regenerate the API token for this user? Any applications using the old token will lose access.')}
                                  </Text>
                                ),
                                labels: { confirm: t('users.list.regenerate', 'Regenerate'), cancel: t('users.delete.cancelButton', 'Cancel') },
                                confirmProps: { color: 'red' },
                                onConfirm: () => {
                                  generateTokenMutation.mutate({ id: u.id });
                                },
                              });
                            }}
                          >
                            {t('users.list.regenerate', 'Regenerate')}
                          </Button>
                        </Group>
                      ) : (
                        <Button
                          variant="light"
                          size="xs"
                          compact
                          onClick={() => generateTokenMutation.mutate({ id: u.id })}
                        >
                          {t('users.list.generate', 'Generate Token')}
                        </Button>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        disabled={u.username === 'admin'}
                        onClick={() => confirmDelete(u.id, u.username)}
                        title={
                          u.username === 'admin'
                            ? t('users.delete.disabledAdmin', 'La cuenta principal no puede ser eliminada')
                            : t('users.delete.confirmButton', 'Eliminar usuario')
                        }
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Paper>
        </motion.div>
      </Stack>
    </Container>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'settings'])),
    },
  };
}
