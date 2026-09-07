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
import { GiBlackBook, GiBurningBook, GiChecklist, GiRead } from 'react-icons/gi';
import { RiBookAiLine } from 'react-icons/ri';
import { PiBooksLight, PiBooksThin, PiShootingStarThin } from "react-icons/pi";
import { IoBookOutline } from 'react-icons/io5';

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
      color: '#818cf8',
      icon: <RiBookAiLine size={38} />
    },
    {
      label: 'READ THIS YEAR',
      value: dashboard.readThisYear,
      description: 'books completed',
      color: '#6366f1',
      icon: <IoBookOutline  size={40} />
    },
    {
      label: 'TOTAL BOOKS',
      value: dashboard.totalBooks,
      description: `${dashboard.read} read`,
      color: '#818cf8',
      icon: <PiBooksLight   size={40} />,
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
        ><Paper
          p="xl"
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

              <div className="bookshelf-dashboard-stat-icon"
                style={{
                  color: stat.color,
                }}>
                {stat.icon}
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  );
}