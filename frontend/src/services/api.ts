const apiUrl = import.meta.env.VITE_API_URL;

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

interface ApiFetchOptions extends RequestInit {
  skipUnauthorizedHandler?: boolean;
}

export async function apiFetch(path: string, options: ApiFetchOptions = {}): Promise<Response> {
  const { skipUnauthorizedHandler = false, ...requestOptions } = options;

  const headers = new Headers(requestOptions.headers);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (timeZone) {
    headers.set('X-Time-Zone', timeZone);
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...requestOptions,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && !skipUnauthorizedHandler) {
    window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
  }

  return response;
}

export async function apiJson<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const response = await apiFetch(path, options);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
