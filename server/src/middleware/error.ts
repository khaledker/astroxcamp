import type { ErrorRequestHandler, RequestHandler } from 'express';
import { sendError } from '../lib/http';

export const apiNotFound: RequestHandler = (_req, res) => {
  sendError(res, 404, 'NOT_FOUND', 'Endpoint not found.');
};

/**
 * Central error handler. Responses never include stack traces or internal
 * details; unexpected errors are logged server-side only.
 */
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (res.headersSent) {
    return;
  }

  if (
    error instanceof SyntaxError &&
    'body' in error &&
    (error as SyntaxError & { type?: string }).type === 'entity.parse.failed'
  ) {
    sendError(res, 400, 'INVALID_JSON', 'Request body must be valid JSON.');
    return;
  }

  if ((error as { type?: string }).type === 'entity.too.large') {
    sendError(res, 413, 'PAYLOAD_TOO_LARGE', 'Request body is too large.');
    return;
  }

  console.error('[server] Unhandled error:', error);
  sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong. Please try again.');
};
