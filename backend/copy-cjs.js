import { copyFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function copyDir(src, dest, includeModels = false) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  
  const files = readdirSync(src, { withFileTypes: true });
  for (const file of files) {
    const srcPath = join(src, file.name);
    const destPath = join(dest, file.name);
    const destPathCjs = join(dest, file.name.replace(/\.js$/, '.cjs'));
    
    // Handle models directory specially
    if (file.isDirectory() && file.name === 'models') {
      // Copy only models/index.js to dist/models/
      const modelsIndexPath = join(srcPath, 'index.js');
      if (existsSync(modelsIndexPath)) {
        const distModelsDir = join(__dirname, 'dist', 'models');
        mkdirSync(distModelsDir, { recursive: true });
        copyFileSync(modelsIndexPath, join(distModelsDir, 'index.js'));
        copyFileSync(modelsIndexPath, join(distModelsDir, 'index.cjs'));
      }
    } else if (file.isDirectory()) {
      copyDir(srcPath, destPath, includeModels);
    } else if (file.name.endsWith('.js')) {
      // Copy as both .js and .cjs for compatibility
      copyFileSync(srcPath, destPath);
      copyFileSync(srcPath, destPathCjs);
    }
  }
}

copyDir('src', 'dist/src', true);
console.log('CJS files copied to dist/src');
