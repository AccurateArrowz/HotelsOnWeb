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

const PORT = process.env.PORT || 5012;

const startupStart = Date.now();
console.log(`[STARTUP] Server initialization started at ${new Date().toISOString()}`);

async function startServer() {
  try {
    await app.initialize();
    
    app.listen(PORT, () => {
      const totalTime = Date.now() - startupStart;
      console.log(`[STARTUP] Server ready on port ${PORT} (total startup: ${totalTime}ms ~${(totalTime / 1000).toFixed(1)}s)`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
