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
import React, { useState } from 'react';
import { trpc } from '../utils/trpc';

export default function UsersPage() {
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
        title: 'Contraseña Actualizada',
        message: 'La contraseña del administrador ha sido cambiada exitosamente.',
        color: 'teal',
        icon: <IconCheck size={18} />,
      });
      setAdminNewPassword('');
      setAdminConfirmPassword('');
    },
    onError: (err) => {
      showNotification({
        title: 'Error',
        message: err.message,
        color: 'red',
      });
    },
  });

  const generateTokenMutation = trpc.auth.generateApiToken.useMutation({
    onSuccess: () => {
      users.refetch();
      showNotification({
        title: 'Token Generado',
        message: 'El API Token ha sido generado correctamente.',
        color: 'teal',
        icon: <IconCheck size={18} />,
      });
    },
    onError: (err) => {
      showNotification({
        title: 'Error Generando Token',
        message: err.message,
        color: 'red',
      });
    },
  });

  const createUser = trpc.auth.createUser.useMutation({
    onSuccess: () => {
      users.refetch();
      showNotification({
        title: 'Usuario Creado',
        message: 'La nueva cuenta de usuario se ha registrado correctamente.',
        color: 'teal',
        icon: <IconCheck size={18} />,
      });
      setNewUsername('');
      setNewPassword('');
    },
    onError: (err) => {
      showNotification({
        title: 'Error',
        message: err.message,
        color: 'red',
      });
    },
  });

  const deleteUser = trpc.auth.deleteUser.useMutation({
    onSuccess: () => {
      users.refetch();
      showNotification({
        title: 'Cuenta Eliminada',
        message: 'El acceso del usuario ha sido revocado permanentemente.',
        color: 'teal',
        icon: <IconCheck size={18} />,
      });
    },
    onError: (err) => {
      showNotification({
        title: 'Error',
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
        title: 'Contraseñas no coinciden',
        message: 'Por favor, asegúrate de escribir exactamente la misma contraseña en ambos campos.',
        color: 'orange',
      });
      return;
    }

    const adminAccount = users.data?.find((u) => u.username === 'admin');
    if (!adminAccount) {
      showNotification({
        title: 'Error',
        message: 'No se pudo localizar la cuenta principal del administrador.',
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
      title: 'Confirmar eliminación de cuenta',
      children: (
        <Text size="sm">
          ¿Estás completamente seguro de que deseas revocar y eliminar el acceso para el usuario <b>{username}</b>?
        </Text>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
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
            <Title order={2}>Centro de Cuentas y Control de Acceso</Title>
          </Group>
          <Text size="sm" color="dimmed">
            Gestiona la seguridad y los niveles de autorización de todos los usuarios de la plataforma Kaizen.
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
              ¡Atención! Contraseña Predeterminada de Administrador Activa
            </Text>
            <Text size="xs" mt={2}>
              Hemos detectado que tu cuenta principal{' '}
              <code style={{ background: 'rgba(0,0,0,0.15)', padding: '2px 4px', borderRadius: 4 }}>admin</code> sigue
              configurada con la contraseña de fábrica. Por tu absoluta privacidad y seguridad web, es de suma
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
              <Title order={4}>Actualizar Contraseña del Administrador Principal</Title>
            </Group>
            <Text size="xs" color="dimmed" mb="md">
              Cambia la contraseña de la cuenta raíz{' '}
              <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: 4 }}>admin</code> para
              salvaguardar la configuración del descargador.
            </Text>

            <form onSubmit={handlePasswordSubmit}>
              <Group align="flex-end" spacing="md">
                <PasswordInput
                  label="Nueva Contraseña"
                  placeholder="Escribe la nueva clave segura"
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.currentTarget.value)}
                  required
                  sx={{ flex: 1 }}
                />
                <PasswordInput
                  label="Confirmar Contraseña"
                  placeholder="Vuelve a escribir la clave"
                  value={adminConfirmPassword}
                  onChange={(e) => setAdminConfirmPassword(e.currentTarget.value)}
                  required
                  sx={{ flex: 1 }}
                />
                <Button type="submit" color="violet" loading={updatePasswordMutation.isLoading}>
                  Guardar Contraseña
                </Button>
              </Group>
            </form>
          </Paper>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Paper withBorder p="lg" radius="md" shadow="sm">
            <Group spacing="sm" mb="md">
              <IconUserPlus size={20} style={{ color: '#8B5CF6' }} />
              <Title order={4}>Gestión y Creación de Usuarios Locales</Title>
            </Group>
            <Text size="xs" color="dimmed" mb="md">
              Crea sub-cuentas con roles específicos de acceso: <b>Admin</b> (control total), <b>Gestor</b> (descargas y
              series) o <b>Lector</b> (sólo lectura de la biblioteca).
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
                Añadir Nueva Cuenta
              </Text>
              <form onSubmit={handleCreateSubmit}>
                <Group align="flex-end" spacing="xs">
                  <TextInput
                    size="xs"
                    label="Nombre de Usuario"
                    placeholder="ej. editor"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.currentTarget.value)}
                    required
                    sx={{ flex: 1 }}
                  />
                  <PasswordInput
                    size="xs"
                    label="Contraseña"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.currentTarget.value)}
                    required
                    sx={{ flex: 1 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Text size="xs" weight={500} sx={{ fontSize: 11 }}>
                      Nivel de Permisos
                    </Text>
                    <SegmentedControl
                      size="xs"
                      fullWidth
                      value={newRole}
                      onChange={(val: any) => setNewRole(val)}
                      data={[
                        { value: 'SUPERADMIN', label: 'Admin' },
                        { value: 'MANAGER', label: 'Gestor' },
                        { value: 'READER', label: 'Lector' },
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
                    Añadir Usuario
                  </Button>
                </Group>
              </form>
            </Box>

            <Text size="sm" weight={600} mb="xs">
              Usuarios Registrados Activos
            </Text>
            <Table fontSize="sm" highlightOnHover verticalSpacing="sm">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>ID</th>
                  <th>Usuario</th>
                  <th>Rol Asignado</th>
                  <th>API Token</th>
                  <th style={{ width: 80, textAlign: 'right' }}>Acciones</th>
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
                        {u.role}
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
                                title: 'Regenerate API Token',
                                children: (
                                  <Text size="sm">
                                    Are you sure you want to regenerate the API token for this user? Any applications
                                    using the old token will lose access.
                                  </Text>
                                ),
                                labels: { confirm: 'Regenerate', cancel: 'Cancel' },
                                confirmProps: { color: 'red' },
                                onConfirm: () => {
                                  generateTokenMutation.mutate({ id: u.id });
                                },
                              });
                            }}
                          >
                            Regenerate
                          </Button>
                        </Group>
                      ) : (
                        <Button
                          variant="light"
                          size="xs"
                          compact
                          onClick={() => generateTokenMutation.mutate({ id: u.id })}
                        >
                          Generate Token
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
                          u.username === 'admin' ? 'La cuenta principal no puede ser eliminada' : 'Eliminar usuario'
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
