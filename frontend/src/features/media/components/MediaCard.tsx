import { ActionIcon, Badge, Card, Group, Image, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FiBookmark, FiHeart, FiPlay } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import type { MediaStatus, UserMedia } from '../../../types/media';
import { LuTicketCheck } from 'react-icons/lu';

interface MediaCardProps {
  item: UserMedia;
  onStatusChange: (id: number, status: MediaStatus) => void;
  onFavoriteChange: (id: number, favorite: boolean) => void;
  statusLoading?: boolean;
  favoriteLoading?: boolean;
}

const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

export function MediaCard({
  item,
  onStatusChange,
  onFavoriteChange,
  statusLoading = false,
  favoriteLoading = false,
}: MediaCardProps) {
  const { t } = useTranslation();
  const year = item.media.releaseDate ? new Date(item.media.releaseDate).getUTCFullYear() : null;
  const posterUrl = item.media.posterPath ? `${imageBaseUrl}${item.media.posterPath}` : null;

  return (
    <Card withBorder radius="lg" padding="sm" className="bookshelf-media-search-card">
      <Card.Section>
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={item.media.title}
            w="100%"
            fit="cover"
            style={{
              aspectRatio: '3 / 4',
            }}
          />
        ) : (
          <Stack
            justify="center"
            align="center"
            style={{
              aspectRatio: '3 / 4',
            }}
          >
            <Text c="dimmed">—</Text>
          </Stack>
        )}
      </Card.Section>

      <Stack gap={6} mt="sm">
        <Text fw={700} lineClamp={1}>
          {item.media.title}
        </Text>

        <Group gap="xs" wrap="wrap">
          <Badge variant="light">{t(`media.type.${item.media.type}`)}</Badge>

          {year && (
            <Text size="sm" c="dimmed">
              {year}
            </Text>
          )}

          {item.media.rating !== null && <Text size="sm">⭐ {item.media.rating.toFixed(1)}</Text>}
        </Group>

        <Group gap={6} wrap="nowrap" mt={2}>
          <ActionIcon
            size="lg"
            radius="xl"
            className={`bookshelf-media-action ${
              item.status === 'WATCHLIST' ? 'bookshelf-media-action-active' : ''
            }`}
            loading={statusLoading}
            aria-label={t('media.status.WATCHLIST')}
            onClick={() => onStatusChange(item.id, 'WATCHLIST')}
          >
            <FiBookmark size={16} />
          </ActionIcon>

          <ActionIcon
            size="lg"
            radius="xl"
            className={`bookshelf-media-action ${
              item.status === 'WATCHING' ? 'bookshelf-media-action-active' : ''
            }`}
            loading={statusLoading}
            aria-label={t('media.status.WATCHING')}
            onClick={() => onStatusChange(item.id, 'WATCHING')}
          >
            <FiPlay size={16} />
          </ActionIcon>

          <ActionIcon
            size="lg"
            radius="xl"
            className={`bookshelf-media-action ${
              item.status === 'WATCHED' ? 'bookshelf-media-action-active' : ''
            }`}
            loading={statusLoading}
            aria-label={t('media.status.WATCHED')}
            onClick={() => onStatusChange(item.id, 'WATCHED')}
          >
            <LuTicketCheck size={18} />
          </ActionIcon>

          <ActionIcon
            size="lg"
            radius="xl"
            className={`bookshelf-media-action ${
              item.favorite ? 'bookshelf-media-action-active' : ''
            }`}
            loading={favoriteLoading}
            aria-label={item.favorite ? t('media.actions.unfavorite') : t('media.actions.favorite')}
            onClick={() => onFavoriteChange(item.id, !item.favorite)}
          >
            {item.favorite ? <FaHeart size={16} /> : <FiHeart size={17} />}
          </ActionIcon>
        </Group>
      </Stack>
    </Card>
  );
}
