import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { AiRecommendation, AiRecommendationsResponse } from '../../../types/ai';
import type { MediaStatus, MediaType } from '../../../types/media';
import { getAiRecommendations } from '../../../services/ai';
import { addMediaToCollection, getUserMedia } from '../api/media.api';
import type { MediaSelection } from '../components/MediaSelectionActions';
import { getStoredRecommendations, saveRecommendations } from '../utils/aiRecommendations.storage';

export function useAiRecommendations() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

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
      saveRecommendations(result);
      setData(result);
    } catch {
      setError(t('media.ai.error'));
    } finally {
      setLoading(false);
    }
  }

  function openRecommendation(item: AiRecommendation) {
    setSelectedRecommendation(item);
  }

  function closeRecommendation() {
    setSelectedRecommendation(null);
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

  const selectedSelection = selectedRecommendation ? getSelection(selectedRecommendation) : null;

  return {
    data,
    loading,
    error,

    selectedRecommendation,
    selectedSelection,

    isUpdatingMedia: mediaMutation.isPending,

    generateRecommendations,

    openRecommendation,
    closeRecommendation,

    handleStatus,
    handleFavorite,
  };
}
