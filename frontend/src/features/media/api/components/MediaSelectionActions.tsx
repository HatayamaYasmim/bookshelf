import {
  ActionIcon,
  Group,
  Tooltip,
} from '@mantine/core';

import { useTranslation } from 'react-i18next';

import {
  FiBookmark,
  FiHeart,
  FiPlay,
} from 'react-icons/fi';

import { FaHeart } from 'react-icons/fa';
import { LuTicketCheck } from 'react-icons/lu';

import type {
  MediaStatus,
  MediaType,
} from '../../../../types/media';

export interface MediaSelection {
  status: MediaStatus | null;
  favorite: boolean;
}

interface MediaSelectionActionsProps {
  tmdbId: number;
  type: MediaType;
  selection: MediaSelection;

  loading?: boolean;

  onStatusChange: (
    tmdbId: number,
    type: MediaType,
    status: MediaStatus,
  ) => void;

  onFavoriteChange: (
    tmdbId: number,
    type: MediaType,
  ) => void;
}

export function MediaSelectionActions({
  tmdbId,
  type,
  selection,
  loading = false,
  onStatusChange,
  onFavoriteChange,
}: MediaSelectionActionsProps) {
  const { t } = useTranslation();

  return (
    <Group gap={6} wrap="nowrap">
      <Tooltip label={t('media.status.WATCHLIST')}>
        <ActionIcon
          size={30}
          radius="xl"
          loading={loading}
          className={`bookshelf-media-action ${
            selection.status === 'WATCHLIST'
              ? 'bookshelf-media-action-active'
              : ''
          }`}
          aria-label={t('media.status.WATCHLIST')}
          onClick={() =>
            onStatusChange(
              tmdbId,
              type,
              'WATCHLIST',
            )
          }
        >
          <FiBookmark size={15} />
        </ActionIcon>
      </Tooltip>

      <Tooltip label={t('media.status.WATCHING')}>
        <ActionIcon
          size={30}
          radius="xl"
          loading={loading}
          className={`bookshelf-media-action ${
            selection.status === 'WATCHING'
              ? 'bookshelf-media-action-active'
              : ''
          }`}
          aria-label={t('media.status.WATCHING')}
          onClick={() =>
            onStatusChange(
              tmdbId,
              type,
              'WATCHING',
            )
          }
        >
          <FiPlay size={15} />
        </ActionIcon>
      </Tooltip>

      <Tooltip label={t('media.status.WATCHED')}>
        <ActionIcon
          size={30}
          radius="xl"
          loading={loading}
          className={`bookshelf-media-action ${
            selection.status === 'WATCHED'
              ? 'bookshelf-media-action-active'
              : ''
          }`}
          aria-label={t('media.status.WATCHED')}
          onClick={() =>
            onStatusChange(
              tmdbId,
              type,
              'WATCHED',
            )
          }
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
          loading={loading}
          className={`bookshelf-media-action ${
            selection.favorite
              ? 'bookshelf-media-action-active'
              : ''
          }`}
          aria-label={
            selection.favorite
              ? t('media.actions.unfavorite')
              : t('media.actions.favorite')
          }
          onClick={() =>
            onFavoriteChange(tmdbId, type)
          }
        >
          {selection.favorite ? (
            <FaHeart size={14} />
          ) : (
            <FiHeart size={15} />
          )}
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}