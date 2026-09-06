import {Title, Center, Group } from "@mantine/core";

interface BooksEmptyStateProps {
    hasActiveFilters: boolean;
    onClearFilters: () => void
}

export function BooksEmptyState({
    hasActiveFilters
}: BooksEmptyStateProps) {
    return (
        <Center py={64}>
            <Group align="center" gap="sm">
                <Title order={3} fw={100} c={'grey'}>{hasActiveFilters ? 'No books found' : 'Your bookshelf is empty'}</Title>
            </Group>
        </Center>
    )
}