import 'reflect-metadata';
import dotenv from 'dotenv';
import { register } from 'tsconfig-paths';

dotenv.config();

// Register path aliases
register({
  baseUrl: __dirname,
  paths: {
    '@/*': ['./*'],
  },
});

const app = require('./app');

const PORT = Number(process.env.PORT || 5012);
const HOST = process.env.HOST || '0.0.0.0';

const startupStart = Date.now();
console.log(`[STARTUP] Server initialization started at ${new Date().toISOString()}`);

async function startServer() {
  try {
    await app.initialize();

    const server = app.listen(PORT, HOST, () => {
      const address = server.address();
      const boundHost = typeof address === 'object' && address ? address.address : HOST;
      const boundPort = typeof address === 'object' && address ? address.port : PORT;
      const displayHost = ['0.0.0.0', '::', '::0.0.0.0'].includes(boundHost) ? 'localhost' : boundHost;
      const totalTime = Date.now() - startupStart;

      console.log(`[STARTUP] Backend running at http://${displayHost}:${boundPort}`);
      console.log(`[STARTUP] Server ready on port ${boundPort} (total startup: ${totalTime}ms ~${(totalTime / 1000).toFixed(1)}s)`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
