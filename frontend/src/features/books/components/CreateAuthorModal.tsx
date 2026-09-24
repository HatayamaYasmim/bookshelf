import { Button, Group, Stack, TextInput } from '@mantine/core';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { GiMagicPalm } from 'react-icons/gi';

import type { CreateAuthorData } from '../../../services/authors';

import { BookshelfModal } from '../../../components/ui/BookshellfModal';

function createAuthorSchema(t: TFunction) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, t('books.authorForm.validation.nameRequired'))
      .max(150, t('books.authorForm.validation.nameMaxLength')),
  });
}

type CreateAuthorFormData = z.infer<ReturnType<typeof createAuthorSchema>>;

interface CreateAuthorModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAuthorData) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function CreateAuthorModal({
  opened,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateAuthorModalProps) {
  const { t } = useTranslation();

  const schema = createAuthorSchema(t);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAuthorFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  async function handleCreateAuthor(data: CreateAuthorFormData) {
    await onSubmit({
      name: data.name,
    });

    reset();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <BookshelfModal
      opened={opened}
      onClose={handleClose}
      title={t('books.authorForm.title')}
      icon={<GiMagicPalm size={21} color="var(--bookshelf-primary)" />}
    >
      <form onSubmit={handleSubmit(handleCreateAuthor)}>
        <Stack>
          <TextInput
            label={t('books.authorForm.nameLabel')}
            placeholder={t('books.authorForm.namePlaceholder')}
            withAsterisk
            error={errors.name?.message}
            {...register('name')}
            classNames={{
              input: 'bookshelf-input',
            }}
          />

          <Group justify="flex-end" mt="md">
            <Button
              type="button"
              variant="transparent"
              className="bookshelf-button"
              onClick={handleClose}
            >
              {t('common.cancel')}
            </Button>

            <Button
              type="submit"
              variant="transparent"
              loading={isSubmitting}
              className="bookshelf-button bookshelf-button-primary"
            >
              {t('common.save')}
            </Button>
          </Group>
        </Stack>
      </form>
    </BookshelfModal>
  );
}
