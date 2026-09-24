import { Button, Group, MultiSelect, Select, Stack, TextInput } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiBookAiFill } from 'react-icons/ri';
import { useEffect } from 'react';

import type { CreateBookData } from '../../../services/books';
import type { Author } from '../../../types/author';
import type { Book } from '../../../types/book';
import type { Genre } from '../../../types/genre';

import { BookshelfModal } from '../../../components/ui/BookshellfModal';
import { bookshelfSelectClassNames } from '../../../styles/mantine';

function createBookSchema(t: TFunction) {
  return z.object({
    title: z.string().trim().min(1, t('books.validation.titleRequired')),
    authorId: z.string().min(1, t('books.validation.authorRequired')),
    status: z.enum(['UNREAD', 'READING', 'READ']),
    genreIds: z.array(z.string()),
  });
}

type CreateBookFormData = z.infer<ReturnType<typeof createBookSchema>>;

interface BookFormModalProps {
  opened: boolean;
  onClose: () => void;
  authors: Author[];
  genres: Genre[];
  book?: Book | null;
  onSubmit: (data: CreateBookData) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function BookFormModal({
  opened,
  onClose,
  authors,
  genres,
  onSubmit,
  book,
  isSubmitting = false,
}: BookFormModalProps) {
  const { t } = useTranslation();

  const schema = createBookSchema(t);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      authorId: '',
      status: 'UNREAD',
      genreIds: [],
    },
  });

  async function handleCreateBook(data: CreateBookFormData) {
    await onSubmit({
      title: data.title,
      authorId: Number(data.authorId),
      status: data.status,
      genreIds: data.genreIds.map(Number),
    });

    reset();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  const isEditing = !!book;

  const genreOptions = genres.map((genre) => ({
    value: String(genre.id),
    label: genre.name,
  }));

  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        authorId: String(book.authorId),
        status: book.status,
        genreIds: book.genres.map((genre) => String(genre.id)),
      });

      return;
    }

    reset({
      title: '',
      authorId: '',
      status: 'UNREAD',
      genreIds: [],
    });
  }, [book, opened, reset]);

  return (
    <BookshelfModal
      opened={opened}
      onClose={handleClose}
      title={isEditing ? t('books.form.editTitle') : t('books.form.addTitle')}
      icon={<RiBookAiFill size={21} color="var(--bookshelf-primary)" />}
    >
      <form onSubmit={handleSubmit(handleCreateBook)}>
        <Stack>
          <TextInput
            classNames={{
              input: 'bookshelf-input',
            }}
            label={t('books.form.titleLabel')}
            placeholder={t('books.form.titlePlaceholder')}
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
                label={t('books.form.authorLabel')}
                placeholder={t('books.form.authorPlaceholder')}
                withAsterisk
                searchable
                data={authors.map((author) => ({
                  value: String(author.id),
                  label: author.name,
                }))}
                value={field.value}
                onChange={(value) => field.onChange(value ?? '')}
                error={errors.authorId?.message}
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label={t('books.form.statusLabel')}
                withAsterisk
                allowDeselect={false}
                classNames={bookshelfSelectClassNames}
                data={[
                  {
                    value: 'UNREAD',
                    label: t('books.status.unread'),
                  },
                  {
                    value: 'READING',
                    label: t('books.status.reading'),
                  },
                  {
                    value: 'READ',
                    label: t('books.status.read'),
                  },
                ]}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                error={errors.status?.message}
              />
            )}
          />

          <Controller
            name="genreIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label={t('books.form.genresLabel')}
                placeholder={t('books.form.genresPlaceholder')}
                data={genreOptions}
                value={field.value}
                onChange={field.onChange}
                searchable
                clearable
                classNames={bookshelfSelectClassNames}
              />
            )}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="transparent" className="bookshelf-button" onClick={handleClose}>
              {t('common.cancel')}
            </Button>

            <Button
              type="submit"
              variant="transparent"
              className="bookshelf-button bookshelf-button-primary"
              loading={isSubmitting}
            >
              {t('common.save')}
            </Button>
          </Group>
        </Stack>
      </form>
    </BookshelfModal>
  );
}
