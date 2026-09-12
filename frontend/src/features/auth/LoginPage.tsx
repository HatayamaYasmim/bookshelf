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

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { GiSpellBook } from 'react-icons/gi';

import { ShaderBackground } from './components/ShaderBackground';
import {
    loginSchema,
    type LoginFormData,
} from './schemas/loginSchema';
import { useAuth } from './hooks/useAuth';

export function LoginPage() {
        const {
        user,
        isAuthenticated,
    } = useAuth();

    console.log({
        user,
        isAuthenticated,
    });
    
    const {
        control,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),

        defaultValues: {
            email: '',
            password: '',
        },
    });

    function onSubmit(data: LoginFormData) {
        console.log('Login data:', data);
    }

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
                        <Stack
                            align="center"
                            gap="xs"
                        >
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

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Stack gap="md">
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextInput
                                            {...field}
                                            label="Email"
                                            placeholder="you@example.com"
                                            size="md"
                                            radius="xl"
                                            error={
                                                errors.email
                                                    ?.message
                                            }
                                            classNames={{
                                                input: 'bookshelf-input',
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <PasswordInput
                                            {...field}
                                            label="Password"
                                            placeholder="Enter your password"
                                            size="md"
                                            radius="xl"
                                            error={
                                                errors.password
                                                    ?.message
                                            }
                                            classNames={{
                                                input: 'bookshelf-input',
                                                innerInput:
                                                    'bookshelf-password-inner-input',
                                            }}
                                        />
                                    )}
                                />

                                <Button
                                    type="submit"
                                    size="md"
                                    radius="xl"
                                    fullWidth
                                    loading={isSubmitting}
                                    className="bookshelf-button bookshelf-button-primary"
                                >
                                    Sign in
                                </Button>
                            </Stack>
                        </form>

                        <Text
                            size="sm"
                            ta="center"
                            c="dimmed"
                        >
                            Don't have an account?{' '}
                            <Anchor
                                component="button"
                                fw={600}>
                                Create account
                            </Anchor>
                        </Text>
                    </Stack>
                </Paper>
            </Center>
        </div>
    );
}