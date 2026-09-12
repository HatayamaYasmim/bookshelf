const apiUrl = import.meta.env.VITE_API_URL;

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthUser {
    id: number;
    email: string;
}

export interface LoginResponse {
    user: AuthUser;
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