import cors, { type CorsOptions } from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { sendError } from './lib/http';
import { errorHandler, apiNotFound } from './middleware/error';
import { createAdminRouter } from './routes/admin';
import { createHealthRouter } from './routes/health';
import { createRegistrationsRouter } from './routes/registrations';
import type { RegistrationRepository } from './repositories/types';

const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 429, 'RATE_LIMITED', 'Too many registration attempts. Try again later.');
  },
});

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || config.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  maxAge: 600,
};

export function createApp(repository: RegistrationRepository): express.Express {
  const app = express();

  app.disable('x-powered-by');
  if (config.isProduction) {
    app.set('trust proxy', 1);
  }

  app.use(helmet());
  app.use(cors(corsOptions));

  // Return an explicit JSON error for origins outside the allowlist.
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && !config.corsOrigins.includes(origin)) {
      sendError(res, 403, 'ORIGIN_NOT_ALLOWED', 'This origin is not allowed.');
      return;
    }
    next();
  });

  app.use(express.json({ limit: '16kb' }));
  app.use(cookieParser());

  app.use('/api', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    next();
  });

  app.use('/api/health', createHealthRouter());
  app.use('/api/registrations', registrationLimiter, createRegistrationsRouter(repository));
  app.use('/api/admin', createAdminRouter(repository));

  app.use('/api', apiNotFound);
  app.use(errorHandler);

  return app;
}
