import {
    Center,
    Container,
    Stack,
    Text,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import {
    keepPreviousData,
    useQuery,
} from '@tanstack/react-query';

import {
    getBooks,
    getBooksStats,
} from '../../services/books';
import { BookFormModal } from './components/BookFormModal';

import { CreateAuthorModal } from './components/CreateAuthorModal';
import { BooksHeader } from './components/BooksHeader';
import { BooksStats } from './components/BooksStats';
import { BooksLibrary } from './components/BooksLibrary';
import { useState } from 'react';
import type { Book, ReadingStatus } from '../../types/book';
import { BooksStatsSkeleton } from './components/BooksStatsSkeleton';
import { DeleteBookModal } from './components/DeleteBookModal';
import { useBookMutations } from '../hooks/useBookMutations';
import { useAuthorMutations } from '../hooks/useAuthorMutations';
import { getAuthors } from '../../services/authors';

export function BooksPage() {
    const [search, setSearch] = useState('')
    const [status, setStatus] =
        useState<ReadingStatus | null>(null);
    const [authorId, setAuthorId] =
        useState<number | null>(null);
    const [debouncedSearch] = useDebouncedValue(search, 400)

    const [selectedBook, setSelectedBook] =
        useState<Book | null>(null);

    const [bookToDelete, setBookToDelete] =
        useState<Book | null>(null);

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
        editModalOpened,
        {
            open: openEditModal,
            close: closeEditModal,
        },
    ] = useDisclosure(false);

    const [
        deleteModalOpened,
        {
            open: openDeleteModal,
            close: closeDeleteModal,
        },
    ] = useDisclosure(false);

    const [
        createAuthorModalOpened,
        {
            open: openCreateAuthorModal,
            close: closeCreateAuthorModal,
        },
    ] = useDisclosure(false);

    const hasActiveFilters = search.trim() !== '' || status !== null || authorId !== null;

    // =========================
    // Queries
    // =========================

    const booksQueryParams = {
        page,
        limit,
        search: debouncedSearch || undefined,
        status: status ?? undefined,
        authorId: authorId ?? undefined,
    };

    const {
        data: booksResponse,
        isLoading: isBooksLoading,
        isFetching: isBooksFetching,
        isError: isBooksError,
    } = useQuery({
        queryKey: ['books', booksQueryParams],
        queryFn: () => getBooks(booksQueryParams),
        placeholderData: keepPreviousData,
    });

    const books = booksResponse?.data ?? [];
    const meta = booksResponse?.meta;

    const {
        data: authors = [],
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

    const {
        createBookMutation,
        updateBookMutation,
        deleteBookMutation,
        updateStatusMutation,
    } = useBookMutations();

    const {
        createAuthorMutation,
    } = useAuthorMutations();

    // =========================
    // Estados da página
    // =========================

    if (isBooksError && !booksResponse) {
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

    function handleClearFilters() {
        setSearch('');
        setStatus(null);
        setAuthorId(null);
        setPage(1);
    }

    function handleEditBook(book: Book) {
        setSelectedBook(book);
        openEditModal();
    }

    function handleDeleteBook(book: Book) {
        setBookToDelete(book);
        openDeleteModal();
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

                    {isBooksStatsLoading ? (
                        <BooksStatsSkeleton />
                    ) : booksStats ? (
                        <BooksStats stats={booksStats} />
                    ) : null}

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
                        hasActiveFilters={hasActiveFilters}
                        onClearFilters={handleClearFilters}
                        isLoading={isBooksLoading}
                        isFetching={isBooksFetching}
                        onStatusChange={(id, status) => {
                            updateStatusMutation.mutate({
                                id,
                                status,
                            });
                        }}
                        onEdit={handleEditBook}
                        onDelete={handleDeleteBook}

                    />

                </Stack>

                <BookFormModal
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

                <DeleteBookModal
                    opened={deleteModalOpened}
                    onClose={() => {
                        closeDeleteModal()
                        setBookToDelete(null)
                    }}
                    book={bookToDelete}
                    isDeleting={
                        deleteBookMutation.isPending
                    }
                    onConfirm={async () => {
                        if (!bookToDelete) {
                            return;
                        }

                        await deleteBookMutation.mutateAsync(
                            bookToDelete.id,
                        );
                        closeDeleteModal();
                        setBookToDelete(null);

                        if (books.length === 1 && page > 1) {
                            setPage((currentPage) =>
                                currentPage - 1,
                            );
                        }
                    }}
                />

                <BookFormModal
                    opened={editModalOpened}
                    onClose={() => {
                        closeEditModal();
                        setSelectedBook(null);
                    }}
                    authors={authors}
                    book={selectedBook}
                    isSubmitting={
                        updateBookMutation.isPending
                    }
                    onSubmit={async (data) => {
                        if (!selectedBook) {
                            return;
                        }

                        await updateBookMutation.mutateAsync({
                            id: selectedBook.id,
                            data,
                        });
                        closeEditModal();
                        setSelectedBook(null);
                    }}
                />
            </Container>
        </>
    );
}