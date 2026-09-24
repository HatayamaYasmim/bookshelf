import { Button, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { updateProfile } from '../../../services/account';
import { useAuth } from '../../auth/hooks/useAuth';

export function ProfileSettings() {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
  }, [user]);

  if (!user) {
    return null;
  }

  const currentUser = user;
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const hasChanges = normalizedName !== currentUser.name || normalizedEmail !== currentUser.email;

  async function handleSave() {
    if (!normalizedName || !normalizedEmail) {
      return;
    }

    const emailChanged = normalizedEmail !== currentUser.email;

    try {
      setIsSaving(true);

      await updateProfile({
        name: normalizedName,
        email: normalizedEmail,
      });

      await refreshUser();

      notifications.show({
        title: t('account.profile.successTitle'),
        message: emailChanged
          ? t('account.profile.successEmailChanged')
          : t('account.profile.successMessage'),
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: t('account.profile.errorTitle'),
        message: error instanceof Error ? error.message : t('account.profile.errorMessage'),
        color: 'red',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Stack gap="md" className="bookshelf-profile-settings">
      <TextInput
        label={t('account.profile.name')}
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        classNames={{
          input: 'bookshelf-input',
        }}
      />

      <TextInput
        label={t('account.profile.email')}
        type="email"
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        classNames={{
          input: 'bookshelf-input',
        }}
      />

      <div className="bookshelf-profile-footer">
        <Button
          onClick={handleSave}
          loading={isSaving}
          disabled={!hasChanges || !normalizedName || !normalizedEmail}
          className="bookshelf-button bookshelf-button-primary"
        >
          {t('common.saveChanges')}
        </Button>
      </div>
    </Stack>
  );
}
