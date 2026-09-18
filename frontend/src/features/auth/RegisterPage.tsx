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

import { notifications } from '@mantine/notifications';

import {
    Controller,
    useForm,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useNavigate } from 'react-router-dom';

import { GiSpellBook } from 'react-icons/gi';

import { ShaderBackground } from './components/ShaderBackground';

import {
    registerSchema,
    type RegisterFormData,
} from './schemas/registerSchema';

import { register } from '../../services/auth';

export function RegisterPage() {
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(
        data: RegisterFormData,
    ) {
        try {
            await register({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            notifications.show({
                title: 'Account created',
                message:
                    'Your account was created successfully. You can now sign in.',
            });

            navigate('/login', {
                replace: true,
            });
        } catch (error) {
            notifications.show({
                title: 'Could not create account',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Failed to create account',
                color: 'red',
            });
        }
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
                                Create your account and start building your bookshelf.
                            </Text>
                        </Stack>

                        <form
                            onSubmit={handleSubmit(
                                onSubmit,
                            )}
                        >
                            <Stack gap="md">
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({
                                        field,
                                    }) => (
                                        <TextInput
                                            {...field}
                                            label="Name"
                                            placeholder="Your name"
                                            size="md"
                                            radius="xl"
                                            error={
                                                errors
                                                    .name
                                                    ?.message
                                            }
                                            classNames={{
                                                input: 'bookshelf-input',
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="email"
                                    control={control}
                                    render={({
                                        field,
                                    }) => (
                                        <TextInput
                                            {...field}
                                            label="Email"
                                            placeholder="you@example.com"
                                            size="md"
                                            radius="xl"
                                            error={
                                                errors
                                                    .email
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
                                    render={({
                                        field,
                                    }) => (
                                        <PasswordInput
                                            {...field}
                                            label="Password"
                                            placeholder="Create a password"
                                            size="md"
                                            radius="xl"
                                            error={
                                                errors
                                                    .password
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

                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({
                                        field,
                                    }) => (
                                        <PasswordInput
                                            {...field}
                                            label="Confirm password"
                                            placeholder="Repeat your password"
                                            size="md"
                                            radius="xl"
                                            error={
                                                errors
                                                    .confirmPassword
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
                                    loading={
                                        isSubmitting
                                    }
                                    className="bookshelf-button bookshelf-button-primary"
                                >
                                    Create account
                                </Button>
                            </Stack>
                        </form>

                        <Text
                            size="sm"
                            ta="center"
                            c="dimmed"
                        >
                            Already have an account?{' '}
                            <Anchor
                                component="button"
                                type="button"
                                fw={600}
                                onClick={() =>
                                    navigate(
                                        '/login',
                                    )
                                }
                            >
                                Sign in
                            </Anchor>
                        </Text>
                    </Stack>
                </Paper>
            </Center>
        </div>
    );
}