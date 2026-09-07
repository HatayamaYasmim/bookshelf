import {
  Grid,
  Group,
  Paper,
  Skeleton,
  Stack,
} from '@mantine/core';

export function DashboardSkeleton() {
  return (
    <Stack gap="xl">
      {/* Page title */}
      <Stack gap="xs">
        <Skeleton
          height={34}
          width={260}
          radius="md"
        />

        <Skeleton
          height={18}
          width={310}
          radius="md"
        />
      </Stack>

      {/* Statistics */}
      <Grid gap="xl">
        {Array.from({ length: 3 }).map(
          (_, index) => (
            <Grid.Col
              key={index}
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
                <Stack gap="sm">
                  <Skeleton
                    height={14}
                    width="45%"
                  />

                  <Skeleton
                    height={36}
                    width="25%"
                  />

                  <Skeleton
                    height={14}
                    width="35%"
                  />
                </Stack>
              </Paper>
            </Grid.Col>
          ),
        )}
      </Grid>

      {/* Favorite genres + Currently reading */}
      <Grid gap="xl">
        <Grid.Col
          span={{
            base: 12,
            md: 8,
          }}
        >
          <Paper
            p="xl"
            radius="xl"
            className="bookshelf-dashboard-card"
            mih={360}
          >
            <Stack gap="xl">
              <Skeleton
                height={24}
                width={180}
              />

              <Group
                justify="center"
                gap="xl"
                wrap="wrap"
              >
                <Skeleton
                  circle
                  height={170}
                />

                <Stack gap="md">
                  {Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <Skeleton
                      key={index}
                      height={18}
                      width={170}
                    />
                  ))}
                </Stack>
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12,
            md: 4,
          }}
        >
          <Paper
            p="xl"
            radius="xl"
            className="bookshelf-dashboard-card"
            mih={360}
          >
            <Stack
              gap="lg"
              align="center"
            >
              <Skeleton
                height={24}
                width={170}
                style={{
                  alignSelf:
                    'flex-start',
                }}
              />

              <Skeleton
                height={150}
                width={105}
                radius="md"
              />

              <Skeleton
                height={20}
                width={160}
              />

              <Skeleton
                height={15}
                width={120}
              />

              <Skeleton
                height={12}
                width="90%"
              />
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Reading activity */}
      <Paper
        p="xl"
        radius="xl"
        className="bookshelf-dashboard-card"
        mih={300}
      >
        <Stack gap="xl">
          <Group justify="space-between">
            <Skeleton
              height={24}
              width={180}
            />

            <Skeleton
              height={34}
              width={120}
              radius="xl"
            />
          </Group>

          <Skeleton
            height={190}
            radius="lg"
          />
        </Stack>
      </Paper>
    </Stack>
  );
}