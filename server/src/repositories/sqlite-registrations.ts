import { randomUUID } from 'node:crypto';
import type { SqliteDatabase } from '../db';
import type {
  CreateRegistrationInput,
  ListRegistrationsParams,
  ListRegistrationsResult,
  Registration,
  RegistrationRepository,
  SortField,
} from './types';

interface RegistrationRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  school: string;
  other: string | null;
  created_at: string;
}

const selectColumns = `id, full_name, email, phone, school, other, created_at`;

const sortColumns: Record<SortField, string> = {
  fullName: 'full_name COLLATE NOCASE',
  email: 'email COLLATE NOCASE',
  school: 'school COLLATE NOCASE',
  createdAt: 'created_at',
};

function mapRow(row: RegistrationRow): Registration {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    school: row.school,
    other: row.other,
    createdAt: row.created_at,
  };
}

/** Escapes LIKE wildcards so a search for "100%" is treated literally. */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, '\\$&');
}

export class SqliteRegistrationRepository implements RegistrationRepository {
  constructor(private readonly db: SqliteDatabase) {}

  async create(input: CreateRegistrationInput): Promise<Registration> {
    const registration: Registration = {
      id: randomUUID(),
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      school: input.school,
      other: input.other?.trim() ? input.other.trim() : null,
      createdAt: new Date().toISOString(),
    };

    this.db
      .prepare(
        `INSERT INTO registrations (id, full_name, email, phone, school, other, created_at)
         VALUES (@id, @fullName, @email, @phone, @school, @other, @createdAt)`,
      )
      .run(registration);

    return registration;
  }

  async findByEmail(email: string): Promise<Registration | null> {
    const row = this.db
      .prepare(`SELECT ${selectColumns} FROM registrations WHERE email = ?`)
      .get(email) as RegistrationRow | undefined;

    return row ? mapRow(row) : null;
  }

  async list(params: ListRegistrationsParams): Promise<ListRegistrationsResult> {
    const clauses: string[] = [];
    const values: Record<string, string | number> = {};

    if (params.search) {
      clauses.push(
        `(full_name LIKE @search ESCAPE '\\' OR email LIKE @search ESCAPE '\\' OR school LIKE @search ESCAPE '\\' OR phone LIKE @search ESCAPE '\\')`,
      );
      values.search = `%${escapeLike(params.search)}%`;
    }

    const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
    const direction = params.order === 'asc' ? 'ASC' : 'DESC';
    const sortColumn = sortColumns[params.sort];
    // sortColumn and direction come from typed/validated allowlists above, never
    // from raw user input, while all values remain bound parameters.
    const orderBy = `ORDER BY ${sortColumn} ${direction}, id ASC`;

    const countRow = this.db
      .prepare(`SELECT COUNT(*) AS count FROM registrations ${where}`)
      .get(values) as { count: number };

    const rows = this.db
      .prepare(
        `SELECT ${selectColumns} FROM registrations ${where} ${orderBy} LIMIT @limit OFFSET @offset`,
      )
      .all({
        ...values,
        limit: params.pageSize,
        offset: (params.page - 1) * params.pageSize,
      }) as RegistrationRow[];

    return { rows: rows.map(mapRow), total: countRow.count };
  }

  async listAll(): Promise<Registration[]> {
    const rows = this.db
      .prepare(`SELECT ${selectColumns} FROM registrations ORDER BY created_at DESC, id ASC`)
      .all() as RegistrationRow[];

    return rows.map(mapRow);
  }

  async count(): Promise<number> {
    const row = this.db.prepare('SELECT COUNT(*) AS count FROM registrations').get() as {
      count: number;
    };
    return row.count;
  }

  async delete(id: string): Promise<boolean> {
    const result = this.db.prepare('DELETE FROM registrations WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
