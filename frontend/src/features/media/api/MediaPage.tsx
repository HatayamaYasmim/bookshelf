import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Grid,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FiPlus } from 'react-icons/fi';
import type { MediaStatus } from '../../../types/media';
import { MediaCard } from './components/MediaCard';
import { AddMediaModal } from './components/AddMediaModal';
import { getUserMedia, updateMediaStatus, updateMediaFavorite } from './media.api';

export function MediaPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [addModalOpened, setAddModalOpened] = useState(false);

  const mediaQuery = useQuery({
    queryKey: ['user-media'],
    queryFn: getUserMedia,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: MediaStatus;
    }) => updateMediaStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-media'],
      });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: ({
      id,
      favorite,
    }: {
      id: number;
      favorite: boolean;
    }) => updateMediaFavorite(id, favorite),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-media'],
      });
    },
  });

  if (mediaQuery.isLoading) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  if (mediaQuery.isError) {
    return (
      <Text c="red">
        {t('media.notifications.error')}
      </Text>
    );
  }

  const media = mediaQuery.data ?? [];

  const watchlist = media.filter(
    (item) => item.status === 'WATCHLIST',
  );

  const watching = media.filter(
    (item) => item.status === 'WATCHING',
  );

  const watched = media.filter(
    (item) => item.status === 'WATCHED',
  );

  const favorites = media.filter(
    (item) => item.favorite,
  );

  const stats = [
    {
      label: t('media.stats.watchlist'),
      value: watchlist.length,
    },
    {
      label: t('media.stats.watching'),
      value: watching.length,
    },
    {
      label: t('media.stats.watched'),
      value: watched.length,
    },
    {
      label: t('media.stats.favorites'),
      value: favorites.length,
    },
  ];

  return (
    <>
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2}>
              {t('media.page.title')}
            </Title>

            <Text c="dimmed" mt={4}>
              {t('media.page.subtitle')}
            </Text>
          </div>

          <Button
            leftSection={<FiPlus size={16} />}
            onClick={() => setAddModalOpened(true)}
            className="bookshelf-button bookshelf-button-primary"
          >
            {t('media.page.addTitle')}
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          {stats.map((stat) => (
            <Paper
              key={stat.label}
              withBorder
              radius="lg"
              p="lg"
            >
              <Text size="sm" c="dimmed">
                {stat.label}
              </Text>

              <Text fw={700} size="xl" mt={4}>
                {stat.value}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>

        {watchlist.length > 0 && (
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>
                {t('media.sections.watchlist')}
              </Title>

              <Button variant="subtle" className="bookshelf-button bookshelf-button-primary">
                {t('media.actions.viewAll')}
              </Button>
            </Group>

            <Grid>
              {watchlist.slice(0, 4).map((item) => (
                <Grid.Col
                  key={item.id}
                  span={{ base: 12, xs: 6, md: 4, lg: 3 }}
                >
                  <MediaCard
                    item={item}
                    statusLoading={
                      statusMutation.isPending &&
                      statusMutation.variables?.id === item.id
                    }
                    favoriteLoading={
                      favoriteMutation.isPending &&
                      favoriteMutation.variables?.id === item.id
                    }
                    onStatusChange={(id, status) =>
                      statusMutation.mutate({
                        id,
                        status,
                      })
                    }
                    onFavoriteChange={(id, favorite) =>
                      favoriteMutation.mutate({
                        id,
                        favorite,
                      })
                    }
                  />
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        )}

        {favorites.length > 0 && (
          <Stack gap="md">
            <Title order={3}>
              {t('media.sections.favorites')}
            </Title>

            <Grid>
              {favorites.slice(0, 4).map((item) => (
                <Grid.Col
                  key={item.id}
                  span={{ base: 12, xs: 6, md: 4, lg: 3 }}
                >
                  <MediaCard
                    item={item}
                    statusLoading={
                      statusMutation.isPending &&
                      statusMutation.variables?.id === item.id
                    }
                    favoriteLoading={
                      favoriteMutation.isPending &&
                      favoriteMutation.variables?.id === item.id
                    }
                    onStatusChange={(id, status) =>
                      statusMutation.mutate({
                        id,
                        status,
                      })
                    }
                    onFavoriteChange={(id, favorite) =>
                      favoriteMutation.mutate({
                        id,
                        favorite,
                      })
                    }
                  />
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        )}

        {media.length === 0 && (
          <Paper
            withBorder
            radius="lg"
            p="xl"
            ta="center"
          >
            <Title order={4}>
              {t('media.watchlist.empty')}
            </Title>

            <Button
              mt="md"
              leftSection={<FiPlus size={16} />}
              onClick={() => setAddModalOpened(true)}
              className="bookshelf-button bookshelf-button-primary"
            >
              {t('media.page.addTitle')}
            </Button>
          </Paper>
        )}
      </Stack>

      <AddMediaModal
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
      />
    </>
  );
}