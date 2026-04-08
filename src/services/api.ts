const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? '';

type RequestOptions = {
	token?: string;
	body?: unknown;
	formData?: FormData;
};

async function request<T>(
	method: string,
	path: string,
	{ token, body, formData }: RequestOptions = {},
): Promise<T> {
	const headers: Record<string, string> = {};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	if (body !== undefined) {
		headers['Content-Type'] = 'application/json';
	}

	const res = await fetch(`${BASE_URL}${path}`, {
		method,
		headers,
		body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
	});

	if (res.status === 401 && typeof window !== 'undefined') {
		window.dispatchEvent(new Event('auth:unauthorized'));
	}

	if (!res.ok) {
		const text = await res.text().catch(() => res.statusText);
		throw new Error(`${method} ${path} → ${res.status}: ${text}`);
	}

	const text = await res.text();
	return text ? (JSON.parse(text) as T) : ({} as T);
}

export const api = {
	get: <T>(path: string, token?: string) => request<T>('GET', path, { token }),
	post: <T>(path: string, body: unknown, token?: string) =>
		request<T>('POST', path, { token, body }),
	postForm: <T>(path: string, formData: FormData, token?: string) =>
		request<T>('POST', path, { token, formData }),
	patch: <T>(path: string, body: unknown, token?: string) =>
		request<T>('PATCH', path, { token, body }),
	patchForm: <T>(path: string, formData: FormData, token?: string) =>
		request<T>('PATCH', path, { token, formData }),
	delete: <T>(path: string, token?: string) =>
		request<T>('DELETE', path, { token }),
};
