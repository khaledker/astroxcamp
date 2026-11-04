import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export type SqliteDatabase = Database.Database;

/**
 * Creates the SQLite connection and applies the schema. Only this module (and
 * the SQLite repository) knows about SQLite — routes depend on the repository
 * interface so the storage engine can later be swapped for PostgreSQL.
 */
export function createDatabase(filename: string): SqliteDatabase {
  if (filename !== ':memory:') {
    mkdirSync(dirname(filename), { recursive: true });
  }

  const db = new Database(filename);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      phone TEXT NOT NULL,
      school TEXT NOT NULL,
      other TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_registrations_created_at
      ON registrations (created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_registrations_full_name
      ON registrations (full_name COLLATE NOCASE);
  `);

  return db;
}
