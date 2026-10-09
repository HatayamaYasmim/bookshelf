import { useRef, useState } from 'react';

import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Loader,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { BsStars } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { useTranslation } from 'react-i18next';

import type { AiRecommendation, AiRecommendationsResponse } from '../../../../types/ai';

import type { MediaStatus, MediaType } from '../../../../types/media';

import { getAiRecommendations } from '../../../../services/ai';

import { addMediaToCollection, getUserMedia } from '../media.api';

import { MediaSelectionActions, type MediaSelection } from './MediaSelectionActions';

const STORAGE_KEY = 'bookshelf:ai-recommendations';

const TTL = 24 * 60 * 60 * 1000;

interface StoredRecommendations {
  generatedAt: number;
  data: AiRecommendationsResponse;
}

function getStoredRecommendations(): AiRecommendationsResponse | null {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as StoredRecommendations;

    const expired = Date.now() - parsed.generatedAt > TTL;

    if (expired) {
      localStorage.removeItem(STORAGE_KEY);

      return null;
    }

    return parsed.data;
  } catch {
    localStorage.removeItem(STORAGE_KEY);

    return null;
  }
}

export function AiRecommendationsPreview() {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const recommendationsScrollRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<AiRecommendationsResponse | null>(() =>
    getStoredRecommendations(),
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [selectedRecommendation, setSelectedRecommendation] = useState<AiRecommendation | null>(
    null,
  );

  const mediaQuery = useQuery({
    queryKey: ['user-media'],
    queryFn: getUserMedia,
  });

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

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user-media'],
      });
    },
  });

  async function generateRecommendations() {
    try {
      setLoading(true);
      setError(null);

      const result = await getAiRecommendations();

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          generatedAt: Date.now(),
          data: result,
        }),
      );

      setData(result);
    } catch {
      setError(t('media.ai.error'));
    } finally {
      setLoading(false);
    }
  }

  function scrollRecommendations(direction: 'left' | 'right') {
    const container = recommendationsScrollRef.current;

    if (!container) {
      return;
    }

    const distance = container.clientWidth * 0.75;

    container.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  }

  function openRecommendation(item: AiRecommendation) {
    setSelectedRecommendation(item);
  }

  function getUserMediaItem(recommendation: AiRecommendation) {
    return mediaQuery.data?.find(
      (item) =>
        item.media.tmdbId === recommendation.tmdbId && item.media.type === recommendation.type,
    );
  }

  function getSelection(recommendation: AiRecommendation): MediaSelection {
    const existing = getUserMediaItem(recommendation);

    return {
      status: existing?.status ?? null,
      favorite: existing?.favorite ?? false,
    };
  }

  function handleStatus(tmdbId: number, type: MediaType, status: MediaStatus) {
    if (!selectedRecommendation) {
      return;
    }

    const selection = getSelection(selectedRecommendation);

    const newStatus = selection.status === status ? null : status;

    mediaMutation.mutate({
      tmdbId,
      type,
      status: newStatus,
    });
  }

  function handleFavorite(tmdbId: number, type: MediaType) {
    if (!selectedRecommendation) {
      return;
    }

    const selection = getSelection(selectedRecommendation);

    mediaMutation.mutate({
      tmdbId,
      type,
      favorite: !selection.favorite,
    });
  }

  function renderRecommendationCard(item: AiRecommendation) {
    const year = item.releaseDate ? new Date(`${item.releaseDate}T00:00:00`).getFullYear() : null;

    return (
      <UnstyledButton
        key={`${item.type}-${item.tmdbId}`}
        onClick={() => openRecommendation(item)}
        className="bookshelf-ai-recommendation"
      >
        <Card
          withBorder
          radius="lg"
          padding="sm"
          className="bookshelf-media-search-card bookshelf-ai-recommendation-card"
        >
          <Card.Section>
            {item.posterUrl ? (
              <Image
                src={item.posterUrl}
                alt={item.title}
                w="100%"
                fit="cover"
                className="bookshelf-ai-recommendation-poster"
              />
            ) : (
              <Stack
                justify="center"
                align="center"
                className="bookshelf-ai-recommendation-poster bookshelf-media-poster-placeholder"
              >
                <Text size="xs" c="dimmed">
                  {t('media.ai.noPoster')}
                </Text>
              </Stack>
            )}
          </Card.Section>

          <Stack gap={5} mt="xs">
            <Text size="sm" fw={700} lineClamp={1}>
              {item.title}
            </Text>

            <Group gap={6} wrap="nowrap">
              <Badge size="xs" variant="light">
                {t(`media.type.${item.type}`)}
              </Badge>

              {year && (
                <Text size="xs" c="dimmed">
                  {year}
                </Text>
              )}

              {item.rating > 0 && (
                <Text
                  size="xs"
                  c="dimmed"
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  ⭐ {item.rating.toFixed(1)}
                </Text>
              )}
            </Group>
          </Stack>
        </Card>
      </UnstyledButton>
    );
  }

  const selectedSelection = selectedRecommendation ? getSelection(selectedRecommendation) : null;

  const selectedYear = selectedRecommendation?.releaseDate
    ? new Date(`${selectedRecommendation.releaseDate}T00:00:00`).getFullYear()
    : null;

  return (
    <>
      <Stack gap="sm" className="bookshelf-media-ai-preview">
        <Group gap="xs">
          <BsStars size={14} color="var(--bookshelf-primary)" />

          <Text size="xs" fw={400} c="var(--bookshelf-primary)">
            {t('media.ai.eyebrow')}
          </Text>
        </Group>

        {!data && !loading && (
          <>
            <Title order={4}>{t('media.ai.title')}</Title>

            <Text size="sm" c="dimmed">
              {t('media.ai.description')}
            </Text>

            <Group mt="auto">
              <Button
                onClick={generateRecommendations}
                className="bookshelf-button bookshelf-button-primary"
              >
                {t('media.ai.generateRecommendations')}
              </Button>
            </Group>
          </>
        )}

        {loading && (
          <Stack gap="xs">
            <Group gap="sm">
              <Loader size="sm" />

              <Text size="sm">{t('media.ai.analyzing')}</Text>
            </Group>

            <Text size="xs" c="dimmed">
              {t('media.ai.analyzingDescription')}
            </Text>
          </Stack>
        )}

        {error && !loading && (
          <Stack gap="xs" align="flex-start">
            <Text size="sm" c="red">
              {error}
            </Text>

            <Button size="xs" variant="outline" radius="xl" onClick={generateRecommendations}>
              {t('media.ai.tryAgain')}
            </Button>
          </Stack>
        )}

        {data && !loading && (
          <>
            <Group justify="space-between" align="center" gap="sm" wrap="wrap">
              <Group gap="xs">
                {data.profile.genres.slice(0, 4).map((genre) => (
                  <Badge
                    key={genre}
                    variant="light"
                    style={{
                      color: 'var(--bookshelf-primary)',
                      background: 'var(--bookshelf-primary-soft)',
                    }}
                  >
                    {genre}
                  </Badge>
                ))}
              </Group>

              <Group gap={6} wrap="nowrap">
                <ActionIcon
                  variant="outline"
                  radius="xl"
                  size="sm"
                  aria-label={t('media.ai.previousRecommendations')}
                  onClick={() => scrollRecommendations('left')}
                  className="bookshelf-media-carousel-arrow"
                >
                  <FiChevronLeft size={16} />
                </ActionIcon>

                <ActionIcon
                  variant="outline"
                  radius="xl"
                  size="sm"
                  aria-label={t('media.ai.nextRecommendations')}
                  onClick={() => scrollRecommendations('right')}
                  className="bookshelf-media-carousel-arrow"
                >
                  <FiChevronRight size={16} />
                </ActionIcon>

                <Button size="xs" radius="xl" variant="outline" onClick={generateRecommendations}>
                  {t('media.ai.refreshRecommendations')}
                </Button>
              </Group>
            </Group>

            <div ref={recommendationsScrollRef} className="bookshelf-ai-recommendations-carousel">
              {data.recommendations.map(renderRecommendationCard)}
            </div>
          </>
        )}
      </Stack>

      <Modal
        opened={selectedRecommendation !== null}
        onClose={() => setSelectedRecommendation(null)}
        title={selectedRecommendation?.title}
        size="xl"
        centered
      >
        {selectedRecommendation && selectedSelection && (
          <SimpleGrid
            cols={{
              base: 1,
              sm: 2,
            }}
            spacing="xl"
            verticalSpacing="lg"
          >
            <Stack align="flex-start" justify="flex-start">
              {selectedRecommendation.posterUrl ? (
                <Image
                  src={selectedRecommendation.posterUrl}
                  alt={selectedRecommendation.title}
                  w="100%"
                  //   maw={240}
                  radius="lg"
                  fit="cover"
                  style={{
                    aspectRatio: '2 / 3',
                  }}
                />
              ) : (
                <Stack
                  justify="center"
                  align="center"
                  maw={240}
                  w="100%"
                  className="bookshelf-media-poster-placeholder"
                  style={{
                    aspectRatio: '2 / 3',
                  }}
                >
                  <Text size="sm" c="dimmed">
                    {t('media.ai.noPoster')}
                  </Text>
                </Stack>
              )}
            </Stack>

            <Stack gap="md" align="stretch" justify="flex-start">
              <Group gap="xs" align="center" wrap="wrap">
                <Text size="sm" c="dimmed">
                  {t(`media.type.${selectedRecommendation.type}`)}
                </Text>

                {selectedRecommendation.rating > 0 && (
                  <Badge variant="light">⭐ {selectedRecommendation.rating.toFixed(1)}</Badge>
                )}

                {selectedYear && <Badge variant="light">{selectedYear}</Badge>}
              </Group>

              <MediaSelectionActions
                tmdbId={selectedRecommendation.tmdbId}
                type={selectedRecommendation.type}
                selection={selectedSelection}
                loading={mediaMutation.isPending}
                onStatusChange={handleStatus}
                onFavoriteChange={handleFavorite}
              />

              <div>
                <Text size="sm" fw={600} mb={4}>
                  {t('media.ai.synopsis')}
                </Text>

                <Text
                  size="sm"
                  c="dimmed"
                  style={{
                    lineHeight: 1.7,
                    textAlign: 'justify',
                  }}
                >
                  {selectedRecommendation.overview || t('media.ai.noSynopsis')}
                </Text>
              </div>
            </Stack>
          </SimpleGrid>
        )}
      </Modal>
    </>
  );
}
