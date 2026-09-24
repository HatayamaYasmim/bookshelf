import { Center, Group, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface BooksEmptyStateProps {
  hasActiveFilters: boolean;
}

export function BooksEmptyState({ hasActiveFilters }: BooksEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <Center py={64}>
      <Group align="center" gap="sm">
        <Title order={3} fw={100} c="grey">
          {hasActiveFilters ? t('books.emptyState.filtered') : t('books.emptyState.empty')}
        </Title>
      </Group>
    </Center>
  );
}
