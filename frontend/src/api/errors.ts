import { ApiError } from "./client";
import type { ValidationErrorBody } from "./types";

export function fieldErrorsForm(error: unknown): Record<string, string> | null {
    if (!(error instanceof ApiError) || error.status !== 400) return null;
    const body = error.body as Partial<ValidationErrorBody> | null;
    if (body?.error !== 'VALIDATION_ERROR' || !Array.isArray(body.issues)) return null;
    return Object.fromEntries(body.issues.map((issue) => [issue.path, issue.message]));
}
