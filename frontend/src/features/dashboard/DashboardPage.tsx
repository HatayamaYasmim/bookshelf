import { Container, Stack, Title, Text, Center, Grid } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getReadingDashboard } from "../../services/dashboard";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { DashboardStats } from "./components/DashboardStats";
import { CurrentlyReadingCard } from "./components/CurrentlyReadingCard";
import { FavoriteGenresCard } from "./components/FavoriteGenresCard";
import { ReadingActivityCard } from "./components/ReadingActivityCard";

export function DashboardPage() {
    const { data: dashboard, isLoading, isError } = useQuery({
        queryKey: ['dashboard', 'reading'],
        queryFn: getReadingDashboard
    })

    if (isLoading) {
        return (
            <Container size="xl" py="xl">
                <DashboardSkeleton />
            </Container>
        );
    }

    if (isError || !dashboard) {
        return (
            <Center h="60vh">
                <Text c="red">
                    It was not possible to load the dashboard.
                </Text>
            </Center>
        );
    }


    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <Stack gap={4}>
                    <Title
                        order={2}
                        c="var(--bookshelf-primary)"
                        fw={700}
                    >
                        Dashboard
                    </Title>

                    <Text c="dimmed">
                        Your reading activity and statistics.
                    </Text>
                </Stack>

                <DashboardStats dashboard={dashboard} />

                <Grid gap="xl">
                    <Grid.Col
                        span={{
                            base: 12,
                            md: 8,
                        }}
                    >
                        <FavoriteGenresCard
                            genres={dashboard.favoriteGenres}
                        />
                    </Grid.Col>

                    <Grid.Col
                        span={{
                            base: 12,
                            md: 4,
                        }}
                    >
                        <CurrentlyReadingCard
                            books={dashboard.currentlyReading}
                        />
                    </Grid.Col>
                </Grid>

                <ReadingActivityCard
                    activity={dashboard.monthlyActivity}
                />
            </Stack>
        </Container>
    );
}