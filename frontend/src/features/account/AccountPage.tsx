import { Container, Grid, Paper, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { AppearanceSettings } from './components/ApperanceSettings';
import { ProfileSettings } from './components/ProfileSettings';
import { SecuritySettings } from './components/SecuritySettings';

export function AccountPage() {
  const { t } = useTranslation();

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Stack gap={4}>
          <Title order={2} c="var(--bookshelf-primary)" fw={700}>
            {t('account.page.title')}
          </Title>

          <Text className="bookshelf-text-muted">{t('account.page.description')}</Text>
        </Stack>

        <Grid gap="xl">
          <Grid.Col
            span={{
              base: 12,
              md: 6,
            }}
          >
            <Paper p="xl" radius="xl" className="neo-raised bookshelf-account-card">
              <Stack gap="sm">
                <Title order={3} size="h4">
                  {t('account.profile.title')}
                </Title>

                <ProfileSettings />
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col
            span={{
              base: 12,
              md: 6,
            }}
          >
            <Paper p="xl" radius="xl" className="neo-raised bookshelf-account-card">
              <AppearanceSettings />
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper p="xl" radius="xl" className="neo-raised bookshelf-account-card">
              <Stack gap="sm">
                <Title order={3} size="h4">
                  {t('account.security.title')}
                </Title>

                <SecuritySettings />
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
