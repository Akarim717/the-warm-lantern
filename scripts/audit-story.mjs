import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const app = readFileSync(resolve(root, 'app.js'), 'utf8');
const styles = readFileSync(resolve(root, 'styles.css'), 'utf8');
const errors = [];

if (!existsSync(resolve(root, 'assets', 'fonts', 'ScoutieSans-Variable.ttf'))) errors.push('missing interface font');

for (let index = 1; index <= 8; index += 1) {
  const image = resolve(root, 'assets', 'warm-lantern', `scene-${String(index).padStart(2, '0')}.jpg`);
  if (!existsSync(image)) errors.push(`missing illustrated scene ${index}`);
}

for (const title of ['The Discovery', 'The Guardian', 'The Hidden Classroom', 'The Escape']) {
  if (!app.includes(`title: '${title}'`)) errors.push(`missing ending: ${title}`);
}

for (const choice of ['follow-footprints', 'examine-tunnel', 'leave-report', 'hide-watch', 'second-tunnel-direct', 'leave-with-pakdin', 'explore-with-pakdin', 'old-map', 'new-markings', 'follow-map', 'follow-water']) {
  if (!app.includes(`id: '${choice}'`)) errors.push(`missing consequential choice: ${choice}`);
}

for (const feature of ['localStorage', 'renderCaveMap', 'renderJourneyReport', 'Master Explorer', 'data-reflection', 'overlayKeys']) {
  if (!app.includes(feature)) errors.push(`missing experience feature: ${feature}`);
}

for (const phrase of ['THE FOOTPRINT IS FRESH.', 'THE LANTERN IS WARM.', 'If this place is found, remember us.', 'Next time, adults.']) {
  if (!app.includes(phrase)) errors.push(`missing manuscript beat: ${phrase}`);
}

const nodeBlock = app.match(/const NODES = \{([\s\S]*?)\n\};\n\nfunction freshState/)?.[1] || '';
const nodeIds = new Set([...nodeBlock.matchAll(/^  ([A-Za-z]\w*): \{/gm)].map(match => match[1]));
const destinations = [...nodeBlock.matchAll(/(?:target|next): '(\w+)'/g)].map(match => match[1]);
for (const destination of destinations) {
  if (!nodeIds.has(destination)) errors.push(`story route points to missing node: ${destination}`);
}
if ((nodeBlock.match(/type: 'ending'/g) || []).length !== 4) errors.push('story must contain exactly four ending nodes');
if (Object.keys(Object.fromEntries([...app.matchAll(/^  (\w+): \{ icon:/gm)].map(match => [match[1], true]))).length !== 9) errors.push('expected nine clue definitions');

if (!styles.includes('prefers-reduced-motion')) errors.push('missing reduced-motion support');
if (!styles.includes('@media (max-width: 680px)')) errors.push('missing phone layout');
if (!styles.includes('min-height: 54px')) errors.push('missing touch-friendly controls');

if (errors.length) {
  console.error(`Warm Lantern audit failed: ${errors.join('; ')}`);
  process.exit(1);
}

console.log('Warm Lantern audit passed: four endings, consequential branches, clues, maps, journey reporting and accessibility hooks are present.');
