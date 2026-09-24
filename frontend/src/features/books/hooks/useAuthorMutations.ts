import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { createAuthor } from '../../../services/authors';

export function useAuthorMutations() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const createAuthorMutation = useMutation({
    mutationFn: createAuthor,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['authors'],
      });

      notifications.show({
        title: t('books.authorNotifications.successTitle'),
        message: t('books.authorNotifications.successMessage'),
        color: 'green',
      });
    },

    onError: () => {
      notifications.show({
        title: t('common.error'),
        message: t('books.authorNotifications.errorMessage'),
        color: 'red',
      });
    },
  });

  return {
    createAuthorMutation,
  };
}
