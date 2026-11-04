import { z } from 'zod';

/** Mirrors server/src/validation.ts, including normalisation. */
function sanitizeText(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const textField = (field: string, min: number, max: number) =>
  z
    .string({ required_error: `${field} is required.` })
    .transform(sanitizeText)
    .pipe(
      z
        .string()
        .min(min, `${field} must be at least ${min} characters.`)
        .max(max, `${field} must be at most ${max} characters.`),
    );

export const registrationFormSchema = z
  .object({
    fullName: textField('Full name', 2, 120),
    email: z
      .string({ required_error: 'Email is required.' })
      .transform((value) => sanitizeText(value).toLowerCase())
      .pipe(
        z
          .string()
          .email('Enter a valid email address.')
          .max(254, 'Email is too long.'),
      ),
    phone: z
      .string({ required_error: 'Phone is required.' })
      .transform(sanitizeText)
      .pipe(
        z
          .string()
          .min(7, 'Enter a valid phone number.')
          .max(32, 'Phone number is too long.')
          .regex(/^\+?[\d\s().-]+$/, 'Use digits, spaces, parentheses, +, dots or dashes only.')
          .refine((value) => {
            const digits = value.replace(/\D/g, '');
            return digits.length >= 7 && digits.length <= 15;
          }, 'Phone must contain 7–15 digits.'),
      ),
    school: textField('University or school', 2, 160),
    other: z
      .string()
      .transform(sanitizeText)
      .pipe(z.string().max(500, 'Other must be at most 500 characters.')),
  })
  .strict();

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
export type RegistrationField = keyof RegistrationFormValues;

export const emptyRegistrationForm: RegistrationFormValues = {
  fullName: '',
  email: '',
  phone: '',
  school: '',
  other: '',
};

const registrationFields: RegistrationField[] = [
  'fullName',
  'email',
  'phone',
  'school',
  'other',
];

export function isRegistrationField(value: string): value is RegistrationField {
  return (registrationFields as string[]).includes(value);
}

export function validateRegistrationField(
  field: RegistrationField,
  value: string,
): string | undefined {
  const result = registrationFormSchema.shape[field].safeParse(value);
  if (result.success) return undefined;
  return result.error.issues[0]?.message ?? 'This value is invalid.';
}

export function validateRegistrationForm(values: RegistrationFormValues): {
  values?: RegistrationFormValues;
  errors: Partial<Record<RegistrationField, string>>;
} {
  const result = registrationFormSchema.safeParse(values);

  if (!result.success) {
    const errors: Partial<Record<RegistrationField, string>> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && isRegistrationField(key) && !errors[key]) {
        errors[key] = issue.message;
      }
    }
    return { errors };
  }

  return { values: result.data, errors: {} };
}
