import { Anchor, Image, Stack, Text } from '@mantine/core';

export function TmdbAttribution() {
  return (
    <Stack gap={6} align="center" py="md">
      <Anchor
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="The Movie Database"
      >
        <Image src="/tmdb-logo.svg" alt="The Movie Database" w={50} fit="contain" />
      </Anchor>

      <Text size="xs" c="dimmed" ta="center" maw={520}>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </Text>
    </Stack>
  );
}
