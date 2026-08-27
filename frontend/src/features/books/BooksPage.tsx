import {
    Center,
    Container,
    Loader,
    Paper,
    Stack,
    Text,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {
    createBook,
    getBooks,
    getBooksStats,
    updateBookStatus,
} from '../../services/books';
import { createAuthor, getAuthors } from '../../services/authors';
import { CreateBookModal } from './components/CreateBookModal';
import { notifications } from '@mantine/notifications';
import { CreateAuthorModal } from './components/CreateAuthorModal';
import { BooksHeader } from './components/BooksHeader';
import { BooksStats } from './components/BooksStats';
import { BooksLibrary } from './components/BooksLibrary';
import { useState } from 'react';
import type { ReadingStatus } from '../../types/book';

export function BooksPage() {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState('')
    const [status, setStatus] =
        useState<ReadingStatus | null>(null);
    const [authorId, setAuthorId] =
        useState<number | null>(null);
    const [debouncedSearch] = useDebouncedValue(search, 400)

    const [page, setPage] = useState(1);
    const limit = 10;

    const [
        createModalOpened,
        {
            open: openCreateModal,
            close: closeCreateModal,
        },
    ] = useDisclosure(false);

    const [
        createAuthorModalOpened,
        {
            open: openCreateAuthorModal,
            close: closeCreateAuthorModal,
        },
    ] = useDisclosure(false);

    // =========================
    // Queries
    // =========================

    const {
        data: booksResponse,
        isLoading: isBooksLoading,
        isError: isBooksError,
    } = useQuery({
        queryKey: ['books', 1, 10, debouncedSearch, status, authorId],
        queryFn: () => getBooks({ page: page, limit: limit, search: debouncedSearch || undefined, status: status ?? undefined, authorId: authorId ?? undefined, })
    });

    const books = booksResponse?.data ?? [];
    const meta = booksResponse?.meta;

    const {
        data: authors = [],
        isLoading: isAuthorsLoading,
    } = useQuery({
        queryKey: ['authors'],
        queryFn: getAuthors,
    });

    const {
        data: booksStats,
        isLoading: isBooksStatsLoading,
    } = useQuery({
        queryKey: ['books', 'stats'],
        queryFn: getBooksStats,
    });

    // =========================
    // Mutations
    // =========================

    const updateStatusMutation = useMutation({
        mutationFn: updateBookStatus,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['books'],
            });

            notifications.show({
                title: 'Status changed',
                message: `The book's status has been successfully changed.`,
                color: 'green',
            });
        },

        onError: () => {
            notifications.show({
                title: 'Error',
                message: `It was not possible to change the book's status.`,
                color: 'red',
            });
        },
    });

    const createBookMutation = useMutation({
        mutationFn: createBook,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['books'],
            });

            notifications.show({
                title: 'Book registered',
                message: 'The book has been added to your bookshelf.',
                color: 'green',
            });
        },

        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'It was not possible to register the book.',
                color: 'red',
            });
        },
    });

    const createAuthorMutation = useMutation({
        mutationFn: createAuthor,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['authors'],
            });

            notifications.show({
                title: 'Registered author',
                message: 'The author has been successfully registered.',
                color: 'green',
            });
        },

        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'It was not possible to register the author.',
                color: 'red',
            });
        },
    });

    // =========================
    // Estados da página
    // =========================

    if (isBooksLoading) {
        return (
            <Center h="100vh">
                <Loader />
            </Center>
        );
    }

    if (isBooksError) {
        return (
            <Center h="100vh">
                <Text c="red">
                    It was not possible to load the books.
                </Text>
            </Center>
        );
    }

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
    }

    function handleStatusFilterChange(
        value: ReadingStatus | null,
    ) {
        setStatus(value);
        setPage(1);
    }

    function handleAuthorFilterChange(
        value: number | null,
    ) {
        setAuthorId(value);
        setPage(1);
    }

    // =========================
    // Render
    // =========================

    return (
        <>
            <BooksHeader
                onAddBook={openCreateModal}
                onAddAuthor={openCreateAuthorModal}
            />
            <Container size="xl" py="xl">
                <Stack gap="xl">

                    {booksStats && (
                        <BooksStats stats={booksStats} />
                    )}

                    <BooksLibrary
                        books={books}
                        authors={authors}
                        search={search}
                        onSearchChange={handleSearchChange}
                        status={status}
                        onStatusFilterChange={handleStatusFilterChange}
                        authorId={authorId}
                        onAuthorFilterChange={handleAuthorFilterChange}
                        page={page}
                        limit={limit}
                        totalPages={meta?.totalPages ?? 1}
                        totalBooks={meta?.total ?? 0}
                        onPageChange={setPage}
                        onStatusChange={(id, status) => {
                            updateStatusMutation.mutate({
                                id,
                                status,
                            });
                        }}
                    />

                </Stack>

                <CreateBookModal
                    opened={createModalOpened}
                    onClose={closeCreateModal}
                    authors={authors}
                    onSubmit={(data) =>
                        createBookMutation.mutateAsync(data)
                    }
                    isSubmitting={createBookMutation.isPending}
                />

                <CreateAuthorModal
                    opened={createAuthorModalOpened}
                    onClose={closeCreateAuthorModal}
                    onSubmit={(data) =>
                        createAuthorMutation.mutateAsync(data)
                    }
                    isSubmitting={createAuthorMutation.isPending}
                />
            </Container>
        </>
    );
}