const apiUrl = import.meta.env.VITE_API_URL;

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
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

export async function login(
    data: LoginRequest,
): Promise<LoginResponse> {
    const response = await fetch(
        `${apiUrl}/auth/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
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
    const response = await fetch(
        `${apiUrl}/auth/me`,
        {
            method: 'GET',
            credentials: 'include',
        },
    );

    if (!response.ok) {
        throw new Error('Not authenticated');
    }

    return response.json();
}

export async function logout(): Promise<void> {
    const response = await fetch(
        `${apiUrl}/auth/logout`,
        {
            method: 'POST',
            credentials: 'include',
        },
    );

    if (!response.ok) {
        throw new Error('Failed to logout');
    }
}

export async function register(
    data: RegisterRequest,
): Promise<RegisterResponse> {
    const response = await fetch(
        `${apiUrl}/auth/register`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
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