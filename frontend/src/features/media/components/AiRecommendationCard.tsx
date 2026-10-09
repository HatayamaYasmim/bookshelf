import { Badge, Card, Group, Image, Stack, Text, UnstyledButton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { AiRecommendation } from '../../../types/ai';


interface AiRecommendationCardProps {
  item: AiRecommendation;
  onClick: (item: AiRecommendation) => void;
}

export function AiRecommendationCard({ item, onClick }: AiRecommendationCardProps) {
  const { t } = useTranslation();

  const year = item.releaseDate ? new Date(`${item.releaseDate}T00:00:00`).getFullYear() : null;

  return (
    <UnstyledButton onClick={() => onClick(item)} className="bookshelf-ai-recommendation">
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
