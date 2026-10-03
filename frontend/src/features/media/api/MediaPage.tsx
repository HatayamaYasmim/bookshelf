import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Container,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FiBookmark, FiHeart, FiPlay, FiPlus } from 'react-icons/fi';
import type { MediaStatus } from '../../../types/media';
import { MediaCard } from './components/MediaCard';
import { AddMediaModal } from './components/AddMediaModal';
import { getUserMedia, updateMediaStatus, updateMediaFavorite } from './media.api';
import { LuTicketCheck } from 'react-icons/lu';
import { BsStars } from 'react-icons/bs';

export function MediaPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [addModalOpened, setAddModalOpened] = useState(false);

  const mediaQuery = useQuery({
    queryKey: ['user-media'],
    queryFn: getUserMedia,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: MediaStatus }) =>
      updateMediaStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-media'],
      });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ id, favorite }: { id: number; favorite: boolean }) =>
      updateMediaFavorite(id, favorite),

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
    return <Text c="red">{t('media.notifications.error')}</Text>;
  }

  const media = mediaQuery.data ?? [];

  const watchlist = media.filter((item) => item.status === 'WATCHLIST');

  const watching = media.filter((item) => item.status === 'WATCHING');

  const watched = media.filter((item) => item.status === 'WATCHED');

  const favorites = media.filter((item) => item.favorite);

  const stats = [
    {
      label: t('media.stats.watchlist'),
      value: watchlist.length,
      icon: <FiBookmark size={18} />,
    },
    {
      label: t('media.stats.watching'),
      value: watching.length,
      icon: <FiPlay size={18} />,
    },
    {
      label: t('media.stats.watched'),
      value: watched.length,
      icon: <LuTicketCheck size={19} />,
    },
    {
      label: t('media.stats.favorites'),
      value: favorites.length,
      icon: <FiHeart size={18} />,
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Button
          leftSection={<FiPlus size={16} />}
          onClick={() => setAddModalOpened(true)}
          className="bookshelf-button bookshelf-button-primary"
        >
          {t('media.page.addTitle')}
        </Button>

        <SimpleGrid
          cols={{
            base: 1,
            md: 2,
          }}
          spacing="xl"
        >
          <Stack gap="md">
            <div>
              <Title order={2} c="var(--bookshelf-primary)" fw={700}>
                {t('media.page.title')}
              </Title>

              <Text className="bookshelf-text-muted">{t('media.page.subtitle')}</Text>
            </div>

            <Group gap="sm" wrap="wrap">
              {stats.map((stat) => (
                <Group key={stat.label} gap={6} className="bookshelf-media-stat-pill">
                  <span className="bookshelf-media-stat-pill-icon">{stat.icon}</span>

                  <Text size="sm" c="dimmed">
                    {stat.label}
                  </Text>

                  <Text size="sm" fw={700}>
                    {stat.value}
                  </Text>
                </Group>
              ))}
            </Group>
          </Stack>

          <Stack gap="sm" className="bookshelf-media-ai-preview">
            <Group gap="xs">
              <BsStars size={14} color="var(--bookshelf-primary)" />
              <Text size="xs" fw={400} c="var(--bookshelf-primary)">
                {t('media.ai.eyebrow')}
              </Text>
            </Group>

            <Title order={4} c="dimmed">
              {' '}
              {t('media.ai.title')}{' '}
            </Title>

            <Text size="sm" c="dimmed">
              {t('media.ai.description')}
            </Text>

            <Group mt="auto">
              <Badge
                variant="light"
                style={{
                  color: 'var(--bookshelf-primary)',
                  background: 'var(--bookshelf-primary-soft)',
                }}
              >
                {t('media.ai.comingSoon')}
              </Badge>
            </Group>
          </Stack>
        </SimpleGrid>

        <SimpleGrid
          cols={{
            base: 1,
            lg: 2,
          }}
          spacing="xl"
        >
          {watching.length > 0 && (
            <Stack gap="md">
              <Title c="var(--bookshelf-primary)" order={3}>
                {t('media.sections.watching')}
              </Title>

              <SimpleGrid
                cols={{
                  base: 2,
                  sm: 3,
                }}
                spacing="sm"
              >
                {watching.slice(0, 3).map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    statusLoading={
                      statusMutation.isPending && statusMutation.variables?.id === item.id
                    }
                    favoriteLoading={
                      favoriteMutation.isPending && favoriteMutation.variables?.id === item.id
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
                ))}
              </SimpleGrid>
            </Stack>
          )}

          {watchlist.length > 0 && (
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={3} c="var(--bookshelf-primary)">
                  {t('media.sections.watchlist')}
                </Title>

                {watchlist.length > 3 && (
                  <Button variant="subtle">{t('media.actions.viewAll')}</Button>
                )}
              </Group>

              <SimpleGrid
                cols={{
                  base: 2,
                  sm: 3,
                }}
                spacing="sm"
              >
                {watchlist.slice(0, 3).map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    statusLoading={
                      statusMutation.isPending && statusMutation.variables?.id === item.id
                    }
                    favoriteLoading={
                      favoriteMutation.isPending && favoriteMutation.variables?.id === item.id
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
                ))}
              </SimpleGrid>
            </Stack>
          )}
        </SimpleGrid>

        {(favorites.length > 0 || watched.length > 0) && (
          <SimpleGrid
            cols={{
              base: 1,
              lg: 2,
            }}
            spacing="xl"
          >
            {favorites.length > 0 && (
              <Stack gap="md">
                <Title order={3} c="var(--bookshelf-primary)">
                  {t('media.sections.favorites')}
                </Title>

                <SimpleGrid
                  cols={{
                    base: 2,
                    sm: 3,
                  }}
                  spacing="sm"
                >
                  {favorites.slice(0, 3).map((item) => (
                    <MediaCard
                      key={item.id}
                      item={item}
                      statusLoading={
                        statusMutation.isPending && statusMutation.variables?.id === item.id
                      }
                      favoriteLoading={
                        favoriteMutation.isPending && favoriteMutation.variables?.id === item.id
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
                  ))}
                </SimpleGrid>
              </Stack>
            )}

            {watched.length > 0 && (
              <Stack gap="md">
                <Title order={3} c="var(--bookshelf-primary)">
                  {t('media.sections.watched')}
                </Title>

                <SimpleGrid
                  cols={{
                    base: 2,
                    sm: 3,
                  }}
                  spacing="sm"
                >
                  {watched.slice(0, 3).map((item) => (
                    <MediaCard
                      key={item.id}
                      item={item}
                      statusLoading={
                        statusMutation.isPending && statusMutation.variables?.id === item.id
                      }
                      favoriteLoading={
                        favoriteMutation.isPending && favoriteMutation.variables?.id === item.id
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
                  ))}
                </SimpleGrid>
              </Stack>
            )}
          </SimpleGrid>
        )}

        {media.length === 0 && (
          <Paper withBorder radius="lg" p="xl" ta="center" className="neo-raised">
            <Title order={4}>{t('media.watchlist.collection')}</Title>
            <Text size="sm" c="dimmed">
              {t('media.watchlist.collectionDescription')}
            </Text>

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

      <AddMediaModal opened={addModalOpened} onClose={() => setAddModalOpened(false)} />
    </Container>
  );
}
