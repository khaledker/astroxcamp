import { Router } from 'express';

export function createHealthRouter(): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'astroxcamp-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
    });
  });

  return router;
}
