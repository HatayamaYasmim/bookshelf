import {
    Container,
    Grid,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { AppearanceSettings } from './components/ApperanceSettings';
import { ProfileSettings } from './components/ProfileSettings';
import { SecuritySettings } from './components/SecuritySettings';

export function AccountPage() {
    return (
        <Container
            size="xl"
            py="xl"
        >
            <Stack gap="xl">
                <Stack gap={4}>
                    <Title
                        order={2}
                        c="var(--bookshelf-primary)"
                        fw={700}
                    >
                        Account
                    </Title>

                    <Text className="bookshelf-text-muted">
                        Manage your profile, appearance and security.
                    </Text>
                </Stack>

                <Grid gap="xl">
                    <Grid.Col
                        span={{
                            base: 12,
                            md: 6,
                        }}
                    >
                        <Paper
                            p="xl"
                            radius="xl"
                            className="neo-raised bookshelf-account-card">
                            <Stack gap="sm">
                                <Title
                                    order={3}
                                    size="h4"
                                >
                                    Profile
                                </Title>

                                <Text
                                    size="sm"
                                    className="bookshelf-text-muted"
                                >
                                 <ProfileSettings/>
                                </Text>
                            </Stack>
                        </Paper>
                    </Grid.Col>
                    <Grid.Col
                        span={{
                            base: 12,
                            md: 6,
                        }}
                    >
                        <Paper
                            p="xl"
                            radius="xl"
                            className="neo-raised"
                        >
                            <AppearanceSettings />
                        </Paper>
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Paper
                            p="xl"
                            radius="xl"
                            className="neo-raised bookshelf-account-card"
                        >
                            <Stack gap="sm">
                                <Title
                                    order={3}
                                    size="h4"
                                >
                                    Security
                                </Title>

                                <Text
                                    size="sm"
                                    className="bookshelf-text-muted"
                                >
                                   <SecuritySettings />
                                </Text>
                            </Stack>
                        </Paper>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Container>
    );
}