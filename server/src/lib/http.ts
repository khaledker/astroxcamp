import type { Response } from 'express';
import type { ZodError } from 'zod';

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  fields?: Record<string, string>,
): Response {
  const body: ApiErrorBody = { error: { code, message } };
  if (fields && Object.keys(fields).length > 0) {
    body.error.fields = fields;
  }
  return res.status(status).json(body);
}

/** Returns the first validation message for each field. */
export function fieldErrors(error: ZodError): Record<string, string> {
  const output: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !output[key]) {
      output[key] = issue.message;
    }
  }
  return output;
}

export function isUniqueEmailViolation(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as Error & { code?: string }).code;
  return code === 'SQLITE_CONSTRAINT_UNIQUE' || error.message.includes('UNIQUE constraint failed');
}
