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
import { GiBookCover, GiBookshelf } from 'react-icons/gi';

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
      icon: GiBookshelf,
    },
    {
      label: 'READ',
      value: stats.read,
      color: 'green',
      icon: LuBookOpenCheck,
    },
    {
      label: 'READING',
      value: stats.reading,
      color: 'blue',
      icon: GiBookCover,
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
            style={{
              background: '#e8eaf0',
              minHeight: 135,
            }}
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
                variant="transparent"
                color={stat.color}
                style={{
                  boxShadow:
                    '4px 4px 8px rgba(0,0,0,0.07), -4px -4px 8px rgba(255,255,255,0.65)',
                }}
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