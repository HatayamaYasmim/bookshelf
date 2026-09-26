import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Image,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import type { MediaStatus, UserMedia } from '../../../../types/media';


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

  const year = item.media.releaseDate
    ? new Date(item.media.releaseDate).getUTCFullYear()
    : null;

  const posterUrl = item.media.posterPath
    ? `${imageBaseUrl}${item.media.posterPath}`
    : null;

  const statusOptions = [
    {
      value: 'WATCHLIST',
      label: t('media.status.WATCHLIST'),
    },
    {
      value: 'WATCHING',
      label: t('media.status.WATCHING'),
    },
    {
      value: 'WATCHED',
      label: t('media.status.WATCHED'),
    },
  ];

  return (
    <Card withBorder radius="lg" padding="md" className="bookshelf-media-search-card">
      <Card.Section>
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={item.media.title}
            h={320}
            fit="cover"
          />
        ) : (
          <Stack h={320} justify="center" align="center">
            <Text c="dimmed">—</Text>
          </Stack>
        )}
      </Card.Section>

      <Stack gap="sm" mt="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <div>
            <Text fw={700} lineClamp={1}>
              {item.media.title}
            </Text>

            <Group gap="xs" mt={4}>
              <Badge variant="light">
                {t(`media.type.${item.media.type}`)}
              </Badge>

              {year && (
                <Text size="sm" c="dimmed">
                  {year}
                </Text>
              )}

              {item.media.rating !== null && (
                <Text size="sm">⭐ {item.media.rating.toFixed(1)}</Text>
              )}
            </Group>
          </div>

          <ActionIcon
            variant="subtle"
            size="lg"
            loading={favoriteLoading}
            aria-label={
              item.favorite
                ? t('media.actions.unfavorite')
                : t('media.actions.favorite')
            }
            onClick={() =>
              onFavoriteChange(item.id, !item.favorite)
            }
          >
            {item.favorite ? <FaHeart size={18} /> : <FiHeart size={18} />}
          </ActionIcon>
        </Group>

        <Select
          value={item.status}
          data={statusOptions}
          disabled={statusLoading}
          onChange={(value) => {
            if (value) {
              onStatusChange(item.id, value as MediaStatus);
            }
          }}
        />
      </Stack>
    </Card>
  );
}