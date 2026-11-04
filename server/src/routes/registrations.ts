import { Router } from 'express';
import { registrationSchema } from '../validation';
import { fieldErrors, isUniqueEmailViolation, sendError } from '../lib/http';
import type { RegistrationRepository } from '../repositories/types';

export function createRegistrationsRouter(repository: RegistrationRepository): Router {
  const router = Router();

  // Public write-only endpoint. There is deliberately no public read/list route.
  router.post('/', async (req, res, next) => {
    const parsed = registrationSchema.safeParse(req.body);

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
      const existing = await repository.findByEmail(parsed.data.email);
      if (existing) {
        sendError(res, 409, 'EMAIL_EXISTS', 'This email is already registered.', {
          email: 'This email is already registered.',
        });
        return;
      }

      const registration = await repository.create(parsed.data);
      res.status(201).json({ registration: { id: registration.id } });
    } catch (error) {
      if (isUniqueEmailViolation(error)) {
        sendError(res, 409, 'EMAIL_EXISTS', 'This email is already registered.', {
          email: 'This email is already registered.',
        });
        return;
      }
      next(error);
    }
  });

  return router;
}
