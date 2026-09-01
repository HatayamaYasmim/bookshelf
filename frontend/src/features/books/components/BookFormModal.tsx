import {
  Button,
  Group,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateBookData } from '../../../services/books';
import type { Author } from '../../../types/author';
import type { Book, ReadingStatus } from '../../../types/book';
import { RiBookAiFill } from 'react-icons/ri';
import { BookshelfModal } from './ui/BookshellfModal';
import { bookshelfSelectClassNames } from '../../../styles/mantine';
import { useEffect } from 'react';

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

  book?: Book | null;

  onSubmit: (
    data: CreateBookData,
  ) => Promise<unknown>;

  isSubmitting?: boolean;
}

export function BookFormModal({
  opened,
  onClose,
  authors,
  onSubmit,
  book,
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

  const isEditing = !!book;

  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        authorId: String(book.authorId),
        status: book.status,
      });

      return;
    }

    reset({
      title: '',
      authorId: '',
      status: 'UNREAD',
    });
  }, [book, opened, reset]);

  return (
    <BookshelfModal
      opened={opened}
      onClose={handleClose}
      title={
        isEditing
          ? 'Edit book'
          : 'Add book'
      }
      icon={
        <RiBookAiFill
          size={21}
          color="var(--bookshelf-primary)"
        />
      }
    >
      <form
        onSubmit={handleSubmit(handleCreateBook)}
      >
        <Stack>
          <TextInput
            classNames={{
              input: 'bookshelf-input',
            }}
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
                classNames={bookshelfSelectClassNames}
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
                classNames={bookshelfSelectClassNames}
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
              variant="transparent"
              className="bookshelf-button"
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant='transparent'
              className="bookshelf-button bookshelf-button-primary"
              loading={isSubmitting}
            >
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </BookshelfModal>
  );
}