const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

export interface ApiRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  school: string;
  other: string | null;
  createdAt: string;
}

export interface RegistrationPayload {
  fullName: string;
  email: string;
  phone: string;
  school: string;
  other?: string;
}

export interface RegistrationsResponse {
  data: ApiRegistration[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  totalRegistrations: number;
}

export type AdminSortField = 'fullName' | 'email' | 'school' | 'createdAt';
export type AdminSortOrder = 'asc' | 'desc';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: Record<string, string>;

  constructor(status: number, code: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

interface ErrorBody {
  error?: {
    code?: string;
    message?: string;
    fields?: Record<string, string>;
  };
}

function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

async function toApiError(response: Response): Promise<ApiError> {
  let body: ErrorBody = {};
  try {
    body = (await response.json()) as ErrorBody;
  } catch {
    // Non-JSON error (proxy, network gateway, etc.).
  }

  return new ApiError(
    response.status,
    body.error?.code ?? 'REQUEST_FAILED',
    body.error?.message ?? `Request failed (${response.status}).`,
    body.error?.fields,
  );
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers: options.body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) {
    return 'Could not reach the server. Check your connection and try again.';
  }
  return 'Something went wrong. Please try again.';
}

export function submitRegistration(payload: RegistrationPayload) {
  return request<{ registration: { id: string } }>('/api/registrations', {
    method: 'POST',
    body: payload,
  });
}

export function adminLogin(email: string, password: string) {
  return request<{ admin: { email: string } }>('/api/admin/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function adminLogout() {
  return request<void>('/api/admin/logout', { method: 'POST' });
}

export function getAdminSession() {
  return request<{ admin: { email: string } }>('/api/admin/session');
}

export function getRegistrations(params: {
  search: string;
  page: number;
  pageSize: number;
  sort: AdminSortField;
  order: AdminSortOrder;
  signal?: AbortSignal;
}) {
  const query = new URLSearchParams({
    search: params.search,
    page: String(params.page),
    pageSize: String(params.pageSize),
    sort: params.sort,
    order: params.order,
  });

  return request<RegistrationsResponse>(`/api/admin/registrations?${query.toString()}`, {
    signal: params.signal,
  });
}

export function deleteRegistration(id: string) {
  return request<void>(`/api/admin/registrations/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function downloadRegistrationsCsv(): Promise<Blob> {
  const response = await fetch(apiUrl('/api/admin/registrations/export.csv'), {
    credentials: 'include',
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  return response.blob();
}
