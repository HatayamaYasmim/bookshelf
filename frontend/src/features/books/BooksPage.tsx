import {
    Button,
    Center,
    Container,
    Group,
    Loader,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { RiBookAiFill } from "react-icons/ri";
import { GiSpellBook } from "react-icons/gi";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBooks, updateBookStatus } from '../../services/books';
import { BooksTable } from './components/BooksTable';



export function BooksPage() {
    const {
        data: books = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['books'],
        queryFn: getBooks,
    });

    if (isLoading) {
        return (
            <Center h="100vh">
                <Loader />
            </Center>
        );
    }

    if (isError) {
        return (
            <Center h="100vh">
                <Text c="red">
                    Não foi possível carregar os livros.
                </Text>
            </Center>
        );
    }

    const queryClient = useQueryClient();
    const updateStatusMutation = useMutation({
        mutationFn: updateBookStatus,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['books'],
            });
        },
    });

    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                <Group justify="space-between">
                    <div>
                        <Title order={1}>
                            <GiSpellBook /> bookshelf
                        </Title>

                        <Text c="dimmed" mt={4}>
                            Gerencie os livros da sua coleção
                        </Text>
                    </div>

                    <Button
                        leftSection={<RiBookAiFill />}
                    >
                        add book
                    </Button>
                </Group>

                <Paper
                    withBorder
                    radius="md"
                    p="md"
                >
                    <BooksTable
                        books={books}
                        onStatusChange={(id, status) => {
                            updateStatusMutation.mutate({
                                id,
                                status,
                            });
                        }}
                    />
                </Paper>
            </Stack>
        </Container>
    );
}