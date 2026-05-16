import { useState } from 'react';
import { Button, Group, Stack, TextInput, Textarea, MultiSelect, Select, FileInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX, IconUpload } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { trpc } from '../../utils/trpc';
import { Prisma } from '@prisma/client';

const mangaWithMetadata = Prisma.validator<Prisma.MangaArgs>()({
  include: { metadata: true },
});

type MangaWithMetadata = Prisma.MangaGetPayload<typeof mangaWithMetadata>;

interface EditMetadataModalProps {
  manga: MangaWithMetadata;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditMetadataModalContent({ manga, onClose, onSuccess }: EditMetadataModalProps) {
  const { t } = useTranslation('common');
  const updateManualMetadata = trpc.manga.updateManualMetadata.useMutation();

  const form = useForm({
    initialValues: {
      cover: manga.metadata?.cover || '',
      summary: manga.metadata?.summary || '',
      status: manga.metadata?.status || 'UNKNOWN',
      genres: manga.metadata?.genres || [],
      authors: manga.metadata?.authors || [],
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File | null) => {
    setSelectedFile(file);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        form.setFieldValue('cover', result);
        showNotification({
          title: 'Cover Loaded',
          message: 'Image prepared successfully. Click Save to apply.',
          color: 'teal',
          icon: <IconCheck size={18} />,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await updateManualMetadata.mutateAsync({
        id: manga.id,
        cover: values.cover,
        summary: values.summary,
        status: values.status,
        genres: values.genres,
        authors: values.authors,
      });

      showNotification({
        title: 'Success',
        message: 'Metadata updated successfully',
        color: 'teal',
        icon: <IconCheck size={18} />,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      showNotification({
        title: 'Error',
        message: err.message || 'Failed to update metadata',
        color: 'red',
        icon: <IconX size={18} />,
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="sm">
        <Group grow align="flex-start">
          <TextInput
            label="Cover Image URL"
            placeholder="https://..."
            {...form.getInputProps('cover')}
            value={form.values.cover.startsWith('data:image/') ? '' : form.values.cover}
            onChange={(e) => {
              setSelectedFile(null);
              form.getInputProps('cover').onChange(e);
            }}
            description={form.values.cover.startsWith('data:image/') ? 'Custom file uploaded successfully (Base64 ready)' : undefined}
          />
          <FileInput
            label="Or Upload Image"
            placeholder="Click to browse"
            accept="image/*"
            value={selectedFile}
            icon={<IconUpload size={14} />}
            onChange={handleFileUpload}
          />
        </Group>
        <Textarea
          label="Summary"
          placeholder="Manga summary or synopsis..."
          minRows={4}
          {...form.getInputProps('summary')}
        />
        <Select
          label="Status"
          data={[
            { value: 'UNKNOWN', label: 'Unknown' },
            { value: 'RELEASING', label: 'Ongoing' },
            { value: 'FINISHED', label: 'Completed' },
            { value: 'HIATUS', label: 'Hiatus' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
          {...form.getInputProps('status')}
        />
        <MultiSelect
          label="Genres"
          placeholder="Select or type genres"
          data={form.values.genres.map((g) => ({ value: g, label: g }))}
          creatable
          searchable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            form.setFieldValue('genres', [...form.values.genres, query]);
            return query;
          }}
          {...form.getInputProps('genres')}
        />
        <MultiSelect
          label="Authors"
          placeholder="Select or type authors"
          data={form.values.authors.map((a) => ({ value: a, label: a }))}
          creatable
          searchable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            form.setFieldValue('authors', [...form.values.authors, query]);
            return query;
          }}
          {...form.getInputProps('authors')}
        />
        <Group position="right" mt="md">
          <Button variant="default" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" color="indigo" loading={updateManualMetadata.isLoading}>
            {t('common.save')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
