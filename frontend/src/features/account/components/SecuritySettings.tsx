import { Button, Paper, PasswordInput, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function SecuritySettings() {
  const { t } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isDisabled = true;

  return (
    <Paper p="xl" radius="xl" className="bookshelf-account-card bookshelf-account-card-disabled">
      <Stack gap="lg" className="bookshelf-security-settings">
        <div>
          <Text size="sm" className="bookshelf-text-muted">
            {t('account.security.description')}
          </Text>
        </div>

        <PasswordInput
          label={t('account.security.currentPassword')}
          placeholder={t('account.security.currentPasswordPlaceholder')}
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.currentTarget.value)}
          classNames={{
            input: 'bookshelf-input',
          }}
          disabled={isDisabled}
        />

        <PasswordInput
          label={t('account.security.newPassword')}
          placeholder={t('account.security.newPasswordPlaceholder')}
          description={t('account.security.passwordRequirement')}
          value={newPassword}
          onChange={(event) => setNewPassword(event.currentTarget.value)}
          classNames={{
            input: 'bookshelf-input',
          }}
          disabled={isDisabled}
        />

        <PasswordInput
          label={t('account.security.confirmPassword')}
          placeholder={t('account.security.confirmPasswordPlaceholder')}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.currentTarget.value)}
          disabled={isDisabled}
          classNames={{
            input: 'bookshelf-input',
          }}
        />

        <div className="bookshelf-security-footer">
          <Button disabled={isDisabled} className="bookshelf-button bookshelf-button-primary">
            {t('account.security.changePassword')}
          </Button>
        </div>
      </Stack>

      {isDisabled && (
        <div className="bookshelf-card-overlay">
          <div className="bookshelf-card-overlay-content">
            <Text fw={700}>{t('account.security.comingSoon')}</Text>

            <Text size="sm" className="bookshelf-text-muted" ta="center">
              {t('account.security.unavailable')}
            </Text>
          </div>
        </div>
      )}
    </Paper>
  );
}
