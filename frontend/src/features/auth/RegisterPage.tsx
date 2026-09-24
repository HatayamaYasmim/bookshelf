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

import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { GiSpellBook } from 'react-icons/gi';

import { ShaderBackground } from './components/ShaderBackground';

import { createRegisterSchema, type RegisterFormData } from './schemas/registerSchema';

import { register } from '../../services/auth';

export function RegisterPage() {
  const { t } = useTranslation();
  const registerSchema = createRegisterSchema(t);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      notifications.show({
        title: t('auth.register.successTitle'),
        message: t('auth.register.successMessage'),
      });

      navigate('/login', {
        replace: true,
      });
    } catch (error) {
      notifications.show({
        title: t('auth.register.errorTitle'),
        message: error instanceof Error ? error.message : t('auth.register.errorMessage'),
        color: 'red',
      });
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

              <Text size="sm" c="dimmed" ta="center">
                {t('auth.register.description')}
              </Text>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="md">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label={t('auth.register.nameLabel')}
                      placeholder={t('auth.register.namePlaceholder')}
                      size="md"
                      radius="xl"
                      error={errors.name?.message}
                      classNames={{
                        input: 'bookshelf-input',
                      }}
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label={t('auth.register.emailLabel')}
                      placeholder={t('auth.register.emailPlaceholder')}
                      size="md"
                      radius="xl"
                      error={errors.email?.message}
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
                      label={t('auth.register.passwordLabel')}
                      placeholder={t('auth.register.passwordPlaceholder')}
                      size="md"
                      radius="xl"
                      error={errors.password?.message}
                      classNames={{
                        input: 'bookshelf-input',
                        innerInput: 'bookshelf-password-inner-input',
                      }}
                    />
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <PasswordInput
                      {...field}
                      label={t('auth.register.confirmPasswordLabel')}
                      placeholder={t('auth.register.confirmPasswordPlaceholder')}
                      size="md"
                      radius="xl"
                      error={errors.confirmPassword?.message}
                      classNames={{
                        input: 'bookshelf-input',
                        innerInput: 'bookshelf-password-inner-input',
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
                  {t('auth.register.submit')}
                </Button>
              </Stack>
            </form>

            <Text size="sm" ta="center" c="dimmed">
              {t('auth.register.hasAccount')}{' '}
              <Anchor component="button" type="button" fw={600} onClick={() => navigate('/login')}>
                {t('auth.register.signIn')}
              </Anchor>
            </Text>
          </Stack>
        </Paper>
      </Center>
    </div>
  );
}
