import {
    Anchor,
    Button,
    Center,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';

import { IconBooks } from '@tabler/icons-react';

import { ShaderBackground } from './components/ShaderBackground';
import { GiSpellBook } from 'react-icons/gi';

export function LoginPage() {
    return (
        <div className="bookshelf-auth-page">
            <ShaderBackground />

            <Center className="bookshelf-auth-content">
                <Paper
                    className="bookshelf-login-card"
                    radius="xl"
                    p="xl"
                    w="100%"
                    maw={430}
                >
                    <Stack gap="lg">
                        <Stack align="center" gap="xs">
                            <div className="bookshelf-login-logo">
                                <GiSpellBook
                                    size={28}
                                    color="var(--bookshelf-primary)"
                                />
                            </div>

                            <Title
                                order={3}
                                c="var(--bookshelf-primary)"
                            >
                                Bookshelf
                            </Title>

                            <Text
                                size="sm"
                                c="dimmed"
                                ta="center"
                            >
                                Welcome back. Sign in to continue
                                to your bookshelf.
                            </Text>
                        </Stack>

                        <Stack gap="md">
                            <TextInput
                                label="Email"
                                placeholder="you@example.com"
                                size="md"
                                radius="xl"
                                classNames={{
                                    input: 'bookshelf-input',
                                }}
                            />

                            <PasswordInput
                                label="Password"
                                placeholder="Enter your password"
                                size="md"
                                radius="xl"
                                classNames={{
                                    input: 'bookshelf-input',
                                    innerInput:
                                        'bookshelf-password-inner-input',
                                }}
                            />

                            <Button
                                size="md"
                                radius="xl"
                                fullWidth
                                className="bookshelf-button bookshelf-button-primary"
                            >
                                Sign in
                            </Button>
                        </Stack>

                        <Text
                            size="sm"
                            ta="center"
                            c="dimmed"
                        >
                            Don't have an account?{' '}
                            <Anchor
                                component="button"
                                fw={600}
                            >
                                Create account
                            </Anchor>
                        </Text>
                    </Stack>
                </Paper>
            </Center>
        </div>
    );
}