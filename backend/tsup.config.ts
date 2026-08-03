import { defineConfig } from 'tsup';
import { glob } from 'glob';

// Get all TypeScript files except node_modules
const getEntries = async () => {
  const files = await glob('src/**/*.ts', {
    ignore: ['node_modules/**', 'dist/**'],
  });

  const entries: Record<string, string> = {};

  for (const file of files) {
    // Convert src/path/to/file.ts to path/to/file
    const key = file.replace(/^src\//, '').replace(/\.ts$/, '');
    entries[key] = file;
  }

  return entries;
};

export default defineConfig(async () => ({
  entry: await getEntries(),
  format: ['cjs'],
  target: 'es2022',
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  shims: false,
  splitting: false,
  bundle: false,
  esbuildOptions(options) {
    options.banner = {
      js: 'require("reflect-metadata");',
    };
  },
}));
