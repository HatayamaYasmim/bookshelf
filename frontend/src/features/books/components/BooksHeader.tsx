import {
    Box,
    Button,
    Container,
    Group,
    Text,
} from '@mantine/core';

import { GiSpellBook, GiMagicPalm } from 'react-icons/gi';
import { RiBookAiFill } from 'react-icons/ri';

interface BooksHeaderProps {
    onAddBook: () => void;
    onAddAuthor: () => void;
}

export function BooksHeader({
    onAddBook,
    onAddAuthor,
}: BooksHeaderProps) {
    return (
        <Box
            component="header"
            py="md"
            style={{
                background: 'var(--bookshelf-background)',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.06)',
            }}
        >
            <Container size="xl">
                <Group
                    justify="space-between"
                    wrap="wrap"
                    gap="md"
                >
                    <Group gap="xl">
                        <Group gap="xs">
                            <GiSpellBook
                                size={30}
                                color="var(--bookshelf-primary)"
                            />

                            <Text
                                size="xl"
                                fw={900}
                                c="var(--bookshelf-primary)"
                            >
                                bookshelf
                            </Text>
                        </Group>

                        <Text
                            fw={200}
                            c="var(--bookshelf-primary)"
                            style={{
                                cursor: 'default',
                                borderBottom: '3px solid var(--bookshelf-primary)',
                                paddingBottom: 0,
                            }}
                        >
                            Library
                        </Text>
                    </Group>

                    {/* Ações */}
                    <Group gap="md">
                        <Button
                            variant="subtle"
                            leftSection={<GiMagicPalm size={18} />}
                            onClick={onAddAuthor}
                            radius={'lg'}
                            styles={{
                                root: {
                                    color: 'var(--bookshelf-primary)',
                                    background: 'var(--bookshelf-background)',
                                    boxShadow:
                                        '6px 6px 12px rgba(0, 0, 0, 0.08), -6px -6px 12px rgba(255, 255, 255, 0.6)',
                                },
                            }}
                        >
                            Add author
                        </Button>

                        <Button
                            leftSection={<RiBookAiFill size={18} />}
                            onClick={onAddBook}
                            radius={'lg'}
                            styles={{
                                root: {
                                    background: 'var(--bookshelf-primary)',
                                    boxShadow:
                                        '5px 5px 12px rgba(99, 102, 241, 0.28)',
                                },
                            }}
                        >
                            Add book
                        </Button>
                    </Group>
                </Group>
            </Container>
        </Box>
    );
}