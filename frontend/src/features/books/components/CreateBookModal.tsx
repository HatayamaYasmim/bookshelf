import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
  Text,
} from '@mantine/core';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateBookData } from '../../../services/books';
import type { Author } from '../../../types/author';
import type { ReadingStatus } from '../../../types/book';
import { RiBookAiFill } from 'react-icons/ri';

const createBookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Informe o título do livro'),

  authorId: z
    .string()
    .min(1, 'Selecione um autor'),

  status: z.enum([
    'UNREAD',
    'READING',
    'READ',
  ]),
});

type CreateBookFormData = z.infer<
  typeof createBookSchema
>;

interface CreateBookModalProps {
  opened: boolean;
  onClose: () => void;
  authors: Author[];

  onSubmit: (
    data: CreateBookData,
  ) => Promise<unknown>;

  isSubmitting?: boolean;
}

export function CreateBookModal({
  opened,
  onClose,
  authors,
  onSubmit,
  isSubmitting = false,
}: CreateBookModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookFormData>({
    resolver: zodResolver(createBookSchema),

    defaultValues: {
      title: '',
      authorId: '',
      status: 'UNREAD',
    },
  });

  async function handleCreateBook(
    data: CreateBookFormData,
  ) {
    await onSubmit({
      title: data.title,
      authorId: Number(data.authorId),
      status: data.status as ReadingStatus,
    });

    reset();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
            title={
                <Group gap="xs">
                    <RiBookAiFill size={18} />
                    <Text fw={600}>Book</Text>
                </Group>
            }
      centered
    >
      <form
        onSubmit={handleSubmit(handleCreateBook)}
      >
        <Stack>
          <TextInput
            label="Title"
            placeholder="Ex: The Hobbit"
            withAsterisk
            error={errors.title?.message}
            {...register('title')}
          />

          <Controller
            name="authorId"
            control={control}
            render={({ field }) => (
              <Select
                label="Author"
                placeholder="Select an author"
                withAsterisk
                searchable
                data={authors.map((author) => ({
                  value: String(author.id),
                  label: author.name,
                }))}
                value={field.value}
                onChange={(value) =>
                  field.onChange(value ?? '')
                }
                error={errors.authorId?.message}
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Status"
                withAsterisk
                allowDeselect={false}
                data={[
                  {
                    value: 'UNREAD',
                    label: 'Unread',
                  },
                  {
                    value: 'READING',
                    label: 'Reading',
                  },
                  {
                    value: 'READ',
                    label: 'Read',
                  },
                ]}
                value={field.value}
                onChange={(value) =>
                  field.onChange(value)
                }
                error={errors.status?.message}
              />
            )}
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="default"
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={isSubmitting}
            >
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}