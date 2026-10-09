import { useRef, useState } from 'react';

import { ActionIcon, Badge, Button, Group, Loader, Stack, Text, Title } from '@mantine/core';

import { BsStars } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight, FiMessageCircle } from 'react-icons/fi';

import { useTranslation } from 'react-i18next';

import { AiCuratorDrawer } from './AiCuratorDrawer';
import { AiRecommendationDetailsModal } from './AiRecommendationDetailsModal';
import { AiRecommendationCard } from './AiRecommendationCard';

import { useAiRecommendations } from '../hooks/useAiRecommendations';

export function AiRecommendationsPreview() {
  const { t } = useTranslation();

  const recommendationsScrollRef = useRef<HTMLDivElement>(null);

  const [agentOpened, setAgentOpened] = useState(false);

  const {
    data,
    loading,
    error,
    selectedRecommendation,
    selectedSelection,

    isUpdatingMedia,

    generateRecommendations,
    openRecommendation,
    closeRecommendation,
    handleStatus,
    handleFavorite,
  } = useAiRecommendations();

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

                <Button
                  size="xs"
                  radius="xl"
                  variant="outline"
                  leftSection={<FiMessageCircle size={15} />}
                  onClick={() => setAgentOpened(true)}
                >
                  {t('media.ai.talkToCurator')}
                </Button>

                <Button size="xs" radius="xl" variant="outline" onClick={generateRecommendations}>
                  {t('media.ai.refreshRecommendations')}
                </Button>
              </Group>
            </Group>

            <div ref={recommendationsScrollRef} className="bookshelf-ai-recommendations-carousel">
              {data.recommendations.map((item) => (
                <AiRecommendationCard
                  key={`${item.type}-${item.tmdbId}`}
                  item={item}
                  onClick={openRecommendation}
                />
              ))}
            </div>
          </>
        )}
      </Stack>

      <AiRecommendationDetailsModal
        recommendation={selectedRecommendation}
        selection={selectedSelection}
        loading={isUpdatingMedia}
        onClose={closeRecommendation}
        onStatusChange={handleStatus}
        onFavoriteChange={handleFavorite}
      />

      <AiCuratorDrawer opened={agentOpened} onClose={() => setAgentOpened(false)} />
    </>
  );
}
