import { Badge, Group, Image, Modal, SimpleGrid, Stack, Text } from '@mantine/core';

import { useTranslation } from 'react-i18next';

import { MediaSelectionActions, type MediaSelection } from './MediaSelectionActions';
import type { AiRecommendation } from '../../../types/ai';

interface AiRecommendationDetailsModalProps {
  recommendation: AiRecommendation | null;
  selection: MediaSelection | null;
  loading?: boolean;
  onClose: () => void;
  onStatusChange: Parameters<typeof MediaSelectionActions>[0]['onStatusChange'];
  onFavoriteChange: Parameters<typeof MediaSelectionActions>[0]['onFavoriteChange'];
}

export function AiRecommendationDetailsModal({
  recommendation,
  selection,
  loading = false,
  onClose,
  onStatusChange,
  onFavoriteChange,
}: AiRecommendationDetailsModalProps) {
  const { t } = useTranslation();

  if (!recommendation || !selection) {
    return null;
  }

  const year = recommendation.releaseDate
    ? new Date(`${recommendation.releaseDate}T00:00:00`).getFullYear()
    : null;

  return (
    <Modal opened onClose={onClose} title={recommendation.title} size="xl" centered>
      <SimpleGrid
        cols={{
          base: 1,
          sm: 2,
        }}
        spacing="xl"
        verticalSpacing="lg"
      >
        <Stack align="flex-start" justify="flex-start">
          {recommendation.posterUrl ? (
            <Image
              src={recommendation.posterUrl}
              alt={recommendation.title}
              w="100%"
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
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              {t(`media.type.${recommendation.type}`)}
            </Text>

            {recommendation.rating > 0 && (
              <Badge variant="light" w="fit-content">
                ⭐ {recommendation.rating.toFixed(1)}
              </Badge>
            )}

            {year && (
              <Badge variant="light" w="fit-content">
                {year}
              </Badge>
            )}
            <MediaSelectionActions
              tmdbId={recommendation.tmdbId}
              type={recommendation.type}
              selection={selection}
              loading={loading}
              onStatusChange={onStatusChange}
              onFavoriteChange={onFavoriteChange}
            />
          </Group>

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
              {recommendation.overview || t('media.ai.noSynopsis')}
            </Text>
          </div>
        </Stack>
      </SimpleGrid>
    </Modal>
  );
}
