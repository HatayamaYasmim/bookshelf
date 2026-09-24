import { Group, Paper, Stack, Text, Title, useMantineTheme } from '@mantine/core';

import { BarChart } from '@mantine/charts';

import { IconChartBar } from '@tabler/icons-react';

import { useTranslation } from 'react-i18next';

import type { MonthlyActivity } from '../../../types/dashboard';

interface ReadingActivityCardProps {
  activity: MonthlyActivity[];
}

function formatMonth(month: string, locale: string) {
  const [year, monthNumber] = month.split('-');

  const date = new Date(Number(year), Number(monthNumber) - 1, 1);

  return date.toLocaleDateString(locale, {
    month: 'short',
  });
}

export function ReadingActivityCard({ activity }: ReadingActivityCardProps) {
  const theme = useMantineTheme();
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;

  const chartData = activity.map((item) => ({
    month: formatMonth(item.month, locale),
    books: item.count,
  }));

  const hasActivity = activity.some((item) => item.count > 0);

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
            <IconChartBar size={21} color="var(--bookshelf-text-muted)" />

            <Title order={3} size="h4">
              {t('dashboard.readingActivity.title')}
            </Title>
          </Group>

          <Text size="sm" className="bookshelf-dashboard-period bookshelf-text-muted">
            {t('dashboard.readingActivity.period')}
          </Text>
        </Group>

        {!hasActivity ? (
          <Stack align="center" justify="center" mih={220}>
            <Text fw={500}>{t('dashboard.readingActivity.emptyTitle')}</Text>

            <Text size="sm" ta="center" className="bookshelf-text-muted">
              {t('dashboard.readingActivity.emptyDescription')}
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
                label: t('dashboard.readingActivity.booksRead'),
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
                fill: 'var(--bookshelf-text-muted)',
              },
            }}
            xAxisProps={{
              tick: {
                fill: 'var(--bookshelf-text-muted)',
              },
            }}
            tooltipProps={{
              cursor: false,
              content: ({ label, payload }) => <ReadingTooltip label={label} payload={payload} />,
            }}
          />
        )}
      </Stack>
    </Paper>
  );
}

interface ReadingTooltipItem {
  value?: React.ReactNode;
}
interface ReadingTooltipProps {
  label: React.ReactNode;
  payload: readonly ReadingTooltipItem[] | undefined;
}

function ReadingTooltip({ label, payload }: ReadingTooltipProps) {
  const { t } = useTranslation();

  if (!payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <Paper px="md" py="sm" radius="md" className="bookshelf-chart-tooltip">
      <Text fw={600} size="sm" mb={4}>
        {label}
      </Text>

      <Text
        size="sm"
        style={{
          color: 'var(--bookshelf-primary)',
        }}
      >
        {t('dashboard.readingActivity.booksRead')}: {item.value}
      </Text>
    </Paper>
  );
}
