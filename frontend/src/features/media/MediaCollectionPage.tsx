import { useMemo, useState } from 'react';

import {
  Button,
  Container,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';

import type { MediaStatus } from '../../types/media';

import { AddMediaModal } from './components/AddMediaModal';
import { MediaCard } from './components/MediaCard';

import { getUserMedia, updateMediaFavorite, updateMediaStatus } from './api/media.api';
import { bookshelfSelectClassNames } from '../../styles/mantine';

type MediaTypeFilter = 'ALL' | 'MOVIE' | 'TV';

type MediaStatusFilter = 'WATCHLIST' | 'WATCHING' | 'WATCHED';

interface TypeFilterOption {
  value: MediaTypeFilter;
  label: string;
}

interface StatusFilterOption {
  value: MediaStatusFilter;
  label: string;
}

const TYPE_FILTERS: TypeFilterOption[] = [
  {
    value: 'ALL',
    label: 'media.collection.filters.all',
  },
  {
    value: 'MOVIE',
    label: 'media.collection.filters.movies',
  },
  {
    value: 'TV',
    label: 'media.collection.filters.series',
  },
];

const STATUS_FILTERS: StatusFilterOption[] = [
  {
    value: 'WATCHLIST',
    label: 'media.status.WATCHLIST',
  },
  {
    value: 'WATCHING',
    label: 'media.status.WATCHING',
  },
  {
    value: 'WATCHED',
    label: 'media.status.WATCHED',
  },
];

const SORT_OPTIONS = [
  {
    value: 'RECENT',
    label: 'media.collection.sort.recent',
  },
  {
    value: 'OLDEST',
    label: 'media.collection.sort.oldest',
  },
  {
    value: 'TITLE_ASC',
    label: 'media.collection.sort.titleAsc',
  },
  {
    value: 'TITLE_DESC',
    label: 'media.collection.sort.titleDesc',
  },
  {
    value: 'RATING_DESC',
    label: 'media.collection.sort.ratingDesc',
  },
] as const;

type MediaSort = (typeof SORT_OPTIONS)[number]['value'];

function getFilterClassName(active: boolean) {
  return ['bookshelf-media-filter', active ? 'bookshelf-media-filter-active' : '']
    .filter(Boolean)
    .join(' ');
}

function getTypeFilter(value: string | null): MediaTypeFilter {
  if (value === 'MOVIE' || value === 'TV') {
    return value;
  }

  return 'ALL';
}

function getStatusFilter(value: string | null): MediaStatusFilter | null {
  if (value === 'WATCHLIST' || value === 'WATCHING' || value === 'WATCHED') {
    return value;
  }

  return null;
}

function getSort(value: string | null): MediaSort {
  const validSort = SORT_OPTIONS.some((option) => option.value === value);

  return validSort ? (value as MediaSort) : 'RECENT';
}

export function MediaCollectionPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [addModalOpened, setAddModalOpened] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const typeFilter = getTypeFilter(searchParams.get('type'));

  const statusFilter = getStatusFilter(searchParams.get('status'));

  const favoritesOnly = searchParams.get('favorite') === 'true';

  const sort = getSort(searchParams.get('sort'));

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

  const media = mediaQuery.data ?? [];

  const filteredMedia = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return media.filter((item) => {
      const matchesSearch =
        !normalizedSearch || item.media.title.toLowerCase().includes(normalizedSearch);

      const matchesType = typeFilter === 'ALL' || item.media.type === typeFilter;

      const matchesStatus = statusFilter === null || item.status === statusFilter;

      const matchesFavorite = !favoritesOnly || item.favorite;

      return matchesSearch && matchesType && matchesStatus && matchesFavorite;
    });
  }, [media, search, typeFilter, statusFilter, favoritesOnly]);

  const sortedMedia = useMemo(() => {
    const items = [...filteredMedia];

    return items.sort((a, b) => {
      switch (sort) {
        case 'OLDEST':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

        case 'TITLE_ASC':
          return a.media.title.localeCompare(b.media.title);

        case 'TITLE_DESC':
          return b.media.title.localeCompare(a.media.title);

        case 'RATING_DESC':
          return (b.media.rating ?? -1) - (a.media.rating ?? -1);

        case 'RECENT':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [filteredMedia, sort]);

  const hasActiveFilters =
    search.trim() !== '' || typeFilter !== 'ALL' || statusFilter !== null || favoritesOnly;

  const sortOptions = SORT_OPTIONS.map((option) => ({
    value: option.value,
    label: t(option.label),
  }));

  function updateSearchParams(callback: (params: URLSearchParams) => void) {
    const nextParams = new URLSearchParams(searchParams);

    callback(nextParams);

    setSearchParams(nextParams);
  }

  function handleTypeChange(nextType: MediaTypeFilter) {
    updateSearchParams((params) => {
      if (nextType === 'ALL') {
        params.delete('type');
        return;
      }

      params.set('type', nextType);
    });
  }

  function handleStatusChange(nextStatus: MediaStatusFilter) {
    updateSearchParams((params) => {
      if (statusFilter === nextStatus) {
        params.delete('status');
        return;
      }

      params.set('status', nextStatus);
    });
  }

  function handleFavoriteFilterChange() {
    updateSearchParams((params) => {
      if (favoritesOnly) {
        params.delete('favorite');
        return;
      }

      params.set('favorite', 'true');
    });
  }

  function handleSortChange(value: string | null) {
    const nextSort = getSort(value);

    updateSearchParams((params) => {
      if (nextSort === 'RECENT') {
        params.delete('sort');
        return;
      }

      params.set('sort', nextSort);
    });
  }

  function clearFilters() {
    setSearch('');

    const nextParams = new URLSearchParams();

    if (sort !== 'RECENT') {
      nextParams.set('sort', sort);
    }

    setSearchParams(nextParams);
  }

  if (mediaQuery.isLoading) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  if (mediaQuery.isError) {
    return (
      <Container size="xl" py="xl">
        <Text c="red">{t('media.notifications.error')}</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-end" wrap="wrap" gap="md">
          <div>
            <Title order={2} c="var(--bookshelf-primary)">
              {t('media.collection.title')}
            </Title>

            <Text c="dimmed">{t('media.collection.description')}</Text>
          </div>

          <Button
            leftSection={<FiPlus size={16} />}
            onClick={() => setAddModalOpened(true)}
            className="bookshelf-button bookshelf-button-primary"
          >
            {t('media.page.addTitle')}
          </Button>
        </Group>

        <Paper p="lg" radius="xl" className="neo-raised">
          <Stack gap="md">
            <Group align="center" wrap="wrap">
              <TextInput
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder={t('media.collection.searchPlaceholder')}
                leftSection={<FiSearch size={16} />}
                style={{
                  flex: '1 1 280px',
                }}
                classNames={{
                  input: 'bookshelf-input',
                }}
              />

              <Select
                value={sort}
                onChange={handleSortChange}
                data={sortOptions}
                allowDeselect={false}
                aria-label={t('media.collection.sort.label')}
                style={{
                  flex: '0 1 210px',
                }}
                classNames={bookshelfSelectClassNames}
              />

              {hasActiveFilters && (
                <Button
                  variant="transparent"
                  radius="xl"
                  leftSection={<FiX size={18} />}
                  className="bookshelf-clear-filters"
                  onClick={clearFilters}
                >
                  {t('media.collection.clearFilters')}
                </Button>
              )}
            </Group>

            <Group gap="xs" wrap="wrap">
              {TYPE_FILTERS.map((item) => {
                const active = typeFilter === item.value;

                return (
                  <Button
                    key={item.value}
                    size="xs"
                    variant={active ? 'light' : 'subtle'}
                    onClick={() => handleTypeChange(item.value)}
                    className={getFilterClassName(active)}
                  >
                    {t(item.label)}
                  </Button>
                );
              })}

              {STATUS_FILTERS.map((item) => {
                const active = statusFilter === item.value;

                return (
                  <Button
                    key={item.value}
                    size="xs"
                    variant={active ? 'light' : 'subtle'}
                    onClick={() => handleStatusChange(item.value)}
                    className={getFilterClassName(active)}
                  >
                    {t(item.label)}
                  </Button>
                );
              })}

              <Button
                size="xs"
                variant={favoritesOnly ? 'light' : 'subtle'}
                onClick={handleFavoriteFilterChange}
                className={getFilterClassName(favoritesOnly)}
              >
                {t('media.sections.favorites')}
              </Button>
            </Group>
          </Stack>
        </Paper>

        <Text size="sm" c="dimmed">
          {t('media.collection.resultCount', {
            count: sortedMedia.length,
          })}
        </Text>

        {sortedMedia.length > 0 ? (
          <div className="bookshelf-media-collection-grid">
            {sortedMedia.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                statusLoading={statusMutation.isPending && statusMutation.variables?.id === item.id}
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
          </div>
        ) : (
          <Paper p="xl" radius="xl" ta="center" className="neo-raised">
            <Stack align="center" gap="sm">
              <Title order={4}>
                {media.length === 0 ? t('media.empty.collection') : t('media.collection.noResults')}
              </Title>

              <Text size="sm" c="dimmed">
                {media.length === 0
                  ? t('media.empty.collectionDescription')
                  : t('media.collection.noResultsDescription')}
              </Text>

              {media.length === 0 ? (
                <Button
                  leftSection={<FiPlus size={16} />}
                  onClick={() => setAddModalOpened(true)}
                  className="bookshelf-button bookshelf-button-primary"
                >
                  {t('media.page.addTitle')}
                </Button>
              ) : (
                <Button variant="outline" size="xs" radius="xl" onClick={clearFilters}>
                  {t('media.collection.clearFilters')}
                </Button>
              )}
            </Stack>
          </Paper>
        )}
      </Stack>

      <AddMediaModal opened={addModalOpened} onClose={() => setAddModalOpened(false)} />
    </Container>
  );
}
