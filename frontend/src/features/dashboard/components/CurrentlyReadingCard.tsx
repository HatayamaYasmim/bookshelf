import {
  Badge,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { IconBook2 } from '@tabler/icons-react';

import type {
  CurrentlyReadingBook,
} from '../../../types/dashboard';

interface CurrentlyReadingCardProps {
  books: CurrentlyReadingBook[];
}

export function CurrentlyReadingCard({
  books,
}: CurrentlyReadingCardProps) {
  const currentBook = books[0];

  return (
    <Paper
      p="xl"
      radius="xl"
      className="bookshelf-dashboard-card"
      mih={360}
    >
      <Stack gap="xl">
        <Group gap="sm">
          <IconBook2
            size={21}
            color="var(--bookshelf-text-muted)"
          />

          <Title
            order={3}
            size="h4"
          >
            Currently Reading
          </Title>
        </Group>

        {!currentBook ? (
          <Stack
            align="center"
            justify="center"
            gap="sm"
            mih={240}
          >
            <IconBook2
              size={42}
              color="var(--bookshelf-text-muted)"
              stroke={1.3}
            />

            <Text
              fw={500}
              ta="center"
            >
              No book in progress
            </Text>

            <Text
              size="sm"
              c="dimmed"
              ta="center"
            >
              Books marked as Reading will appear here.
            </Text>
          </Stack>
        ) : (
          <Stack
            align="center"
            gap="lg"
          >
            <Paper
              p="xl"
              radius="xl"
              className="bookshelf-current-reading-cover"
            >
              <IconBook2
                size={64}
                stroke={1.2}
                color="var(--bookshelf-primary)"
              />
            </Paper>

            <Stack
              gap={3}
              align="center"
            >
              <Text
                fw={700}
                size="lg"
                ta="center"
              >
                {currentBook.title}
              </Text>

              <Text
                size="sm"
                c="dimmed"
                ta="center"
              >
                {currentBook.author.name}
              </Text>
            </Stack>

            {currentBook.genres.length > 0 && (
              <Group
                gap={6}
                justify="center"
              >
                {currentBook.genres.map(
                  (genre) => (
                    <Badge
                      key={genre.id}
                      variant="light"
                      radius="xl"
                      styles={{
                        root: {
                          border: 'none',
                          textTransform: 'none',
                          boxShadow:
                            'inset 3px 3px 6px rgba(0,0,0,0.05), inset -3px -3px 6px rgba(255,255,255,0.5)',
                        },
                      }}
                    >
                      {genre.name}
                    </Badge>
                  ),
                )}
              </Group>
            )}

            <Badge
              variant="transparent"
              radius="xl"
              styles={{
                root: {
                  color: '#1971c2',
                  border: 'none',
                  textTransform: 'none',
                  boxShadow:
                    'inset 3px 3px 6px rgba(0,0,0,0.05), inset -3px -3px 6px rgba(255,255,255,0.5)',
                },
              }}
            >
              Reading
            </Badge>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}