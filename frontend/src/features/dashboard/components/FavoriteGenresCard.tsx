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
        color: '#6366f1',
        dot: '#6366f1',
    },
    {
        color: '#818cf8',
        dot: '#818cf8',
    },
    {
        color: '#a78bfa',
        dot: '#a78bfa',
    },
    {
        color: '#c084fc',
        dot: '#c084fc',
    },
    {
        color: '#93c5fd',
        dot: '#93c5fd',
    },
];

export function FavoriteGenresCard({
    genres,
}: FavoriteGenresCardProps) {
    const total = genres.reduce(
        (sum, genre) => sum + genre.count,
        0,
    );

    const firstColor = genreColors[0].color;

    const lastColor =
        genreColors[
            (genres.length - 1) % genreColors.length
        ].color;

    const seamColor = `color-mix(
    in srgb,
    ${lastColor} 50%,
    ${firstColor} 50%
)`;

    const seamSize = 3;

    let accumulatedPercentage = 0;

    const gradientSections: string[] = [
        // Continua a mistura depois do ponto 0%
        `${seamColor} 0%`,
        `${firstColor} ${seamSize}%`,
    ];

    genres.forEach((genre, index) => {
        const percentage =
            total > 0
                ? (genre.count / total) * 100
                : 0;

        const start = accumulatedPercentage;
        const end = start + percentage;

        const currentColor =
            genreColors[
                index % genreColors.length
            ].color;

        const nextColor =
            genreColors[
                (index + 1) % genreColors.length
            ].color;

        const transitionSize = Math.min(
            3,
            percentage / 4,
        );

        const transitionStart =
            end - transitionSize;

        if (index === 0) {
            gradientSections.push(
                `${currentColor} ${Math.max(start, seamSize)}%`,
            );
        } else {
            gradientSections.push(
                `${currentColor} ${start}%`,
            );
        }

        // Na última cor, prepara a transição para atravessar o topo
        if (index === genres.length - 1) {
            gradientSections.push(
                `${currentColor} ${Math.min(
                    transitionStart,
                    100 - seamSize,
                )}%`,
                `${seamColor} 100%`,
            );
        } else {
            gradientSections.push(
                `${currentColor} ${transitionStart}%`,
                `${nextColor} ${end}%`,
            );
        }

        accumulatedPercentage = end;
    });

    const genreGradient = `conic-gradient(
    ${gradientSections.join(', ')}
)`;

    return (
        <Paper
            p="xl"
            radius="xl"
            className="bookshelf-dashboard-card bookshelf-dashboard-main-card"
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
                        <div
                            className="bookshelf-genre-ring"
                            style={{
                                background: genreGradient,
                            }}
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