const apiUrl = import.meta.env.VITE_API_URL;

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

interface ApiFetchOptions extends RequestInit { skipUnauthorizedHandler?: boolean; }

export async function apiFetch(path: string, options: ApiFetchOptions = {},): Promise<Response> {
    const {
        skipUnauthorizedHandler = false,
        ...requestOptions
    } = options;

    const response = await fetch(
        `${apiUrl}${path}`,
        {
            ...requestOptions,
            credentials: 'include',
        },
    );

    if (
        response.status === 401 &&
        !skipUnauthorizedHandler
    ) {
        window.dispatchEvent(
            new Event(AUTH_UNAUTHORIZED_EVENT),
        );
    }

    return response;
}