import { apiFetch } from "./api";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    emailVerifiedAt: string | null;
}

export interface LoginResponse {
    user: AuthUser;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface VerifyEmailResponse {
    message: string;
}

export interface ResendVerificationResponse {
    message: string;
}

export async function login(
    data: LoginRequest,
): Promise<LoginResponse> {
    const response = await apiFetch(
        `/auth/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            skipUnauthorizedHandler: true,
        },
    );

    if (!response.ok) {
        throw new Error(
            'Invalid email or password',
        );
    }

    return response.json();
}

export async function getMe(): Promise<AuthUser> {
    const response = await apiFetch(
        `/auth/me`,
        {
            method: 'GET',
            skipUnauthorizedHandler: true,
        },
    );

    if (!response.ok) {
        throw new Error('Not authenticated');
    }

    return response.json();
}

export async function logout(): Promise<void> {
    const response = await apiFetch(
        `/auth/logout`,
        {
            method: 'POST',
        },
    );

    if (!response.ok) {
        throw new Error('Failed to logout');
    }
}

export async function register(
    data: RegisterRequest,
): Promise<RegisterResponse> {
    const response = await apiFetch(
        `/auth/register`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    );

    if (!response.ok) {
        if (response.status === 409) {
            throw new Error(
                'Email already registered',
            );
        }

        throw new Error(
            'Failed to create account',
        );
    }

    return response.json();
}

export async function verifyEmail(
    token: string,
): Promise<VerifyEmailResponse> {
    const response = await apiFetch('/auth/verify-email',
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json',
            },
            body: JSON.stringify({
                token,
            }),
        },
    );

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? 'Unable to verify email');
    }

    return response.json();
}

export async function resendVerificationEmail(
    email: string,
): Promise<ResendVerificationResponse> {
    const response = await apiFetch('/auth/resend-verification',
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json',
            },
            body: JSON.stringify({
                email,
            }),
        },
    );

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => null);

        throw new Error(
            error?.message ??
            'Unable to resend verification email',
        );
    }

    return response.json();
}