import {
    Badge,
    Menu,
    Table,
} from '@mantine/core';

import { IconCheck, IconChevronDown } from '@tabler/icons-react';

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
                    shadow="md"
                    width={160}
                    position="bottom-start"
                >
                    <Menu.Target>
                        <Badge
                            color={getStatusColor(book.status)}
                            variant="light"
                            size="lg"
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
                                },
                            }}
                        >
                            {getStatusLabel(book.status)}
                        </Badge>
                    </Menu.Target>

                    <Menu.Dropdown>
                        {statusOptions.map((status) => (
                            <Menu.Item
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
        </Table.Tr>
    ));

    return (
        <Table
            striped
            highlightOnHover
            verticalSpacing="md"
        >
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Author</Table.Th>
                    <Table.Th>Status</Table.Th>
                </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
                {rows}
            </Table.Tbody>
        </Table>
    );
}