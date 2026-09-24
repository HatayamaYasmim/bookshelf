import {
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';

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
  const stats = [
    {
      label: 'THIS MONTH',
      value: dashboard.readThisMonth,
      accentColor: 'var(--bookshelf-primary)',
      icon: RiBookAiLine,
    },
    {
      label: 'THIS YEAR',
      value: dashboard.readThisYear,
      accentColor: 'var(--bookshelf-primary)',
      icon: IoBookOutline,
    },
    {
      label: 'TOTAL BOOKS',
      value: dashboard.totalBooks,
      description: `${dashboard.read} read`,
      accentColor: 'var(--bookshelf-primary)',
      icon: PiBooksLight,
    },
  ];

  return (
    <Grid gap={{ base: 'sm', sm: 'xl' }} className="bookshelf-dashboard-stats">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Grid.Col
            key={stat.label}
            span={{
              base: stat.label === 'TOTAL BOOKS' ? 12 : 6,
              sm: 6,
              lg: 4,
            }}
          >
            <Paper
              p={{ base: 'sm', sm: 'xl' }}
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

                  <Text
                    size="sm"
                    className="bookshelf-text-muted"
                  >
                    {stat.description}
                  </Text>
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