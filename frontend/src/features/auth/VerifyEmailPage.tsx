import {
    Button,
    Center,
    Loader,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';

import { useEffect, useRef, useState, } from 'react';
import { Link, useSearchParams, } from 'react-router-dom';
import { resendVerificationEmail, verifyEmail, } from '../../services/auth';
import { notifications } from '@mantine/notifications';

type VerificationStatus = | 'verifying' | 'success' | 'error';

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');

    const [status, setStatus] = useState<VerificationStatus>('verifying');

    const hasRequested = useRef(false);

    const [email, setEmail] = useState('');
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (hasRequested.current) {
            return;
        }

        hasRequested.current = true;

        async function handleVerification() {
            if (!token) {
                setStatus('error');
                return;
            }

            try {
                await verifyEmail(token);

                setStatus('success');
            } catch {
                setStatus('error');
            }
        }

        handleVerification();
    }, [token]);

    async function handleResend() {
        const normalizedEmail = email.trim();

        if (!normalizedEmail) {
            return;
        }

        try {
            setIsResending(true);
            await resendVerificationEmail(normalizedEmail,);

            notifications.show({
                title:
                    'Verification email requested',
                message:
                    'If the account exists and is not verified, a new verification link has been sent.',
                color: 'green',
            });
        } catch {
            notifications.show({
                title:
                    'Unable to resend email',
                message:
                    'Please try again later.',
                color: 'red',
            });
        } finally {
            setIsResending(false);
        }
    }

    return (
        <Center
            mih="100dvh"
            p="md"
        >
            <Paper
                p="xl"
                radius="xl"
                className="neo-raised"
                maw={460}
                w="100%"
            >
                {status === 'verifying' && (
                    <Stack
                        align="center"
                        gap="md"
                    >
                        <Loader />

                        <Title
                            order={2}
                            ta="center"
                        >
                            Verifying email
                        </Title>

                        <Text
                            ta="center"
                            className="bookshelf-text-muted"
                        >
                            Please wait while we
                            verify your email.
                        </Text>
                    </Stack>
                )}

                {status === 'success' && (
                    <Stack
                        align="center"
                        gap="md"
                    >
                        <Title
                            order={2}
                            ta="center"
                            c="var(--bookshelf-primary)"
                        >
                            Email verified
                        </Title>

                        <Text
                            ta="center"
                            className="bookshelf-text-muted"
                        >
                            Your email has been
                            successfully verified.
                        </Text>

                        <Button
                            component={Link}
                            to="/login"
                            variant="transparent"
                            className="bookshelf-button bookshelf-button-primary"
                        >
                            Go to login
                        </Button>
                    </Stack>
                )}

                {status === 'error' && (
                    <Stack
                        align="center"
                        gap="md"
                    >
                        <Title
                            order={2}
                            ta="center"
                        >
                            Verification failed
                        </Title>

                        <Text
                            ta="center"
                            className="bookshelf-text-muted"
                        >
                            This verification link
                            is invalid or has expired.
                        </Text>

                        <TextInput
                            label="Email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.currentTarget.value,
                                )
                            }
                            w="100%"
                            classNames={{
                                input:
                                    'bookshelf-input',
                            }}
                        />

                        <Button
                            type="button"
                            variant="transparent"
                            className="bookshelf-button bookshelf-button-primary"
                            loading={isResending}
                            disabled={!email.trim()}
                            onClick={handleResend}
                        >
                            Send new verification email
                        </Button>

                        <Button
                            component={Link}
                            to="/login"
                            variant="transparent"
                            className="bookshelf-button"
                        >
                            Back to login
                        </Button>
                    </Stack>
                )}
            </Paper>
        </Center>
    );
}