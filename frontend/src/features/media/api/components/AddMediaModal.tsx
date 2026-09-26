import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Image,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FiBookmark, FiHeart, FiPlay, FiSearch } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

import type { MediaStatus, MediaType } from '../../../../types/media';
import { BookshelfModal } from '../../../../components/ui/BookshellfModal';
import { addMediaToCollection, searchMedia } from '../media.api';
import { LuTicketCheck } from 'react-icons/lu';
import { MdMovieFilter } from 'react-icons/md';

interface AddMediaModalProps {
  opened: boolean;
  onClose: () => void;
}

interface MediaSelection {
  status: MediaStatus | null;
  favorite: boolean;
}

export function AddMediaModal({ opened, onClose }: AddMediaModalProps) {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const [selections, setSelections] = useState<Record<string, MediaSelection>>({});
  const language = (i18n.resolvedLanguage ?? i18n.language).startsWith('pt') ? 'pt-BR' : 'en-US';

  const queryClient = useQueryClient();

  const mediaMutation = useMutation({
    mutationFn: ({
      tmdbId,
      type,
      status,
      favorite,
    }: {
      tmdbId: number;
      type: MediaType;
      status?: MediaStatus | null;
      favorite?: boolean;
    }) =>
      addMediaToCollection({
        tmdbId,
        type,
        status,
        favorite,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-media'],
      });
    },
  });

  const searchQuery = useQuery({
    queryKey: ['tmdb-search', submittedQuery, language],
    queryFn: () => searchMedia(submittedQuery, language),
    enabled: submittedQuery.trim().length >= 2,
  });

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchTerm.trim();

    if (query.length < 2) {
      return;
    }

    setSubmittedQuery(query);
  }

  function getSelection(key: string): MediaSelection {
    return (
      selections[key] ?? {
        status: null,
        favorite: false,
      }
    );
  }

  function handleStatus(key: string, tmdbId: number, type: MediaType, status: MediaStatus) {
    const selection = getSelection(key);

    const newStatus = selection.status === status ? null : status;

    setSelections((current) => ({
      ...current,
      [key]: {
        ...selection,
        status: newStatus,
      },
    }));

    mediaMutation.mutate({
      tmdbId,
      type,
      status: newStatus,
    });
  }

  function handleFavorite(key: string, tmdbId: number, type: MediaType) {
    const selection = getSelection(key);
    const newFavorite = !selection.favorite;

    setSelections((current) => ({
      ...current,
      [key]: {
        ...selection,
        favorite: newFavorite,
      },
    }));

    mediaMutation.mutate({
      tmdbId,
      type,
      favorite: newFavorite,
    });
  }

  return (
    <BookshelfModal
      opened={opened}
      onClose={onClose}
      title={t('media.addModal.title')}
      icon={<MdMovieFilter size={20} color="var(--bookshelf-primary)" />}
      size="xl"
    >
      <Stack gap="md">
        <form onSubmit={handleSearch}>
          <Group align="flex-end" wrap="wrap" className="bookshelf-media-search-form">
            <TextInput
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
              leftSection={<FiSearch size={16} />}
              style={{ flex: 1 }}
              classNames={{
                input: 'bookshelf-input',
              }}
            />

            <Button
              type="submit"
              loading={searchQuery.isFetching}
              className="bookshelf-button bookshelf-button-primary"
            >
              {t('media.addModal.searchButton')}
            </Button>
          </Group>
        </form>

        {searchQuery.isFetching && (
          <Group justify="center" py="xl">
            <Loader size="sm" />

            <Text size="sm" c="dimmed">
              {t('media.search.searching')}
            </Text>
          </Group>
        )}

        {searchQuery.isError && (
          <Text c="red" size="sm">
            {t('media.notifications.searchError')}
          </Text>
        )}

        {searchQuery.data && searchQuery.data.results.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            {t('media.search.noResults')}
          </Text>
        )}

        {searchQuery.data && searchQuery.data.results.length > 0 && (
          <ScrollArea.Autosize mah={500}>
            <Stack gap="sm">
              {searchQuery.data.results.map((result) => {
                const key = `${result.type}-${result.id}`;

                const selection = getSelection(key);
                const year = result.releaseDate ? new Date(result.releaseDate).getFullYear() : null;

                return (
                  <Paper
                    key={key}
                    p="sm"
                    radius="md"
                    className="neo-raised bookshelf-media-search-card"
                  >
                    <Group align="flex-start" wrap="nowrap">
                      {result.posterUrl ? (
                        <Image
                          src={result.posterUrl}
                          alt={result.title}
                          w="clamp(64px, 18vw, 85px)"
                          radius="lg"
                          fit="cover"
                          style={{
                            aspectRatio: '2 / 3',
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <Box
                          w="clamp(64px, 18vw, 85px)"
                          className="bookshelf-media-poster-placeholder"
                          style={{
                            aspectRatio: '2 / 3',
                            flexShrink: 0,
                          }}
                        />
                      )}

                      <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
                        <Group justify="space-between" align="center" gap="sm" wrap="wrap">
                          <Text fw={600} lineClamp={1}>
                            {result.title}
                          </Text>
                          <Group gap={6} wrap="nowrap">
                            <Tooltip label={t('media.status.WATCHING')}>
                              <ActionIcon
                                size={30}
                                radius="xl"
                                className={`bookshelf-media-action ${
                                  selection.status === 'WATCHING'
                                    ? 'bookshelf-media-action-active'
                                    : ''
                                }`}
                                aria-label={t('media.status.WATCHING')}
                                onClick={() =>
                                  handleStatus(key, result.id, result.type, 'WATCHING')
                                }
                              >
                                <FiPlay size={15} />
                              </ActionIcon>
                            </Tooltip>

                            <Tooltip label={t('media.status.WATCHED')}>
                              <ActionIcon
                                size={30}
                                radius="xl"
                                className={`bookshelf-media-action ${
                                  selection.status === 'WATCHED'
                                    ? 'bookshelf-media-action-active'
                                    : ''
                                }`}
                                aria-label={t('media.status.WATCHED')}
                                onClick={() => handleStatus(key, result.id, result.type, 'WATCHED')}
                              >
                                <LuTicketCheck size={18} />
                              </ActionIcon>
                            </Tooltip>

                            <Tooltip
                              label={
                                selection.favorite
                                  ? t('media.actions.unfavorite')
                                  : t('media.actions.favorite')
                              }
                            >
                              <ActionIcon
                                size={30}
                                radius="xl"
                                className={`bookshelf-media-action ${
                                  selection.favorite ? 'bookshelf-media-action-active' : ''
                                }`}
                                aria-label={
                                  selection.favorite
                                    ? t('media.actions.unfavorite')
                                    : t('media.actions.favorite')
                                }
                                onClick={() => handleFavorite(key, result.id, result.type)}
                              >
                                {selection.favorite ? <FaHeart size={14} /> : <FiHeart size={15} />}
                              </ActionIcon>
                            </Tooltip>

                            <Tooltip label={t('media.status.WATCHLIST')}>
                              <ActionIcon
                                size={30}
                                radius="xl"
                                className={`bookshelf-media-action ${
                                  selection.status === 'WATCHLIST'
                                    ? 'bookshelf-media-action-active'
                                    : ''
                                }`}
                                aria-label={t('media.status.WATCHLIST')}
                                onClick={() =>
                                  handleStatus(key, result.id, result.type, 'WATCHLIST')
                                }
                              >
                                <FiBookmark size={15} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Group>
                        <Group gap="xs" wrap="wrap">
                          <Badge
                            variant="light"
                            style={{
                              color: 'var(--bookshelf-primary)',
                              background: 'var(--bookshelf-primary-soft)',
                            }}
                          >
                            {t(`media.type.${result.type}`)}
                          </Badge>

                          {year && (
                            <Text size="sm" c="dimmed">
                              {year}
                            </Text>
                          )}

                          {result.rating > 0 && (
                            <Text size="sm">⭐ {result.rating.toFixed(1)}</Text>
                          )}
                        </Group>
                        {result.overview && (
                          <Text size="sm" c="dimmed" lineClamp={3}>
                            {result.overview}
                          </Text>
                        )}
                      </Stack>
                    </Group>
                  </Paper>
                );
              })}
            </Stack>
          </ScrollArea.Autosize>
        )}
      </Stack>
    </BookshelfModal>
  );
}
