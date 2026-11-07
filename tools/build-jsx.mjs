/* Compiles the JSX sources used by the case and Design Notes pages into plain JS.
   Run after editing any .jsx file:  cd tools && npm install && npm run build
   The .jsx files stay the source of truth; the .js files next to them are what pages load. */
import { transformFileSync } from '@babel/core';
import { writeFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  'tweaks-panel.jsx',
  'cases/case-data.jsx',
  'cases/case-app.jsx',
  'design-notes/design-notes-data.jsx',
  'design-notes/design-notes-app.jsx',
];
for (const f of files) {
  const src = path.join(root, f);
  const { code } = transformFileSync(src, {
    babelrc: false, configFile: false,
    presets: [['@babel/preset-react', { runtime: 'classic' }]],
    sourceType: 'script', comments: false, minified: true,
  });
  const out = src.replace(/\.jsx$/, '.js');
  writeFileSync(out, '/* Built from ' + path.basename(f) + ' by tools/build-jsx.mjs. Edit the .jsx file, then rebuild. */\n' + code + '\n');
  console.log(f, '->', path.relative(root, out), Math.round(statSync(out).size / 1024) + ' KB');
}
