import type { Registration } from '../repositories/types';

/** Prefixes values that a spreadsheet could interpret as a formula. */
function neutralizeFormula(value: string): string {
  const dangerous = /^[=+\-@\t\r]/.test(value) || /^[=+\-@]/.test(value.trimStart());
  return dangerous ? `'${value}` : value;
}

export function csvCell(value: string | null | undefined): string {
  const raw = (value ?? '').replace(/\u0000/g, '');
  const safe = neutralizeFormula(raw);
  return `"${safe.replace(/"/g, '""')}"`;
}

export function registrationsToCsv(rows: Registration[]): string {
  const header = ['Full name', 'Email', 'Phone', 'University or school', 'Other', 'Registered at'];
  const lines = rows.map((row) =>
    [
      csvCell(row.fullName),
      csvCell(row.email),
      csvCell(row.phone),
      csvCell(row.school),
      csvCell(row.other),
      csvCell(row.createdAt),
    ].join(','),
  );

  return [header.map(csvCell).join(','), ...lines].join('\r\n');
}
