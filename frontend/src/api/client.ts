export class ApiError extends Error {
    readonly status: number;
    readonly body: unknown;

    constructor(status: number, body: unknown) {
        super(`Request failed with status ${status}`);
        this.status = status;
        this.body = body;
    }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`/api${path}`, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
    if (!response.ok) {
        throw new ApiError(response.status, await response.json().catch(() => null));
    }
    return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}