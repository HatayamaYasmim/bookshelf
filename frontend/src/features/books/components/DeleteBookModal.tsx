import {
    Button,
    Group,
    Stack,
    Text,
} from '@mantine/core';

import { IconTrash } from '@tabler/icons-react';

import type { Book } from '../../../types/book';
import { BookshelfModal } from '../../../components/ui/BookshellfModal';

interface DeleteBookModalProps {
    opened: boolean;
    onClose: () => void;
    book: Book | null;
    onConfirm: () => Promise<void>;
    isDeleting: boolean;
}

export function DeleteBookModal({
    opened,
    onClose,
    book,
    onConfirm,
    isDeleting,
}: DeleteBookModalProps) {
    if (!book) {
        return null;
    }

    return (
        <BookshelfModal
            opened={opened}
            onClose={onClose}
            title="Delete book"
            icon={
                <IconTrash
                    size={20}
                    color="var(--bookshelf-primary)"
                />
            }
        >
            <Stack gap="lg">
                <Text>
                    Are you sure you want to delete{' '}
                    <strong>{book.title}</strong>?
                </Text>

                <Text
                    size="sm"
                    c="dimmed"
                >
                    This action cannot be undone.
                </Text>

                <Group justify="flex-end">
                    <Button
                        type="button"
                        variant="transparent"
                        className="bookshelf-button"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        color="var(--bookshelf-primary)"
                        radius="xl"
                        loading={isDeleting}
                        onClick={onConfirm}
                        className="bookshelf-button bookshelf-button-primary"
                    >
                        Delete
                    </Button>
                </Group>
            </Stack>
        </BookshelfModal>
    );
}