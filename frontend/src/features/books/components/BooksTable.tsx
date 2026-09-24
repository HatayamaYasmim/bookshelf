import { ActionIcon, Badge, Group, Menu, Table, Text } from '@mantine/core';
import { IconCheck, IconChevronDown, IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import type { Book, ReadingStatus } from '../../../types/book';

interface BooksTableProps {
  books: Book[];
  onStatusChange: (id: number, status: ReadingStatus) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

function getStatusColor(status: ReadingStatus) {
  switch (status) {
    case 'READ':
      return 'green';

    case 'READING':
      return 'blue';

    case 'UNREAD':
      return 'gray';
  }
}

function getStatusDotColor(status: ReadingStatus) {
  switch (status) {
    case 'READ':
      return '#2f9e44';

    case 'READING':
      return '#1971c2';

    case 'UNREAD':
      return '#868e96';
  }
}

export function BooksTable({ books, onStatusChange, onEdit, onDelete }: BooksTableProps) {
  const { t } = useTranslation();

  const statusOptions: ReadingStatus[] = ['READ', 'READING', 'UNREAD'];

  function getStatusLabel(status: ReadingStatus) {
    switch (status) {
      case 'READ':
        return t('books.status.read');

      case 'READING':
        return t('books.status.reading');

      case 'UNREAD':
        return t('books.status.unread');
    }
  }

  function handleStatusChange(book: Book, status: ReadingStatus) {
    onStatusChange(book.id, status);
  }

  const rows = books.map((book) => (
    <Table.Tr key={book.id}>
      <Table.Td fw={500}>{book.title}</Table.Td>

      <Table.Td>{book.author.name}</Table.Td>

      <Table.Td>
        {book.genres.length > 0 ? (
          <Group gap={6} wrap="wrap">
            {book.genres.map((genre) => (
              <Badge
                key={genre.id}
                variant="outline"
                radius="xl"
                className="bookshelf-badge"
                styles={{
                  root: {
                    border: 'none',
                    textTransform: 'none',
                  },
                }}
              >
                {genre.name}
              </Badge>
            ))}
          </Group>
        ) : (
          <Text size="sm" c="dimmed">
            —
          </Text>
        )}
      </Table.Td>

      <Table.Td>
        <Menu shadow="sm" width={160} position="bottom-start">
          <Menu.Target>
            <Badge
              color={getStatusColor(book.status)}
              variant="transparent"
              size="md"
              radius="xl"
              className="bookshelf-badge"
              leftSection={
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: getStatusDotColor(book.status),
                    display: 'block',
                  }}
                />
              }
              rightSection={<IconChevronDown size={12} />}
              styles={{
                root: {
                  cursor: 'pointer',
                  textTransform: 'none',
                  color: getStatusDotColor(book.status),
                },
              }}
            >
              {getStatusLabel(book.status)}
            </Badge>
          </Menu.Target>

          <Menu.Dropdown className="bookshelf-menu-dropdown">
            {statusOptions.map((status) => (
              <Menu.Item
                className="bookshelf-glass-item"
                key={status}
                leftSection={
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: getStatusDotColor(status),
                    }}
                  />
                }
                rightSection={book.status === status ? <IconCheck size={15} /> : undefined}
                onClick={() => handleStatusChange(book, status)}
              >
                {getStatusLabel(status)}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Table.Td>

      <Table.Td ta="center">
        <Group gap="xs" justify="center" wrap="nowrap">
          <ActionIcon
            variant="transparent"
            radius="xl"
            size="lg"
            className="bookshelf-grid-action"
            aria-label={t('books.table.editAriaLabel', { title: book.title })}
            onClick={() => onEdit(book)}
          >
            <IconEdit size={17} />
          </ActionIcon>

          <ActionIcon
            variant="transparent"
            radius="xl"
            size="lg"
            className="bookshelf-grid-action bookshelf-grid-action-danger"
            aria-label={t('books.table.deleteAriaLabel', { title: book.title })}
            onClick={() => onDelete(book)}
          >
            <IconTrash size={17} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover verticalSpacing="sm" miw={480}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{t('books.table.title')}</Table.Th>
          <Table.Th>{t('books.table.author')}</Table.Th>
          <Table.Th>{t('books.table.genres')}</Table.Th>
          <Table.Th>{t('books.table.status')}</Table.Th>
          <Table.Th ta="center" w={80}>
            {t('books.table.actions')}
          </Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
