// Rend des images clés : node scripts/stills.mjs <composition> <frame> [<frame>…]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, ensureBrowser} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [comp = 'Pub9x16', ...frames] = process.argv.slice(2);
const exe = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browserExecutable = fs.existsSync(exe) ? exe : null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const inputProps = {};
const envVariables = {REMOTION_FONTS: process.env.REMOTION_FONTS || 'local'};
const composition = await selectComposition({serveUrl, id: comp, inputProps, browserExecutable, envVariables});
const outDir = path.resolve('out/stills');
fs.mkdirSync(outDir, {recursive: true});
for (const fr of frames) {
  const output = path.join(outDir, `${comp}-${String(fr).padStart(4, '0')}.png`);
  await renderStill({serveUrl, composition, frame: Number(fr), output, inputProps, envVariables, browserExecutable, scale: Number(process.env.SCALE || 0.5)});
  console.log(output);
}
