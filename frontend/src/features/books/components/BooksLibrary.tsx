import {
  Button,
  Grid,
  Group,
  Pagination,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';

import { useTranslation } from 'react-i18next';

import { IoSearchOutline } from 'react-icons/io5';
import { LuBookOpen } from 'react-icons/lu';
import { GiMagicBroom, GiMagicPalm } from 'react-icons/gi';
import { RiBookAiFill } from 'react-icons/ri';

import type { Book, ReadingStatus } from '../../../types/book';
import type { Author } from '../../../types/author';

import { BooksTable } from './BooksTable';
import { BooksEmptyState } from './BooksEmptyState';
import { BooksTableSkeleton } from './BooksTableSkeleton';

import { bookshelfPaginationClassNames, bookshelfSelectClassNames } from '../../../styles/mantine';

interface BooksLibraryProps {
  books: Book[];
  authors: Author[];
  search: string;
  onSearchChange: (value: string) => void;
  status: ReadingStatus | null;
  onStatusFilterChange: (value: ReadingStatus | null) => void;
  authorId: number | null;
  onAuthorFilterChange: (value: number | null) => void;
  onStatusChange: (id: number, status: Book['status']) => void;
  page: number;
  totalPages: number;
  totalBooks: number;
  limit: number;
  onPageChange: (page: number) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  isLoading: boolean;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onAddBook: () => void;
  onAddAuthor: () => void;
}

export function BooksLibrary({
  books,
  authors,
  search,
  status,
  authorId,
  page,
  totalPages,
  totalBooks,
  limit,
  hasActiveFilters,
  onClearFilters,
  onPageChange,
  onStatusChange,
  onSearchChange,
  onStatusFilterChange,
  onAuthorFilterChange,
  isLoading,
  onEdit,
  onDelete,
  onAddBook,
  onAddAuthor,
}: BooksLibraryProps) {
  const { t } = useTranslation();

  const firstBook = totalBooks === 0 ? 0 : (page - 1) * limit + 1;
  const lastBook = Math.min(page * limit, totalBooks);

  return (
    <Paper p="xl" radius="xl" className="neo-raised">
      <Stack gap="xl">
        <Group justify="space-between" align="center" wrap="wrap" gap="md">
          <Group gap="xs">
            <LuBookOpen size={28} color="var(--bookshelf-primary)" />

            <Title order={2} c="var(--bookshelf-primary)" fw={700}>
              {t('books.library.title')}
            </Title>
          </Group>

          <Group gap="md">
            <Button
              variant="subtle"
              leftSection={<GiMagicPalm size={18} />}
              onClick={onAddAuthor}
              radius="lg"
              className="bookshelf-button bookshelf-button-primary bookshelf-add-author-button"
            >
              {t('books.library.addAuthor')}
            </Button>

            <Button
              variant="subtle"
              leftSection={<RiBookAiFill size={18} />}
              onClick={onAddBook}
              radius="lg"
              className="bookshelf-button bookshelf-button-primary bookshelf-add-author-button"
            >
              {t('books.library.addBook')}
            </Button>
          </Group>
        </Group>

        <Grid gap="md" align="center">
          <Grid.Col
            span={{
              base: 12,
              sm: 6,
              md: hasActiveFilters ? 4 : 5,
            }}
          >
            <TextInput
              placeholder={t('books.library.searchPlaceholder')}
              leftSection={<IoSearchOutline size={18} />}
              value={search}
              onChange={(event) => onSearchChange(event.currentTarget.value)}
              classNames={{
                input: 'bookshelf-input bookshelf-search-input',
              }}
            />
          </Grid.Col>

          <Grid.Col
            span={{
              base: 12,
              sm: 6,
              md: hasActiveFilters ? 2 : 3,
            }}
          >
            <Select
              placeholder={t('books.library.allStatuses')}
              clearable
              value={status}
              onChange={(value) => onStatusFilterChange(value as ReadingStatus | null)}
              data={[
                {
                  value: 'READ',
                  label: t('books.status.read'),
                },
                {
                  value: 'READING',
                  label: t('books.status.reading'),
                },
                {
                  value: 'UNREAD',
                  label: t('books.status.unread'),
                },
              ]}
              classNames={bookshelfSelectClassNames}
            />
          </Grid.Col>

          <Grid.Col
            span={{
              base: 12,
              sm: 6,
              md: hasActiveFilters ? 3 : 4,
            }}
          >
            <Select
              placeholder={t('books.library.authorPlaceholder')}
              searchable
              clearable
              value={authorId !== null ? String(authorId) : null}
              onChange={(value) => onAuthorFilterChange(value ? Number(value) : null)}
              data={authors.map((author) => ({
                value: String(author.id),
                label: author.name,
              }))}
              classNames={bookshelfSelectClassNames}
            />
          </Grid.Col>

          {hasActiveFilters && (
            <Grid.Col
              span={{
                base: 12,
                sm: 6,
                md: 3,
              }}
            >
              <Button
                fullWidth
                variant="transparent"
                size="sm"
                leftSection={<GiMagicBroom size={16} />}
                onClick={onClearFilters}
                className="bookshelf-clear-filters"
              >
                {t('books.library.clearFilters')}
              </Button>
            </Grid.Col>
          )}
        </Grid>

        {!isLoading && books.length === 0 ? (
          <BooksEmptyState hasActiveFilters={hasActiveFilters} />
        ) : (
          <ScrollArea className="bookshelf-table-scroll" type="auto" offsetScrollbars>
            {isLoading ? (
              <BooksTableSkeleton />
            ) : (
              <BooksTable
                books={books}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </ScrollArea>
        )}

        <Group justify="space-between" align="center" mt="md">
          <Text size="sm" c="dimmed">
            {t('books.library.showing', {
              from: firstBook,
              to: lastBook,
              count: totalBooks,
            })}
          </Text>

          <Pagination
            value={page}
            onChange={onPageChange}
            total={totalPages}
            size="sm"
            radius="xl"
            classNames={bookshelfPaginationClassNames}
          />
        </Group>
      </Stack>
    </Paper>
  );
}
