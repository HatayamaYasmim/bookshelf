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
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShaderBackground } from './components/ShaderBackground';
import { createLoginSchema, type LoginFormData } from './schemas/loginSchema';
import { useAuth } from './hooks/useAuth';

export function LoginPage() {
  const { t } = useTranslation();
  const loginSchema = createLoginSchema(t);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await signIn(data);
      navigate('/library');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bookshelf-auth-page">
      <ShaderBackground />

      <Center className="bookshelf-auth-content">
        <Paper className="bookshelf-login-card" radius="xl" p="xl" w="100%" maw={430}>
          <Stack gap="lg">
            <Stack align="center" gap="xs">
              <div className="bookshelf-login-logo">
                <GiSpellBook size={28} color="var(--bookshelf-primary)" />
              </div>

              <Title order={3} c="var(--bookshelf-primary)">
                Bookshelf
              </Title>

              <Text size="sm" ta="center" className="bookshelf-auth-muted">
                {t('auth.login.welcome')}
              </Text>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="md">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label={t('auth.login.emailLabel')}
                      placeholder={t('auth.login.emailPlaceholder')}
                      size="md"
                      radius="xl"
                      error={errors.email?.message}
                      classNames={{
                        label: 'bookshelf-auth-label',
                        input: 'bookshelf-input bookshelf-auth-input',
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
                      label={t('auth.login.passwordLabel')}
                      placeholder={t('auth.login.passwordPlaceholder')}
                      size="md"
                      radius="xl"
                      error={errors.password?.message}
                      classNames={{
                        label: 'bookshelf-auth-label',
                        input: 'bookshelf-input bookshelf-auth-input',
                        innerInput: 'bookshelf-password-inner-input',
                        visibilityToggle: 'bookshelf-password-toggle',
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
                  className="bookshelf-login-button"
                >
                  {t('auth.login.submit')}
                </Button>
              </Stack>
            </form>

            <Text size="sm" ta="center" className="bookshelf-auth-muted">
              {t('auth.login.noAccount')}{' '}
              <Anchor
                component="button"
                fw={600}
                className="bookshelf-auth-link"
                onClick={() => navigate('/register')}
              >
                {t('auth.login.createAccount')}
              </Anchor>
            </Text>
          </Stack>
        </Paper>
      </Center>
    </div>
  );
}
