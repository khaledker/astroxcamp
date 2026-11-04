import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { adminLoginSchema, idParamSchema, listRegistrationsQuerySchema } from '../validation';
import { fieldErrors, sendError } from '../lib/http';
import { registrationsToCsv } from '../lib/csv';
import {
  cookieOptions,
  createAdminToken,
  requireAdmin,
} from '../middleware/auth';
import type { RegistrationRepository } from '../repositories/types';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 429, 'RATE_LIMITED', 'Too many sign-in attempts. Try again in 15 minutes.');
  },
});

export function createAdminRouter(repository: RegistrationRepository): Router {
  const router = Router();

  router.post('/login', loginLimiter, async (req, res, next) => {
    const parsed = adminLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Please check the highlighted fields.',
        fieldErrors(parsed.error),
      );
      return;
    }

    try {
      const { email, password } = parsed.data;
      const emailMatches = email === config.adminEmail;
      // Always run a bcrypt comparison to keep the response timing consistent.
      const passwordMatches = await bcrypt.compare(password, config.adminPasswordHash);

      if (!emailMatches || !passwordMatches) {
        sendError(res, 401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
        return;
      }

      res.cookie(config.cookieName, createAdminToken(config.adminEmail), cookieOptions());
      res.json({ admin: { email: config.adminEmail } });
    } catch (error) {
      next(error);
    }
  });

  router.post('/logout', (_req, res) => {
    res.clearCookie(config.cookieName, {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: config.cookieSameSite,
      path: '/',
    });
    res.status(204).send();
  });

  router.get('/session', requireAdmin, (req, res) => {
    res.json({ admin: { email: req.admin?.email ?? config.adminEmail } });
  });

  router.use(requireAdmin);

  router.get('/registrations/export.csv', async (_req, res, next) => {
    try {
      const rows = await repository.listAll();
      const csv = registrationsToCsv(rows);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="astroxcamp-26-27-registrations.csv"',
      );
      res.send(csv);
    } catch (error) {
      next(error);
    }
  });

  router.get('/registrations', async (req, res, next) => {
    const parsed = listRegistrationsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Invalid search or pagination parameters.',
        fieldErrors(parsed.error),
      );
      return;
    }

    try {
      const { search, page, pageSize, sort, order } = parsed.data;
      const [result, totalRegistrations] = await Promise.all([
        repository.list({ search, page, pageSize, sort, order }),
        repository.count(),
      ]);

      res.json({
        data: result.rows,
        pagination: {
          page,
          pageSize,
          total: result.total,
          totalPages: Math.max(1, Math.ceil(result.total / pageSize)),
        },
        totalRegistrations,
      });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/registrations/:id', async (req, res, next) => {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      sendError(res, 400, 'INVALID_ID', 'Invalid registration id.');
      return;
    }

    try {
      const deleted = await repository.delete(parsed.data.id);
      if (!deleted) {
        sendError(res, 404, 'NOT_FOUND', 'Registration not found.');
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
