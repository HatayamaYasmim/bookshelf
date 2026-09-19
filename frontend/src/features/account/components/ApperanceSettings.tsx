import {
    Button,
    Group,
    Stack,
    Text,
    Title,
} from '@mantine/core';

import { notifications } from '@mantine/notifications';

import {
    useEffect,
    useState,
} from 'react';

import type {
    PrimaryColor,
    ThemePreference,
} from '../../../services/account';
import { useAppearance } from '../AppearanceContext';

const themeOptions: {
    label: string;
    value: ThemePreference;
}[] = [
    {
        label: 'System',
        value: 'SYSTEM',
    },
    {
        label: 'Light',
        value: 'LIGHT',
    },
    {
        label: 'Dark',
        value: 'DARK',
    },
];

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
    const {
        preferences,
        savePreferences,
    } = useAppearance();

    const [
        theme,
        setTheme,
    ] = useState<ThemePreference>(
        preferences.theme,
    );

    const [
        primaryColor,
        setPrimaryColor,
    ] = useState<PrimaryColor>(
        preferences.primaryColor,
    );

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    useEffect(() => {
        setTheme(
            preferences.theme,
        );

        setPrimaryColor(
            preferences.primaryColor,
        );
    }, [preferences]);

    const hasChanges =
        theme !== preferences.theme ||
        primaryColor !==
            preferences.primaryColor;

    async function handleSave() {
        try {
            setIsSaving(true);

            await savePreferences({
                theme,
                primaryColor,
            });

            notifications.show({
                title: 'Appearance updated',
                message:
                    'Your appearance preferences have been saved.',
                color: 'green',
            });
        } catch {
            notifications.show({
                title: 'Unable to save',
                message:
                    'It was not possible to update your appearance preferences.',
                color: 'red',
            });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Stack gap="xl">
            <Stack gap={4}>
                <Title
                    order={3}
                    size="h4"
                >
                    Appearance
                </Title>

                <Text
                    size="sm"
                    className="bookshelf-text-muted"
                >
                    Customize the application theme
                    and primary color.
                </Text>
            </Stack>

            <Stack gap="sm">
                <Text fw={600}>
                    Theme
                </Text>

                <Group gap="sm">
                    {themeOptions.map(
                        (option) => {
                            const isSelected =
                                theme ===
                                option.value;

                            return (
                                <Button
                                    key={
                                        option.value
                                    }
                                    type="button"
                                    variant="transparent"
                                    className={`bookshelf-appearance-option ${
                                        isSelected
                                            ? 'bookshelf-appearance-option-active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setTheme(
                                            option.value,
                                        )
                                    }
                                >
                                    {
                                        option.label
                                    }
                                </Button>
                            );
                        },
                    )}
                </Group>
            </Stack>

            <Stack gap="sm">
                <Text fw={600}>
                    Primary color
                </Text>

                <Text
                    size="sm"
                    className="bookshelf-text-muted"
                >
                    Choose the accent color used
                    throughout the application.
                </Text>

                <Group gap="sm">
                    {primaryColors.map(
                        (color) => {
                            const isSelected =
                                primaryColor ===
                                color;

                            return (
                                <button
                                    key={color}
                                    type="button"
                                    className={`bookshelf-color-option ${
                                        isSelected
                                            ? 'bookshelf-color-option-active'
                                            : ''
                                    }`}
                                    style={{
                                        background:
                                            `var(--mantine-color-${color}-6)`,
                                    }}
                                    aria-label={
                                        color
                                    }
                                    title={
                                        color
                                    }
                                    onClick={() =>
                                        setPrimaryColor(
                                            color,
                                        )
                                    }
                                />
                            );
                        },
                    )}
                </Group>
            </Stack>

            <Group justify="flex-end">
                <Button
                    type="button"
                    variant="transparent"
                    className="bookshelf-button bookshelf-button-primary"
                    disabled={!hasChanges}
                    loading={isSaving}
                    onClick={
                        handleSave
                    }
                >
                    Save changes
                </Button>
            </Group>
        </Stack>
    );
}