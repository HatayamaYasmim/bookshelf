import {
    Center,
    Group,
    Paper,
    RingProgress,
    Stack,
    Text,
    Title,
} from '@mantine/core';

import { IconChartDonut } from '@tabler/icons-react';

import type {
    FavoriteGenre,
} from '../../../types/dashboard';

interface FavoriteGenresCardProps {
    genres: FavoriteGenre[];
}

const genreColors = [
    {
        ring: 'indigo.5',
        dot: 'var(--mantine-color-indigo-5)',
    },
    {
        ring: 'violet.6',
        dot: 'var(--mantine-color-violet-6)',
    },
    {
        ring: 'blue.4',
        dot: 'var(--mantine-color-blue-4)',
    },
    {
        ring: 'grape.4',
        dot: 'var(--mantine-color-grape-4)',
    },
    {
        ring: 'gray.4',
        dot: 'var(--mantine-color-gray-4)',
    },
];

export function FavoriteGenresCard({
    genres,
}: FavoriteGenresCardProps) {
    const total = genres.reduce(
        (sum, genre) => sum + genre.count,
        0,
    );

    const sections = genres.map(
        (genre, index) => ({
            value:
                total > 0
                    ? (genre.count / total) * 100
                    : 0,

            color:
                genreColors[
                    index % genreColors.length
                ].ring,
        }),
    );

    return (
        <Paper
            p="xl"
            radius="xl"
            className="bookshelf-dashboard-card"
            mih={360}
        >
            <Stack gap="xl">
                <Group gap="sm">
                    <IconChartDonut
                        size={21}
                        color="var(--bookshelf-text-muted)"
                    />

                    <Title order={3} size="h4">
                        Favorite Genres
                    </Title>
                </Group>

                {genres.length === 0 ? (
                    <Center mih={240}>
                        <Stack
                            gap="xs"
                            align="center"
                        >
                            <IconChartDonut
                                size={42}
                                stroke={1.3}
                                color="var(--bookshelf-text-muted)"
                            />

                            <Text fw={500}>
                                No genre data yet
                            </Text>

                            <Text
                                size="sm"
                                c="dimmed"
                                ta="center"
                            >
                                Add genres to your read books
                                to see your favorites.
                            </Text>
                        </Stack>
                    </Center>
                ) : (
                    <Group
                        justify="center"
                        align="center"
                        gap={48}
                        mih={240}
                    >
                        <RingProgress
                            size={185}
                            thickness={13}
                            roundCaps
                            sections={sections}
                            label={
                                <Stack
                                    gap={0}
                                    align="center"
                                >
                                    <Text
                                        fw={700}
                                        size="xl"
                                        c="var(--bookshelf-primary)"
                                    >
                                        {genres.length}
                                    </Text>

                                    <Text
                                        size="xs"
                                        c="dimmed"
                                    >
                                        top genres
                                    </Text>
                                </Stack>
                            }
                        />

                        <Stack gap="md">
                            {genres.map(
                                (genre, index) => {
                                    const percentage =
                                        total > 0
                                            ? Math.round(
                                                (genre.count /
                                                    total) *
                                                100,
                                            )
                                            : 0;

                                    return (
                                        <Group
                                            key={genre.id}
                                            gap="sm"
                                            wrap="nowrap"
                                        >
                                            <span
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    flexShrink: 0,
                                                    background:
                                                        genreColors[
                                                            index % genreColors.length
                                                        ].dot,
                                                }}
                                            />

                                            <Text size="sm">
                                                {genre.name}{' '}
                                                <Text
                                                    component="span"
                                                    c="dimmed"
                                                    size="sm"
                                                >
                                                    ({percentage}%)
                                                </Text>
                                            </Text>
                                        </Group>
                                    );
                                },
                            )}
                        </Stack>
                    </Group>
                )}
            </Stack>
        </Paper>
    );
}