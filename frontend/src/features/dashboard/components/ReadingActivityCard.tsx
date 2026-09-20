import {
  Group,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
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
  const [year, monthNumber] =
    month.split('-');

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1,
    1,
  );

  return date.toLocaleDateString(
    'en-US',
    {
      month: 'short',
    },
  );
}



export function ReadingActivityCard({
  activity,
}: ReadingActivityCardProps) {
  const theme = useMantineTheme();

  const chartData = activity.map(
    (item) => ({
      month: formatMonth(item.month),
      books: item.count,
    }),
  );

  const hasActivity = activity.some(
    (item) => item.count > 0,
  );

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
            className="bookshelf-dashboard-period bookshelf-text-muted"
          >
            Last 6 months
          </Text>
        </Group>

        {!hasActivity ? (
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
              ta="center"
              className="bookshelf-text-muted"
            >
              Completed books will
              appear here.
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
                color: theme.primaryColor,
              },
            ]}
            tickLine="none"
            gridAxis="none"
            withLegend={false}
            withYAxis
            yAxisProps={{
              allowDecimals: false,
              tick: {
                fill:
                  'var(--bookshelf-text-muted)',
              },
            }}
            xAxisProps={{
              tick: {
                fill:
                  'var(--bookshelf-text-muted)',
              },
            }}
            tooltipProps={{
              cursor: false,
              content: ({
                label,
                payload,
              }) => (
                <ReadingTooltip
                  label={label}
                  payload={payload}
                />
              ),
            }}
          />
        )}
      </Stack>
    </Paper>
  );
}

interface ReadingTooltipProps {
  label: React.ReactNode;
  payload:
  | readonly Record<string, any>[]
  | undefined;
}

function ReadingTooltip({
  label,
  payload,
}: ReadingTooltipProps) {
  if (!payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <Paper
      px="md"
      py="sm"
      radius="md"
      className="bookshelf-chart-tooltip"
    >
      <Text
        fw={600}
        size="sm"
        mb={4}
      >
        {label}
      </Text>

      <Text
        size="sm"
        style={{
          color:
            'var(--bookshelf-primary)',
        }}
      >
        Books read: {item.value}
      </Text>
    </Paper>
  );
}