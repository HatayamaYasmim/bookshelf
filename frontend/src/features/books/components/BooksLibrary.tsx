import {
    Button,
    Group,
    Pagination,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';

import { IoCloseOutline, IoSearchOutline } from 'react-icons/io5';
import { LuBookOpen } from 'react-icons/lu';

import type { Book, ReadingStatus } from '../../../types/book';
import type { Author } from '../../../types/author';

import { BooksTable } from './BooksTable';
import { GiMagicBroom } from 'react-icons/gi';
import { BooksEmptyState } from './BooksEmptyState';

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
    hasActiveFilters: boolean;
    onClearFilters: () => void;
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
}: BooksLibraryProps) {

    const filterSelectStyles = {
        input: {
            background: 'var(--bookshelf-background)',
            border: 'none',
            borderRadius: '999px',

            boxShadow:
                'inset 4px 4px 8px rgba(0,0,0,0.06), inset -4px -4px 8px rgba(255,255,255,0.5)',
        },

        dropdown: {
            background: 'rgba(255, 255, 255, 0.18)',

            backdropFilter: 'blur(5px) saturate(150%)',
            WebkitBackdropFilter: 'blur(5px) saturate(150%)',

            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: '16px',

            boxShadow:
                '0 8px 24px rgba(31,38,135,0.10)',
        },
    };

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
                            classNames={{
                                option: 'bookshelf-filter-option',
                            }}
                            styles={filterSelectStyles}
                        />

                        <Select
                            placeholder="Author"
                            searchable
                            clearable
                            classNames={{
                                option: 'bookshelf-filter-option',
                            }}
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
                            styles={filterSelectStyles}
                        />
                        {hasActiveFilters && (
                            <Button
                                variant="transparent"
                                size="sm"
                                leftSection={<GiMagicBroom size={16} />}
                                onClick={onClearFilters}
                                styles={{
                                    root: {
                                        border: 'none',
                                        borderRadius: '999px',
                                        boxShadow:
                                            'inset 4px 4px 8px rgba(0,0,0,0.06), inset -4px -4px 8px rgba(255,255,255,0.5)',
                                    },
                                }}
                            >
                                Clear filters
                            </Button>
                        )}
                    </Group>
                </Group>

                {books.length === 0 ? (
                    <BooksEmptyState
                        hasActiveFilters={hasActiveFilters}
                        onClearFilters={onClearFilters}
                    />
                ) : (
                    <BooksTable
                        books={books}
                        onStatusChange={onStatusChange}
                    />
                )}
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