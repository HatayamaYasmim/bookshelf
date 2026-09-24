import {
    Button,
    Paper,
    PasswordInput,
    Stack,
    Text,
} from '@mantine/core';
import { useState } from 'react';

export function SecuritySettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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