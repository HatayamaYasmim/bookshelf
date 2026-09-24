import { Button, Center, Loader, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

import { resendVerificationEmail, verifyEmail } from '../../services/auth';

type VerificationStatus = 'verifying' | 'success' | 'error';

export function VerifyEmailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  const hasRequested = useRef(false);

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

      await resendVerificationEmail(normalizedEmail);

      notifications.show({
        title: t('auth.verifyEmail.resendSuccessTitle'),
        message: t('auth.verifyEmail.resendSuccessMessage'),
        color: 'green',
      });
    } catch {
      notifications.show({
        title: t('auth.verifyEmail.resendErrorTitle'),
        message: t('auth.verifyEmail.resendErrorMessage'),
        color: 'red',
      });
    } finally {
      setIsResending(false);
    }
  }

  return (
    <Center mih="100dvh" p="md">
      <Paper p="xl" radius="xl" className="neo-raised" maw={460} w="100%">
        {status === 'verifying' && (
          <Stack align="center" gap="md">
            <Loader />

            <Title order={2} ta="center">
              {t('auth.verifyEmail.verifyingTitle')}
            </Title>

            <Text ta="center" className="bookshelf-text-muted">
              {t('auth.verifyEmail.verifyingDescription')}
            </Text>
          </Stack>
        )}

        {status === 'success' && (
          <Stack align="center" gap="md">
            <Title order={2} ta="center" c="var(--bookshelf-primary)">
              {t('auth.verifyEmail.successTitle')}
            </Title>

            <Text ta="center" className="bookshelf-text-muted">
              {t('auth.verifyEmail.successDescription')}
            </Text>

            <Button
              component={Link}
              to="/login"
              variant="transparent"
              className="bookshelf-button bookshelf-button-primary"
            >
              {t('auth.verifyEmail.goToLogin')}
            </Button>
          </Stack>
        )}

        {status === 'error' && (
          <Stack align="center" gap="md">
            <Title order={2} ta="center">
              {t('auth.verifyEmail.errorTitle')}
            </Title>

            <Text ta="center" className="bookshelf-text-muted">
              {t('auth.verifyEmail.errorDescription')}
            </Text>

            <TextInput
              label={t('auth.verifyEmail.emailLabel')}
              placeholder={t('auth.verifyEmail.emailPlaceholder')}
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              w="100%"
              classNames={{
                input: 'bookshelf-input',
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
              {t('auth.verifyEmail.resend')}
            </Button>

            <Button component={Link} to="/login" variant="transparent" className="bookshelf-button">
              {t('auth.verifyEmail.backToLogin')}
            </Button>
          </Stack>
        )}
      </Paper>
    </Center>
  );
}
