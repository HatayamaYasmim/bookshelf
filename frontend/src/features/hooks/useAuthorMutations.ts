import { notifications } from '@mantine/notifications';

import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { createAuthor } from '../../services/authors';


export function useAuthorMutations() {
    const queryClient = useQueryClient();

    const createAuthorMutation = useMutation({
        mutationFn: createAuthor,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['authors'],
            });

            notifications.show({
                title: 'Registered author',
                message:
                    'The author has been successfully registered.',
                color: 'green',
            });
        },

        onError: () => {
            notifications.show({
                title: 'Error',
                message:
                    'It was not possible to register the author.',
                color: 'red',
            });
        },
    });

    return {
        createAuthorMutation,
    };
}