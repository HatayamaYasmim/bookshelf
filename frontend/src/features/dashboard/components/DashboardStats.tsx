import {
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { useTranslation } from 'react-i18next';

import type {
  ReadingDashboardResponse,
} from '../../../types/dashboard';

import { RiBookAiLine } from 'react-icons/ri';
import { PiBooksLight } from 'react-icons/pi';
import { IoBookOutline } from 'react-icons/io5';

interface DashboardStatsProps {
  dashboard: ReadingDashboardResponse;
}

export function DashboardStats({
  dashboard,
}: DashboardStatsProps) {
  const { t } = useTranslation();

  const stats = [
    {
      id: 'month',
      label: t('dashboard.thisMonth'),
      value: dashboard.readThisMonth,
      accentColor: 'var(--bookshelf-primary)',
      icon: RiBookAiLine,
    },
    {
      id: 'year',
      label: t('dashboard.thisYear'),
      value: dashboard.readThisYear,
      accentColor: 'var(--bookshelf-primary)',
      icon: IoBookOutline,
    },
    {
      id: 'total',
      label: t('dashboard.totalBooks'),
      value: dashboard.totalBooks,
      description: `${dashboard.read} ${t('dashboard.read')}`,
      accentColor: 'var(--bookshelf-primary)',
      icon: PiBooksLight,
    },
  ];

  return (
    <Grid
      gap={{
        base: 'sm',
        sm: 'xl',
      }}
      className="bookshelf-dashboard-stats"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Grid.Col
            key={stat.id}
            span={{
              base:
                stat.id === 'total'
                  ? 12
                  : 6,
              sm: 6,
              lg: 4,
            }}
          >
            <Paper
              p={{
                base: 'sm',
                sm: 'xl',
              }}
              radius="xl"
              className="bookshelf-dashboard-card"
            >
              <Group
                justify="space-between"
                align="flex-start"
                wrap="nowrap"
              >
                <Stack gap={4}>
                  <Text
                    size="sm"
                    fw={500}
                    tt="uppercase"
                    className="bookshelf-text-muted"
                  >
                    {stat.label}
                  </Text>

                  <Title
                    order={2}
                    style={{
                      color: stat.accentColor,
                    }}
                  >
                    {stat.value}
                  </Title>

                  {stat.description && (
                    <Text
                      size="sm"
                      className="bookshelf-text-muted"
                    >
                      {stat.description}
                    </Text>
                  )}
                </Stack>

                <div
                  className="bookshelf-dashboard-stat-icon"
                  style={{
                    color: stat.accentColor,
                  }}
                >
                  <Icon size={40} />
                </div>
              </Group>
            </Paper>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}