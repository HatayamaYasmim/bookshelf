import { Badge, Select, Table } from '@mantine/core';

import type { Book, ReadingStatus } from '../../../types/book';

interface BooksTableProps {
    books: Book[];

    onStatusChange: (
        id: number,
        status: ReadingStatus,
    ) => void;
}

function getStatusColor(status: Book['status']) {
    switch (status) {
        case 'READ':
            return 'green';

        case 'READING':
            return 'blue';

        case 'UNREAD':
            return 'gray';
    }
}

function getStatusLabel(status: Book['status']) {
    switch (status) {
        case 'READ':
            return 'read';

        case 'READING':
            return 'reading';

        case 'UNREAD':
            return 'unread';
    }
}

export function BooksTable({
    books,
    onStatusChange,
}: BooksTableProps) {
    const rows = books.map((book) => (
        <Table.Tr key={book.id}>
            <Table.Td>{book.title}</Table.Td>

            <Table.Td>{book.author.name}</Table.Td>

            <Table.Td>
                <Select
                    value={book.status}
                    allowDeselect={false}
                    w={130}
                    data={[
                        {
                            value: 'UNREAD',
                            label: 'Unread',
                        },
                        {
                            value: 'READING',
                            label: 'Reading',
                        },
                        {
                            value: 'READ',
                            label: 'Read',
                        },
                    ]}
                    onChange={(value) => {
                        if (value) {
                            onStatusChange(
                                book.id,
                                value as ReadingStatus,
                            );
                        }
                    }}
                />
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

            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}