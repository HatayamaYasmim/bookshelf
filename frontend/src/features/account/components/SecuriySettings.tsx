import {
    Alert,
    Button,
    Paper,
    PasswordInput,
    Stack,
    Text,
} from '@mantine/core';

import { useState } from 'react';
import { changePassword } from '../../../services/account';

export function SecuritySettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChangePassword = async () => {
        setError(null);
        setSuccess(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Please fill in all password fields',);
            return;
        }

        if (newPassword.length < 8) {
            setError('New password must contain at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match',);
            return;
        }

        try {
            setLoading(true);
            const response = await changePassword({
                currentPassword,
                newPassword,
            });

            setSuccess(response.message);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unable to change password',
            );
        } finally {
            setLoading(false);
        }
    };

    const hasValues = currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0;
    const isDisabled = true;

    return (
        <Paper
            p="xl"
            radius="xl"
            className="bookshelf-account-card bookshelf-account-card-disabled"
        >
            <Stack
                gap="lg"
                className="bookshelf-security-settings"
            >
                <div>
                    <Text
                        size="sm"
                        className="bookshelf-text-muted"
                    >
                        Update your account password.
                    </Text>
                </div>

                {error && (
                    <Alert color="red">
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert color="green">
                        {success}
                    </Alert>
                )}

                <PasswordInput
                    label="Current password"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(event) =>
                        setCurrentPassword(
                            event.currentTarget.value,
                        )
                    } classNames={{
                        input: 'bookshelf-input',
                    }}
                    disabled={isDisabled}
                />

                <PasswordInput
                    label="New password"
                    placeholder="Enter your new password"
                    description="At least 8 characters"
                    value={newPassword}
                    onChange={(event) =>
                        setNewPassword(
                            event.currentTarget.value,
                        )
                    }
                    classNames={{
                        input: 'bookshelf-input',
                    }}
                    disabled={isDisabled}
                />

                <PasswordInput
                    label="Confirm new password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(event) =>
                        setConfirmPassword(
                            event.currentTarget.value,
                        )
                    }
                    disabled={isDisabled}
                    classNames={{
                        input: 'bookshelf-input',
                    }}
                />

                <div className="bookshelf-security-footer">
                    <Button
                        // onClick={handleChangePassword}
                        loading={loading}
                        disabled={isDisabled}
                        className="bookshelf-button bookshelf-button-primary"
                    >
                        Change password
                    </Button>
                </div>
            </Stack>
            {isDisabled && (
                <div className="bookshelf-card-overlay">
                    <div className="bookshelf-card-overlay-content">
                        <Text fw={700}>Coming soon</Text>

                        <Text
                            size="sm"
                            className="bookshelf-text-muted"
                            ta="center"
                        >
                            Password change is temporarily unavailable.
                        </Text>
                    </div>
                </div>
            )}
        </Paper>
    );
}