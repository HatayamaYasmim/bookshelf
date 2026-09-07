import {
  Grid,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import type {
  ReadingDashboardResponse,
} from '../../../types/dashboard';

interface DashboardStatsProps {
  dashboard: ReadingDashboardResponse;
}

export function DashboardStats({
  dashboard,
}: DashboardStatsProps) {
  const stats = [
    {
      label: 'READ THIS MONTH',
      value: dashboard.readThisMonth,
      description: 'books completed',
    },
    {
      label: 'READ THIS YEAR',
      value: dashboard.readThisYear,
      description: 'books completed',
    },
    {
      label: 'TOTAL BOOKS',
      value: dashboard.totalBooks,
      description: `${dashboard.read} read`,
    },
  ];

  return (
    <Grid gap="xl">
      {stats.map((stat) => (
        <Grid.Col
          key={stat.label}
          span={{
            base: 12,
            sm: 4,
          }}
        >
          <Paper
            p="xl"
            radius="xl"
            className="bookshelf-dashboard-card"
          >
            <Stack gap={4}>
              <Text
                size="sm"
                c="dimmed"
                fw={500}
              >
                {stat.label}
              </Text>

              <Title order={2}>
                {stat.value}
              </Title>

              <Text
                size="sm"
                c="dimmed"
              >
                {stat.description}
              </Text>
            </Stack>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  );
}