import { apiFetch } from "./api";

export type ThemePreference = | 'SYSTEM' | 'LIGHT' | 'DARK';

export type PrimaryColor =
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'green'
    | 'lime'
    | 'yellow'
    | 'orange'
    | 'red'
    | 'pink'
    | 'grape'
    | 'violet';

export interface UserPreferences {
    theme: ThemePreference;
    primaryColor: PrimaryColor;
}

export interface UpdateUserPreferences {
    theme?: ThemePreference;
    primaryColor?: PrimaryColor;
}

export async function getUserPreferences(): Promise<UserPreferences> {
    const response = await apiFetch(
        '/account/preferences',
    );

    if (!response.ok) {
        throw new Error(
            'Failed to load user preferences',
        );
    }

    return response.json();
}

export async function updateUserPreferences(
    data: UpdateUserPreferences,
): Promise<UserPreferences> {
    const response = await apiFetch(
        '/account/preferences',
        {
            method: 'PATCH',
            headers: {
                'Content-Type':
                    'application/json',
            },
            body: JSON.stringify(data),
        },
    );

    if (!response.ok) {
        throw new Error(
            'Failed to update user preferences',
        );
    }

    return response.json();
}