import {
    Group,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';

import { IoSearchOutline } from 'react-icons/io5';
import { LuBookOpen } from 'react-icons/lu';

import type { Book } from '../../../types/book';
import type { Author } from '../../../types/author';

import { BooksTable } from './BooksTable';

interface BooksLibraryProps {
    books: Book[];
    authors: Author[];

    onStatusChange: (
        id: number,
        status: Book['status'],
    ) => void;
}

export function BooksLibrary({
    books,
    authors,
    onStatusChange,
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
                            placeholder="Status"
                            data={[
                                {
                                    value: 'ALL',
                                    label: 'All status',
                                },
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
                            data={authors.map((author) => ({
                                value: String(author.id),
                                label: author.name,
                            }))}
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

            </Stack>
        </Paper>
    );
}