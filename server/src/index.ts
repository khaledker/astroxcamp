import { createApp } from './app';
import { config } from './config';
import { createDatabase } from './db';
import { SqliteRegistrationRepository } from './repositories/sqlite-registrations';

const database = createDatabase(config.databasePath);
const repository = new SqliteRegistrationRepository(database);
const app = createApp(repository);

const server = app.listen(config.port, () => {
  console.log(
    `[server] AstroXcamp API listening on http://localhost:${config.port} (${config.nodeEnv})`,
  );
});

function shutdown(signal: string): void {
  console.log(`[server] ${signal} received, shutting down.`);
  server.close((error) => {
    database.close();
    if (error) {
      console.error('[server] Error while closing:', error);
      process.exit(1);
    }
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
