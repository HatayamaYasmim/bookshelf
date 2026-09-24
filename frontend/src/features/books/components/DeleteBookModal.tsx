import { Button, Group, Stack, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import type { Book } from '../../../types/book';
import { BookshelfModal } from '../../../components/ui/BookshellfModal';

interface DeleteBookModalProps {
  opened: boolean;
  onClose: () => void;
  book: Book | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteBookModal({
  opened,
  onClose,
  book,
  onConfirm,
  isDeleting,
}: DeleteBookModalProps) {
  const { t } = useTranslation();

  if (!book) {
    return null;
  }

  return (
    <BookshelfModal
      opened={opened}
      onClose={onClose}
      title={t('books.delete.title')}
      icon={<IconTrash size={20} color="var(--bookshelf-primary)" />}
    >
      <Stack gap="lg">
        <Text>
          {t('books.delete.confirmation', {
            title: book.title,
          })}
        </Text>

        <Text size="sm" c="dimmed">
          {t('books.delete.warning')}
        </Text>

        <Group justify="flex-end">
          <Button
            type="button"
            variant="transparent"
            className="bookshelf-button"
            onClick={onClose}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>

          <Button
            type="button"
            color="var(--bookshelf-primary)"
            radius="xl"
            loading={isDeleting}
            onClick={onConfirm}
            className="bookshelf-button bookshelf-button-primary"
          >
            {t('common.delete')}
          </Button>
        </Group>
      </Stack>
    </BookshelfModal>
  );
}
