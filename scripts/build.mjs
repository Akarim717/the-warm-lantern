import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const entry of ['index.html', 'styles.css', 'app.js']) {
  const source = resolve(root, entry);
  if (!existsSync(source)) throw new Error(`Missing build file: ${entry}`);
  cpSync(source, resolve(output, entry));
}

const imageSource = resolve(root, 'assets', 'warm-lantern');
if (!existsSync(imageSource)) throw new Error('Missing Warm Lantern artwork.');
cpSync(imageSource, resolve(output, 'assets', 'warm-lantern'), { recursive: true });

const fontSource = resolve(root, 'assets', 'fonts');
if (!existsSync(fontSource)) throw new Error('Missing interface font.');
cpSync(fontSource, resolve(output, 'assets', 'fonts'), { recursive: true });

console.log('The Warm Lantern build is ready in dist/.');
