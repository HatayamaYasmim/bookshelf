import {
    Center,
    Container,
    Loader,
    Paper,
    Stack,
    Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {
    createBook,
    getBooks,
    updateBookStatus,
} from '../../services/books';
import { createAuthor, getAuthors } from '../../services/authors';
import { BooksTable } from './components/BooksTable';
import { CreateBookModal } from './components/CreateBookModal';
import { notifications } from '@mantine/notifications';
import { CreateAuthorModal } from './components/CreateAuthorModal';
import { BooksHeader } from './components/BooksHeader';
import { BooksStats } from './components/BooksStats';
import { BooksLibrary } from './components/BooksLibrary';

export function BooksPage() {
    const queryClient = useQueryClient();

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
        data: books = [],
        isLoading: isBooksLoading,
        isError: isBooksError,
    } = useQuery({
        queryKey: ['books'],
        queryFn: getBooks,
    });

    const {
        data: authors = [],
        isLoading: isAuthorsLoading,
    } = useQuery({
        queryKey: ['authors'],
        queryFn: getAuthors,
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

                    <BooksStats books={books} />

                    <BooksLibrary
                        books={books}
                        authors={authors}
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