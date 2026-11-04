import 'dotenv/config';
import path from 'node:path';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().max(65_535).default(4000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long.'),
  ADMIN_EMAIL: z.string().trim().toLowerCase().email(),
  ADMIN_PASSWORD_HASH: z
    .string()
    .regex(/^\$2[aby]\$\d{2}\$/, 'ADMIN_PASSWORD_HASH must be a bcrypt hash.'),
  DATABASE_PATH: z.string().default('./data/astrocamp.db'),
  SESSION_TTL_HOURS: z.coerce.number().int().positive().max(72).default(8),
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;
const isProduction = env.NODE_ENV === 'production';
const cookieSameSite = env.COOKIE_SAMESITE ?? (isProduction ? 'none' : 'lax');

export const config = {
  nodeEnv: env.NODE_ENV,
  isProduction,
  port: env.PORT,
  corsOrigins: env.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwtSecret: env.JWT_SECRET,
  adminEmail: env.ADMIN_EMAIL,
  adminPasswordHash: env.ADMIN_PASSWORD_HASH,
  databasePath: path.resolve(env.DATABASE_PATH),
  sessionTtlHours: env.SESSION_TTL_HOURS,
  cookieName: 'astrox_admin',
  cookieSameSite,
  cookieSecure: cookieSameSite === 'none' || isProduction,
  jwtIssuer: 'astroxcamp',
  jwtAudience: 'astroxcamp-admin',
} as const;
