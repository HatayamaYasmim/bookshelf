import {
    Group,
    Pagination,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';

import { IoSearchOutline } from 'react-icons/io5';
import { LuBookOpen } from 'react-icons/lu';

import type { Book, ReadingStatus } from '../../../types/book';
import type { Author } from '../../../types/author';

import { BooksTable } from './BooksTable';

interface BooksLibraryProps {
    books: Book[];
    authors: Author[];
    search: string;
    onSearchChange: (value: string) => void;
    status: ReadingStatus | null;
    onStatusFilterChange: (
        value: ReadingStatus | null,
    ) => void;
    authorId: number | null;
    onAuthorFilterChange: (
        value: number | null,
    ) => void;
    onStatusChange: (
        id: number,
        status: Book['status'],
    ) => void;
    page: number;
    totalPages: number;
    totalBooks: number;
    limit: number;
    onPageChange: (page: number) => void;
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
    onPageChange,
    onStatusChange,
    onSearchChange,
    onStatusFilterChange,
    onAuthorFilterChange,
}: BooksLibraryProps) {
    return (
        <Paper
            p="xl"
            radius="xl"
            className="neo-raised"
        >
            <Stack gap="xl">

                <Group
                    justify="space-between"
                    align="center"
                    wrap="wrap"
                >
                    <Group gap="xs">
                        <LuBookOpen
                            size={28}
                            color="var(--bookshelf-primary)"
                        />

                        <Title
                            order={2}
                            c="var(--bookshelf-primary)"
                            fw={700}
                        >
                            Library
                        </Title>
                    </Group>

                    <Group gap="md">
                        <TextInput
                            placeholder="Search books..."
                            leftSection={<IoSearchOutline size={18} />}
                            value={search}
                            onChange={(event) =>
                                onSearchChange(event.currentTarget.value)
                            }
                            w={260}
                            styles={{
                                input: {
                                    background: 'var(--bookshelf-background)',
                                    border: 'none',
                                    borderRadius: '999px',
                                    boxShadow:
                                        'inset 4px 4px 8px rgba(0,0,0,0.06), inset -4px -4px 8px rgba(255,255,255,0.5)',
                                },
                            }}
                        />

                        <Select
                            placeholder="All status"
                            clearable
                            value={status}
                            onChange={(value) =>
                                onStatusFilterChange(
                                    value as ReadingStatus | null,
                                )
                            }
                            data={[
                                {
                                    value: 'READ',
                                    label: 'Read',
                                },
                                {
                                    value: 'READING',
                                    label: 'Reading',
                                },
                                {
                                    value: 'UNREAD',
                                    label: 'Unread',
                                },
                            ]}

                            w={140}
                            styles={{
                                input: {
                                    background: 'var(--bookshelf-background)',
                                    border: 'none',
                                    borderRadius: '999px',
                                    boxShadow:
                                        'inset 4px 4px 8px rgba(0,0,0,0.06), inset -4px -4px 8px rgba(255,255,255,0.5)',
                                },
                            }}
                        />

                        <Select
                            placeholder="Author"
                            searchable
                            clearable
                            value={
                                authorId !== null
                                    ? String(authorId)
                                    : null
                            }
                            onChange={(value) =>
                                onAuthorFilterChange(
                                    value ? Number(value) : null,
                                )}
                            data={
                                authors.map((author) => ({
                                    value: String(author.id),
                                    label: author.name,
                                }))
                            }
                            w={180}
                            styles={{
                                input: {
                                    background: 'var(--bookshelf-background)',
                                    border: 'none',
                                    borderRadius: '999px',
                                    boxShadow:
                                        'inset 4px 4px 8px rgba(0,0,0,0.06), inset -4px -4px 8px rgba(255,255,255,0.5)',
                                },
                            }}
                        />
                    </Group>
                </Group>

                <BooksTable
                    books={books}
                    onStatusChange={onStatusChange}
                />
                <Group
                    justify="space-between"
                    align="center"
                    mt="md"
                >
                    <Text
                        size="sm"
                        c="dimmed"
                    >
                        Showing{' '}
                        {totalBooks === 0
                            ? 0
                            : (page - 1) * limit + 1}
                        {' - '}
                        {Math.min(
                            page * limit,
                            totalBooks,
                        )}{' '}
                        of {totalBooks} books
                    </Text>

                    <Pagination
                        value={page}
                        onChange={onPageChange}
                        total={totalPages}
                        radius="xl"
                    />
                </Group>

            </Stack>
        </Paper>
    );
}