export type SortField = 'fullName' | 'email' | 'school' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  school: string;
  other: string | null;
  createdAt: string;
}

export interface CreateRegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  school: string;
  other?: string;
}

export interface ListRegistrationsParams {
  search: string;
  page: number;
  pageSize: number;
  sort: SortField;
  order: SortDirection;
}

export interface ListRegistrationsResult {
  rows: Registration[];
  total: number;
}

/**
 * Storage contract. Swap `SqliteRegistrationRepository` for a PostgreSQL
 * implementation without touching routes or validation.
 */
export interface RegistrationRepository {
  create(input: CreateRegistrationInput): Promise<Registration>;
  findByEmail(email: string): Promise<Registration | null>;
  list(params: ListRegistrationsParams): Promise<ListRegistrationsResult>;
  listAll(): Promise<Registration[]>;
  count(): Promise<number>;
  delete(id: string): Promise<boolean>;
}
