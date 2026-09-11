import { notifications } from '@mantine/notifications';

import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

import {
    createBook,
    deleteBook,
    updateBook,
    updateBookStatus,
} from '../../../services/books';

export function useBookMutations() {
    const queryClient = useQueryClient();

    function invalidateBookData() {
        return Promise.all([

            queryClient.invalidateQueries({
                queryKey: ['books'],
            }),
            queryClient.invalidateQueries({
                queryKey: ['dashboard', 'reading'],
            }),
        ])
    }

    const updateStatusMutation = useMutation({
        mutationFn: updateBookStatus,

        onSuccess: async () => {
            await invalidateBookData();

            notifications.show({
                title: 'Status changed',
                message:
                    "The book's status has been successfully changed.",
                color: 'green',
            });
        },

        onError: () => {
            notifications.show({
                title: 'Error',
                message:
                    "It was not possible to change the book's status.",
                color: 'red',
            });
        },
    });

    const createBookMutation = useMutation({
        mutationFn: createBook,

        onSuccess: async () => {
            await invalidateBookData();

            notifications.show({
                title: 'Book registered',
                message:
                    'The book has been added to your bookshelf.',
                color: 'green',
            });
        },

        onError: () => {
            notifications.show({
                title: 'Error',
                message:
                    'It was not possible to register the book.',
                color: 'red',
            });
        },
    });

    const deleteBookMutation = useMutation({
        mutationFn: deleteBook,

        onSuccess: async () => {
            await invalidateBookData();

            notifications.show({
                title: 'Book deleted',
                message:
                    'The book has been successfully deleted.',
                color: 'green',
            });
        },

        onError: () => {
            notifications.show({
                title: 'Error',
                message:
                    'It was not possible to delete the book.',
                color: 'red',
            });
        },
    });

    const updateBookMutation = useMutation({
        mutationFn: updateBook,

        onSuccess: async () => {
            await invalidateBookData();

            notifications.show({
                title: 'Book updated',
                message:
                    'The book has been successfully updated.',
                color: 'green',
            });
        },

        onError: () => {
            notifications.show({
                title: 'Error',
                message:
                    'It was not possible to update the book.',
                color: 'red',
            });
        },
    });

    return {
        createBookMutation,
        updateBookMutation,
        deleteBookMutation,
        updateStatusMutation,
    };
}