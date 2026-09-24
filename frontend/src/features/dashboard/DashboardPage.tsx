import {
  Center,
  Container,
  Grid,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { getReadingDashboard } from '../../services/dashboard';

import { DashboardSkeleton } from './components/DashboardSkeleton';
import { DashboardStats } from './components/DashboardStats';
import { CurrentlyReadingCard } from './components/CurrentlyReadingCard';
import { FavoriteGenresCard } from './components/FavoriteGenresCard';
import { ReadingActivityCard } from './components/ReadingActivityCard';

export function DashboardPage() {
  const { t } = useTranslation();

  const {
    data: dashboard,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['dashboard', 'reading'],
    queryFn: getReadingDashboard,
  });

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
          {t('dashboard.page.loadError')}
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
            {t('dashboard.page.title')}
          </Title>

          <Text className="bookshelf-text-muted">
            {t('dashboard.page.description')}
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