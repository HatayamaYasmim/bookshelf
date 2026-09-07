import {
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import {
  BarChart,
} from '@mantine/charts';

import {
  IconChartBar,
} from '@tabler/icons-react';

import type {
  MonthlyActivity,
} from '../../../types/dashboard';

interface ReadingActivityCardProps {
  activity: MonthlyActivity[];
}

function formatMonth(month: string) {
  const [year, monthNumber] = month.split('-');

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1,
    1,
  );

  return date.toLocaleDateString('en-US', {
    month: 'short',
  });
}

export function ReadingActivityCard({
  activity,
}: ReadingActivityCardProps) {
  const chartData = activity.map((item) => ({
    month: formatMonth(item.month),
    books: item.count,
  }));

  return (
    <Paper
      p="xl"
      radius="xl"
       className="bookshelf-dashboard-card bookshelf-dashboard-main-card"
      mih={320}
    >
      <Stack gap="xl">
        <Group justify="space-between">
          <Group gap="sm">
            <IconChartBar
              size={21}
              color="var(--bookshelf-text-muted)"
            />

            <Title
              order={3}
              size="h4"
            >
              Reading Activity
            </Title>
          </Group>

          <Text
            size="sm"
            c="dimmed"
            className="bookshelf-dashboard-period"
          >
            Last 6 months
          </Text>
        </Group>

        {activity.length === 0 ? (
          <Stack
            align="center"
            justify="center"
            mih={220}
          >
            <Text fw={500}>
              No reading activity yet
            </Text>

            <Text
              size="sm"
              c="dimmed"
              ta="center"
            >
              Completed books will appear here.
            </Text>
          </Stack>
        ) : (
          <BarChart
            h={220}
            data={chartData}
            dataKey="month"
            series={[
              {
                name: 'books',
                label: 'Books read',
                color: 'indigo.5',
              },
            ]}
            tickLine="none"
            gridAxis="none"
            withLegend={false}
            withYAxis
            yAxisProps={{
              allowDecimals: false,
            }}
          />
        )}
      </Stack>
    </Paper>
  );
}