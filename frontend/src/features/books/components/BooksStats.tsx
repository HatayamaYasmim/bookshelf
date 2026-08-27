import {
  Group,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
} from '@mantine/core';

import {
  LuBookOpen,
  LuBookmark,
  LuCircleCheck,
  LuBookOpenCheck,
} from 'react-icons/lu';

import type { BooksStatsResponse } from '../../../types/book';

interface BooksStatsProps {
  stats: BooksStatsResponse;
}

export function BooksStats({
  stats,
}: BooksStatsProps) {

  const statsItems = [
    {
      label: 'TOTAL BOOKS',
      value: stats.total,
      color: 'indigo',
      icon: LuBookOpen,
    },
    {
      label: 'READ',
      value: stats.read,
      color: 'green',
      icon: LuCircleCheck,
    },
    {
      label: 'READING',
      value: stats.reading,
      color: 'blue',
      icon: LuBookOpenCheck,
    },
    {
      label: 'UNREAD',
      value: stats.unread,
      color: 'gray',
      icon: LuBookmark,
    },
  ];

  return (
    <SimpleGrid
      cols={{
        base: 1,
        sm: 2,
        lg: 4,
      }}
      spacing="xl"
    >
      {statsItems.map((stat) => {
        const Icon = stat.icon;

        return (
          <Paper
            key={stat.label}
            p="xl"
            radius="xl"
            className="neo-raised"
          >
            <Group justify="space-between">
              <div>
                <Text
                  size="xs"
                  fw={700}
                  c="dimmed"
                  style={{
                    letterSpacing: '0.08em',
                  }}
                >
                  {stat.label}
                </Text>

                <Text
                  mt="xs"
                  size="2.5rem"
                  fw={700}
                  c={stat.color}
                  lh={1}
                >
                  {stat.value}
                </Text>
              </div>

              <ThemeIcon
                size={52}
                radius="xl"
                variant="light"
                color={stat.color}
              >
                <Icon size={26} />
              </ThemeIcon>
            </Group>
          </Paper>
        );
      })}
    </SimpleGrid>
  );
}