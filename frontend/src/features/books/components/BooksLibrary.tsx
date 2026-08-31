import {
    Button,
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

import { IoSearchOutline } from 'react-icons/io5';
import { LuBookOpen } from 'react-icons/lu';

import type { Book, ReadingStatus } from '../../../types/book';
import type { Author } from '../../../types/author';

import { BooksTable } from './BooksTable';
import { GiMagicBroom } from 'react-icons/gi';
import { BooksEmptyState } from './BooksEmptyState';
import { bookshelfPaginationClassNames, bookshelfSelectClassNames } from '../../../styles/mantine';

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
                            classNames={bookshelfSelectClassNames}
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
                            classNames={bookshelfSelectClassNames}
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
                    <ScrollArea
                        h="clamp(280px, 42dvh, 520px)"
                        type="auto"
                        offsetScrollbars
                        className="bookshelf-table-scroll"
                    >
                        <BooksTable
                            books={books}
                            onStatusChange={onStatusChange}
                        />
                    </ScrollArea>
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
                        size='sm'
                        radius="xl"
                        classNames={bookshelfPaginationClassNames}
                    />
                </Group>

            </Stack>
        </Paper>
    );
}