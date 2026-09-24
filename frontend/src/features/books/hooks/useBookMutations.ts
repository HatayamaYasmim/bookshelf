import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { createBook, deleteBook, updateBook, updateBookStatus } from '../../../services/books';

export function useBookMutations() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  function invalidateBookData() {
    return Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['books'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'reading'],
      }),
    ]);
  }

  const updateStatusMutation = useMutation({
    mutationFn: updateBookStatus,

    onSuccess: async () => {
      await invalidateBookData();

      notifications.show({
        title: t('books.notifications.statusUpdatedTitle'),
        message: t('books.notifications.statusUpdatedMessage'),
        color: 'green',
      });
    },

    onError: () => {
      notifications.show({
        title: t('common.error'),
        message: t('books.notifications.statusUpdateError'),
        color: 'red',
      });
    },
  });

  const createBookMutation = useMutation({
    mutationFn: createBook,

    onSuccess: async () => {
      await invalidateBookData();

      notifications.show({
        title: t('books.notifications.createdTitle'),
        message: t('books.notifications.createdMessage'),
        color: 'green',
      });
    },

    onError: () => {
      notifications.show({
        title: t('common.error'),
        message: t('books.notifications.createError'),
        color: 'red',
      });
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,

    onSuccess: async () => {
      await invalidateBookData();

      notifications.show({
        title: t('books.notifications.deletedTitle'),
        message: t('books.notifications.deletedMessage'),
        color: 'green',
      });
    },

    onError: () => {
      notifications.show({
        title: t('common.error'),
        message: t('books.notifications.deleteError'),
        color: 'red',
      });
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: updateBook,

    onSuccess: async () => {
      await invalidateBookData();

      notifications.show({
        title: t('books.notifications.updatedTitle'),
        message: t('books.notifications.updatedMessage'),
        color: 'green',
      });
    },

    onError: () => {
      notifications.show({
        title: t('common.error'),
        message: t('books.notifications.updateError'),
        color: 'red',
      });
    },
  });

  return {
    createBookMutation,
    updateBookMutation,
    deleteBookMutation,
    updateStatusMutation,
  };
}
