import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Modal,
  PasswordInput,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconBrandGithub, IconCheck, IconLock, IconLockOpen, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { trpc } from '../../utils/trpc';

export function GithubSettings() {
  const [opened, { open, close }] = useDisclosure(false);
  const reposQuery = trpc.sources.listRepos.useQuery();
  const addRepoMutation = trpc.sources.addRepo.useMutation();
  const removeRepoMutation = trpc.sources.removeRepo.useMutation();

  const form = useForm({
    initialValues: {
      url: '',
      token: '',
      isPrivate: false,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!values.url.trim()) return;
    try {
      await addRepoMutation.mutateAsync({
        url: values.url,
        token: values.isPrivate ? values.token : null,
        isPrivate: values.isPrivate,
      });

      showNotification({
        title: 'Repositorio añadido',
        message: `Se ha registrado exitosamente el repositorio ${values.url}`,
        color: 'teal',
        icon: <IconCheck size={18} />,
      });
      form.reset();
      close();
      reposQuery.refetch();
    } catch (err: any) {
      showNotification({
        title: 'Error',
        message: err.message || 'No se pudo añadir el repositorio.',
        color: 'red',
        icon: <IconX size={18} />,
      });
    }
  };

  const handleRemove = async (id: number, url: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el repositorio ${url}?`)) return;
    try {
      await removeRepoMutation.mutateAsync({ id });
      showNotification({
        title: 'Repositorio eliminado',
        message: 'El repositorio ya no formará parte de la sincronización.',
        color: 'teal',
        icon: <IconCheck size={18} />,
      });
      reposQuery.refetch();
    } catch (err) {
      showNotification({
        title: 'Error',
        message: 'No se pudo eliminar el repositorio.',
        color: 'red',
      });
    }
  };

  const repos = reposQuery.data || [];

  return (
    <Box sx={{ position: 'relative' }}>
      <LoadingOverlay visible={reposQuery.isLoading} />

      <Stack spacing="md">
        <Group position="apart">
          <Stack spacing={2}>
            <Text weight={600} size="sm">
              Repositorios de Scrapers (Múltiples Fuentes)
            </Text>
            <Text size="xs" color="dimmed">
              Configura uno o varios repositorios de GitHub (públicos o privados) desde donde sincronizar e importar
              archivos `.lua` automáticamente.
            </Text>
          </Stack>
          <Button leftIcon={<IconPlus size={16} />} size="xs" variant="light" onClick={open}>
            Añadir Repositorio
          </Button>
        </Group>

        {repos.length === 0 ? (
          <Text size="sm" color="dimmed" align="center" py="xl">
            No hay repositorios configurados. Añade uno para habilitar la sincronización en la nube.
          </Text>
        ) : (
          <Table verticalSpacing="sm" highlightOnHover>
            <thead>
              <tr>
                <th>URL / Repositorio</th>
                <th>Acceso</th>
                <th style={{ width: 80, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {repos.map((repo) => (
                <tr key={repo.id}>
                  <td>
                    <Group spacing="xs">
                      <IconBrandGithub size={16} />
                      <Text size="sm" weight={500}>
                        {repo.url}
                      </Text>
                    </Group>
                  </td>
                  <td>
                    {repo.isPrivate || repo.token ? (
                      <Badge color="red" variant="light" leftSection={<IconLock size={10} style={{ marginTop: 3 }} />}>
                        Privado (PAT)
                      </Badge>
                    ) : (
                      <Badge
                        color="teal"
                        variant="light"
                        leftSection={<IconLockOpen size={10} style={{ marginTop: 3 }} />}
                      >
                        Público
                      </Badge>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <ActionIcon color="red" variant="subtle" onClick={() => handleRemove(repo.id, repo.url)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Stack>

      <Modal opened={opened} onClose={close} title={<Text weight={600}>Añadir Repositorio de Scrapers</Text>} centered>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="URL o Formato Corto"
              placeholder="owner/repo"
              description="Introduce el formato corto 'usuario/repositorio' o la URL completa de GitHub."
              required
              {...form.getInputProps('url')}
            />
            <Checkbox
              label="Es un repositorio Privado (requiere Token PAT)"
              {...form.getInputProps('isPrivate', { type: 'checkbox' })}
            />
            {form.values.isPrivate && (
              <PasswordInput
                label="Personal Access Token (PAT)"
                placeholder="ghp_xxxxxxxxxxxx"
                description="Token de GitHub con permisos de lectura para acceder al código de este repositorio privado."
                required={form.values.isPrivate}
                {...form.getInputProps('token')}
              />
            )}
            <Group position="right" mt="sm">
              <Button variant="subtle" onClick={close}>
                Cancelar
              </Button>
              <Button type="submit" loading={addRepoMutation.isLoading}>
                Guardar Repositorio
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}
