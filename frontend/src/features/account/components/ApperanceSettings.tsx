import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { PrimaryColor, ThemePreference } from '../../../services/account';
import { useAppearance } from '../AppearanceContext';

const themeOptions: ThemePreference[] = ['SYSTEM', 'LIGHT', 'DARK'];

const primaryColors: PrimaryColor[] = [
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange',
  'red',
  'pink',
  'grape',
  'violet',
];

export function AppearanceSettings() {
  const { t } = useTranslation();
  const { preferences, savePreferences } = useAppearance();

  const [theme, setTheme] = useState<ThemePreference>(preferences.theme);
  const [primaryColor, setPrimaryColor] = useState<PrimaryColor>(preferences.primaryColor);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTheme(preferences.theme);
    setPrimaryColor(preferences.primaryColor);
  }, [preferences]);

  const hasChanges = theme !== preferences.theme || primaryColor !== preferences.primaryColor;

  async function handleSave() {
    try {
      setIsSaving(true);

      await savePreferences({
        theme,
        primaryColor,
      });

      notifications.show({
        title: t('account.appearance.successTitle'),
        message: t('account.appearance.successMessage'),
        color: 'green',
      });
    } catch {
      notifications.show({
        title: t('account.appearance.errorTitle'),
        message: t('account.appearance.errorMessage'),
        color: 'red',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Stack gap="xl">
      <Stack gap={4}>
        <Title order={3} size="h4">
          {t('account.appearance.title')}
        </Title>

        <Text size="sm" className="bookshelf-text-muted">
          {t('account.appearance.description')}
        </Text>
      </Stack>

      <Stack gap="sm">
        <Text fw={600}>{t('account.appearance.theme')}</Text>

        <Group gap="sm">
          {themeOptions.map((option) => {
            const isSelected = theme === option;

            return (
              <Button
                key={option}
                type="button"
                variant="transparent"
                className={`bookshelf-button bookshelf-appearance-option ${
                  isSelected ? 'bookshelf-appearance-option-active' : ''
                }`}
                onClick={() => setTheme(option)}
              >
                {t(`account.appearance.themes.${option.toLowerCase()}`)}
              </Button>
            );
          })}
        </Group>
      </Stack>

      <Stack gap="sm">
        <Text fw={600}>{t('account.appearance.primaryColor')}</Text>

        <Text size="sm" className="bookshelf-text-muted">
          {t('account.appearance.primaryColorDescription')}
        </Text>

        <Group gap="sm">
          {primaryColors.map((color) => {
            const isSelected = primaryColor === color;
            const colorLabel = t(`account.appearance.colors.${color}`);

            return (
              <button
                key={color}
                type="button"
                className={`bookshelf-color-option ${
                  isSelected ? 'bookshelf-color-option-active' : ''
                }`}
                style={{
                  background: `var(--mantine-color-${color}-6)`,
                }}
                aria-label={colorLabel}
                title={colorLabel}
                onClick={() => setPrimaryColor(color)}
              />
            );
          })}
        </Group>
      </Stack>

      <Group justify="flex-end">
        <Button
          type="button"
          variant="transparent"
          className="bookshelf-button bookshelf-button-primary"
          disabled={!hasChanges}
          loading={isSaving}
          onClick={handleSave}
        >
          {t('common.saveChanges')}
        </Button>
      </Group>
    </Stack>
  );
}
