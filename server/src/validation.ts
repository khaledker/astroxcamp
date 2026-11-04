import { z } from 'zod';

export const MAX_LENGTHS = {
  fullName: 120,
  email: 254,
  phone: 32,
  school: 160,
  other: 500,
} as const;

/**
 * Removes control characters, normalises unicode and collapses whitespace.
 * Applied before validation so stored values are clean and predictable.
 */
export function sanitizeText(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sanitizeSearch(value: string): string {
  return sanitizeText(value).slice(0, 100);
}

const trimmedString = (field: string, min: number, max: number) =>
  z
    .string({ required_error: `${field} is required.`, invalid_type_error: `${field} must be text.` })
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(min, `${field} must be at least ${min} characters.`)
        .max(max, `${field} must be at most ${max} characters.`),
    );

export const registrationSchema = z
  .object({
    fullName: trimmedString('Full name', 2, MAX_LENGTHS.fullName),
    email: z
      .string({ required_error: 'Email is required.' })
      .transform((value) => sanitizeText(value).toLowerCase())
      .pipe(
        z
          .string()
          .email('Enter a valid email address.')
          .max(MAX_LENGTHS.email, 'Email is too long.'),
      ),
    phone: z
      .string({ required_error: 'Phone is required.' })
      .transform(sanitizeText)
      .pipe(
        z
          .string()
          .min(7, 'Enter a valid phone number.')
          .max(MAX_LENGTHS.phone, 'Phone number is too long.')
          .regex(/^\+?[\d\s().-]+$/, 'Use digits, spaces, parentheses, +, dots or dashes only.')
          .refine((value) => {
            const digits = value.replace(/\D/g, '');
            return digits.length >= 7 && digits.length <= 15;
          }, 'Phone must contain 7–15 digits.'),
      ),
    school: trimmedString('University or school', 2, MAX_LENGTHS.school),
    other: z
      .union([z.string(), z.null(), z.undefined()])
      .transform((value) => (typeof value === 'string' ? sanitizeText(value) : ''))
      .pipe(z.string().max(MAX_LENGTHS.other, `Other must be at most ${MAX_LENGTHS.other} characters.`)),
  })
  .strict();

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const adminLoginSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required.' })
      .transform((value) => sanitizeText(value).toLowerCase())
      .pipe(z.string().email('Enter a valid email address.').max(MAX_LENGTHS.email)),
    password: z
      .string({ required_error: 'Password is required.' })
      .min(1, 'Password is required.')
      .max(72, 'Password is too long.'),
  })
  .strict();

export const listRegistrationsQuerySchema = z.object({
  search: z
    .preprocess(
      (value) => (typeof value === 'string' ? sanitizeSearch(value) : ''),
      z.string().max(100),
    )
    .default(''),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.enum(['fullName', 'email', 'school', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid registration id.'),
});
