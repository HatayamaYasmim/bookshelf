import {
    Button,
    Stack,
    TextInput,
} from '@mantine/core';

import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { updateProfile } from '../../../services/account';
import { useAuth } from '../../auth/hooks/useAuth';

export function ProfileSettings() {
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

    const hasChanges =
        normalizedName !== currentUser.name ||
        normalizedEmail !== currentUser.email;

    async function handleSave() {
        if (!normalizedName || !normalizedEmail) {
            return;
        }

        const emailChanged =
            normalizedEmail !== currentUser.email;

        try {
            setIsSaving(true);

            await updateProfile({
                name: normalizedName,
                email: normalizedEmail,
            });

            await refreshUser();

            notifications.show({
                title: 'Profile updated',
                message: emailChanged
                    ? 'Profile updated. Please verify your new email address.'
                    : 'Your profile has been updated.',
                color: 'green',
            });
        } catch (error) {
            notifications.show({
                title: 'Unable to update profile',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Please try again.',
                color: 'red',
            });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Stack gap="md" className="bookshelf-profile-settings">
            <TextInput
                label="Name"
                value={name}
                onChange={(event) =>
                    setName(event.currentTarget.value)
                }
                classNames={{
                    input: 'bookshelf-input',
                }}
            />

            <TextInput
                label="Email"
                type="email"
                value={email}
                onChange={(event) =>
                    setEmail(event.currentTarget.value)
                }
                classNames={{
                    input: 'bookshelf-input',
                }}
            />

            {/* <div className="bookshelf-profile-meta">
                {currentUser.emailVerifiedAt ? (
                    <Text
                        size="sm"
                        className="bookshelf-text-muted"
                    >
                        Email verified
                    </Text>
                ) : (
                    <Stack gap="xs">
                        <Text
                            size="sm"
                            className="bookshelf-text-muted"
                        >
                            Email not verified
                        </Text>

                        <Button
                            className="bookshelf-button bookshelf-button-primary"
                            size="compact-sm"
                            w="fit-content"
                        >
                            Resend verification email
                        </Button>
                    </Stack>
                )}
            </div> */}

            <div className="bookshelf-profile-footer">
                <Button
                    onClick={handleSave}
                    loading={isSaving}
                    disabled={
                        !hasChanges ||
                        !normalizedName ||
                        !normalizedEmail
                    }
                    className="bookshelf-button bookshelf-button-primary"
                >
                    Save changes
                </Button>
            </div>
        </Stack>
    );
}