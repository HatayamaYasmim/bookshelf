import { useRef, useState, type ReactNode } from 'react';

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
  ActionIcon,
} from '@mantine/core';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { FiBookmark, FiChevronLeft, FiChevronRight, FiHeart, FiPlay, FiPlus } from 'react-icons/fi';
import { LuTicketCheck } from 'react-icons/lu';
import { BsStars } from 'react-icons/bs';

import type { MediaStatus, UserMedia } from '../../../types/media';

import { MediaCard } from './components/MediaCard';
import { AddMediaModal } from './components/AddMediaModal';

import { getUserMedia, updateMediaFavorite, updateMediaStatus } from './media.api';
import { TmdbAttribution } from './components/TmdbAttribution';
import { AiRecommendationsPreview } from './components/AiRecommendationsPreview';

interface MediaCarouselProps {
  title: string;
  viewAllUrl: string;
  showViewAll: boolean;
  viewAllLabel: string;
  children: ReactNode;
}

interface MediaSection {
  key: string;
  title: string;
  items: UserMedia[];
  viewAllUrl: string;
}

function MediaCarousel({
  title,
  viewAllUrl,
  showViewAll,
  viewAllLabel,
  children,
}: MediaCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 'left' | 'right') {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const distance = container.clientWidth * 0.8;

    container.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  }

  return (
    <Stack gap="md" style={{ minWidth: 0 }}>
      <Group justify="space-between" align="center">
        <Title order={3} c="var(--bookshelf-primary)">
          {title}
        </Title>

        <Group gap={6} wrap="nowrap">
          {showViewAll && (
            <>
              <ActionIcon
                variant="outline"
                radius="xl"
                size="sm"
                aria-label="Anterior"
                onClick={() => scroll('left')}
                className="bookshelf-media-carousel-arrow"
              >
                <FiChevronLeft size={16} />
              </ActionIcon>

              <ActionIcon
                variant="outline"
                radius="xl"
                size="sm"
                aria-label="Próximo"
                onClick={() => scroll('right')}
                className="bookshelf-media-carousel-arrow"
              >
                <FiChevronRight size={16} />
              </ActionIcon>
            </>
          )}

          {showViewAll && (
            <Button component={Link} to={viewAllUrl} variant="outline" radius="xl" size="xs">
              {viewAllLabel}
            </Button>
          )}
        </Group>
      </Group>

      <div ref={scrollRef} className="bookshelf-media-carousel">
        {children}
      </div>
    </Stack>
  );
}

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

  const sectionRows: MediaSection[][] = [
    [
      {
        key: 'watching',
        title: t('media.sections.watching'),
        items: watching,
        viewAllUrl: '/media/collection?status=WATCHING',
      },
      {
        key: 'watchlist',
        title: t('media.sections.watchlist'),
        items: watchlist,
        viewAllUrl: '/media/collection?status=WATCHLIST',
      },
    ],
    [
      {
        key: 'favorites',
        title: t('media.sections.favorites'),
        items: favorites,
        viewAllUrl: '/media/collection?favorite=true',
      },
      {
        key: 'watched',
        title: t('media.sections.watched'),
        items: watched,
        viewAllUrl: '/media/collection?status=WATCHED',
      },
    ],
  ];

  function renderMediaCard(item: UserMedia) {
    return (
      <MediaCard
        item={item}
        statusLoading={statusMutation.isPending && statusMutation.variables?.id === item.id}
        favoriteLoading={favoriteMutation.isPending && favoriteMutation.variables?.id === item.id}
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
    );
  }

  function renderMediaSection(section: MediaSection) {
    if (section.items.length === 0) {
      return null;
    }

    return (
      <MediaCarousel
        key={section.key}
        title={section.title}
        viewAllUrl={section.viewAllUrl}
        showViewAll={section.items.length > 3}
        viewAllLabel={t('media.actions.viewAll')}
      >
        {section.items.map((item) => (
          <div key={item.id} className="bookshelf-media-carousel-item">
            {renderMediaCard(item)}
          </div>
        ))}
      </MediaCarousel>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="flex-end">
          <Button
            leftSection={<FiPlus size={16} />}
            onClick={() => setAddModalOpened(true)}
            className="bookshelf-button bookshelf-button-primary"
          >
            {t('media.page.addTitle')}
          </Button>
        </Group>
        <Stack gap="xl">
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

          <AiRecommendationsPreview />
        </Stack>

        {sectionRows.map((row, index) => {
          const hasItems = row.some((section) => section.items.length > 0);

          if (!hasItems) {
            return null;
          }

          return (
            <SimpleGrid
              key={index}
              cols={{
                base: 1,
                lg: 2,
              }}
              spacing="xl"
            >
              {row.map(renderMediaSection)}
            </SimpleGrid>
          );
        })}

        {media.length === 0 && (
          <Paper withBorder radius="lg" p="xl" ta="center" className="bookshelf-card">
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
        <TmdbAttribution />
      </Stack>

      <AddMediaModal opened={addModalOpened} onClose={() => setAddModalOpened(false)} />
    </Container>
  );
}
