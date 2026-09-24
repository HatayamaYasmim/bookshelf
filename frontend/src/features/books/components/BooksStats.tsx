import { Group, Paper, SimpleGrid, Text, ThemeIcon } from '@mantine/core';

import { LuBookmark, LuBookOpenCheck } from 'react-icons/lu';

import { GiBookCover, GiBookshelf } from 'react-icons/gi';

import type { BooksStatsResponse } from '../../../types/book';

interface BooksStatsProps {
  stats: BooksStatsResponse;
}

export function BooksStats({ stats }: BooksStatsProps) {
  const statsItems = [
    {
      label: 'TOTAL BOOKS',
      value: stats.total,
      accentColor: 'var(--bookshelf-primary)',
      icon: GiBookshelf,
    },
    {
      label: 'READ',
      value: stats.read,
      accentColor: 'var(--mantine-color-green-9)',
      icon: LuBookOpenCheck,
    },
    {
      label: 'READING',
      value: stats.reading,
      accentColor: 'var(--mantine-color-blue-9)',
      icon: GiBookCover,
    },
    {
      label: 'UNREAD',
      value: stats.unread,
      accentColor: 'var(--bookshelf-text-muted)',
      icon: LuBookmark,
    },
  ];

  return (
    <SimpleGrid
      cols={{
        base: 2,
        sm: 2,
        lg: 4,
      }}
      spacing={{ base: 'sm', sm: 'xl' }}
    >
      {statsItems.map((stat) => {
        const Icon = stat.icon;

        return (
          <Paper
            key={stat.label}
            p={{
              base: 'sm',
              sm: 'xl',
            }}
            radius="xl"
            className="neo-raised bookshelf-book-stat-card"
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
                  lh={1}
                  className="bookshelf-book-stat-value"
                  style={{
                    color: stat.accentColor,
                  }}
                >
                  {stat.value}
                </Text>
              </div>

              <ThemeIcon
                size={52}
                variant="transparent"
                className="bookshelf-stat-icon"
                style={{
                  color: stat.accentColor,
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
