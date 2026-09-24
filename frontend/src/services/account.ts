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

export interface UpdateProfileData {
    name?: string;
    email?: string;
}

export interface UpdateProfileResponse {
    id: number;
    name: string;
    email: string;
    emailVerifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
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

export async function updateProfile(
    data: UpdateProfileData,
): Promise<UpdateProfileResponse> {
    const response = await apiFetch(
        '/account/profile',
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
        const error = await response
            .json()
            .catch(() => null);
        throw new Error(
            error?.message ??
                'Unable to update profile',
        );
    }

    return response.json();
}

export async function changePassword( data: ChangePasswordRequest,) {
  const response = await apiFetch('/account/password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => null);

    throw new Error(
      error?.message ??
        'Unable to change password',
    );
  }
  return response.json();
}
