import {
    ActionIcon,
    Badge,
    Group,
    Menu,
    Table,
} from '@mantine/core';

import { IconCheck, IconChevronDown, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';

import type {
    Book,
    ReadingStatus,
} from '../../../types/book';

interface BooksTableProps {
    books: Book[];

    onStatusChange: (
        id: number,
        status: ReadingStatus,
    ) => void;

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

function getStatusLabel(status: ReadingStatus) {
    switch (status) {
        case 'READ':
            return 'Read';

        case 'READING':
            return 'Reading';

        case 'UNREAD':
            return 'Unread';
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

export function BooksTable({
    books,
    onStatusChange,
    onEdit,
    onDelete
}: BooksTableProps) {
    function handleStatusChange(
        book: Book,
        status: ReadingStatus,
    ) {
        if (book.status === status) {
            return;
        }

        onStatusChange(book.id, status);
    }

    const statusOptions: ReadingStatus[] = [
        'READ',
        'READING',
        'UNREAD',
    ];

    const rows = books.map((book) => (
        <Table.Tr key={book.id}>
            <Table.Td fw={500}>
                {book.title}
            </Table.Td>

            <Table.Td>
                {book.author.name}
            </Table.Td>

            <Table.Td>
                <Menu
                    shadow="sm"
                    width={160}
                    position="bottom-start"
                >
                    <Menu.Target>
                        <Badge
                            color={getStatusColor(book.status)}
                            variant="transparent"
                            size="md"
                            radius="xl"
                            leftSection={
                                <span
                                    style={{
                                        width: 7,
                                        height: 7,
                                        borderRadius: '50%',
                                        backgroundColor:
                                            getStatusDotColor(book.status),
                                        display: 'block',
                                    }}
                                />
                            }
                            rightSection={
                                <IconChevronDown size={12} />
                            }
                            styles={{
                                root: {
                                    cursor: 'pointer',
                                    textTransform: 'none',
                                    background: 'var(--bookshelf-background)',
                                    border: 'none',
                                    borderRadius: '999px',
                                    color: getStatusDotColor(book.status),
                                    boxShadow:
                                        'inset 3px 3px 6px rgba(0,0,0,0.05), inset -3px -3px 6px rgba(255,255,255,0.5)',
                                },
                            }}
                        >
                            {getStatusLabel(book.status)}
                        </Badge>
                    </Menu.Target>

                    <Menu.Dropdown
                        style={{
                            background: 'rgba(255, 255, 255, 0.18)',
                            backdropFilter: 'blur(3px) saturate(150%)',
                            WebkitBackdropFilter: 'blur(3px) saturate(150%)',
                            border: '1px solid rgba(255, 255, 255, 0.35)',
                            borderRadius: '16px',
                            boxShadow:
                                '0 8px 24px rgba(31, 38, 135, 0.10)',
                        }}
                    >
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
                                            backgroundColor:
                                                getStatusDotColor(status),
                                        }}
                                    />
                                }
                                rightSection={
                                    book.status === status
                                        ? <IconCheck size={15} />
                                        : undefined
                                }
                                onClick={() =>
                                    handleStatusChange(
                                        book,
                                        status,
                                    )
                                }
                            >
                                {getStatusLabel(status)}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
            <Table.Td ta="center">
                <Group
                    gap="xs"
                    justify="center"
                    wrap="nowrap"
                >
                    <ActionIcon
                        variant="transparent"
                        radius="xl"
                        size="lg"
                        className="bookshelf-grid-action"
                        aria-label={`Edit ${book.title}`}
                        onClick={() => onEdit(book)}
                    >
                        <IconEdit size={17} />
                    </ActionIcon>

                    <ActionIcon
                        variant="transparent"
                        radius="xl"
                        size="lg"
                        className="bookshelf-grid-action bookshelf-grid-action-danger"
                        aria-label={`Delete ${book.title}`}
                        onClick={() => onDelete(book)}
                    >
                        <IconTrash size={17} />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table
            highlightOnHover
            verticalSpacing="sm"
             miw={480}
        >
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Author</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th ta="center" w={80}>
                        Actions
                    </Table.Th>
                </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
                {rows}
            </Table.Tbody>
        </Table>
    );
}