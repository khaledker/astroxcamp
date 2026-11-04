import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { config } from '../config';
import { sendError } from '../lib/http';

interface AdminTokenPayload extends JwtPayload {
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: { email: string };
    }
  }
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    path: '/',
    maxAge: config.sessionTtlHours * 60 * 60 * 1000,
  } as const;
}

export function createAdminToken(email: string): string {
  return jwt.sign({ email }, config.jwtSecret, {
    subject: 'admin',
    issuer: config.jwtIssuer,
    audience: config.jwtAudience,
    algorithm: 'HS256',
    expiresIn: config.sessionTtlHours * 60 * 60,
  });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token: unknown = req.cookies?.[config.cookieName];

  if (typeof token !== 'string' || !token) {
    sendError(res, 401, 'UNAUTHORIZED', 'Authentication required.');
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret, {
      issuer: config.jwtIssuer,
      audience: config.jwtAudience,
      algorithms: ['HS256'],
    });

    if (typeof payload === 'string' || payload.sub !== 'admin') {
      throw new Error('Invalid admin token payload');
    }

    const email = (payload as AdminTokenPayload).email;
    if (typeof email !== 'string' || !email) {
      throw new Error('Missing admin email');
    }

    req.admin = { email };
    next();
  } catch {
    res.clearCookie(config.cookieName, {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: config.cookieSameSite,
      path: '/',
    });
    sendError(res, 401, 'UNAUTHORIZED', 'Your session has expired. Please sign in again.');
  }
}
