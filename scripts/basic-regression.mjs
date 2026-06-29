import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync('index.html', 'utf8');
const dataJs = fs.readFileSync('scripts/data.js', 'utf8');
const appJs = fs.readFileSync('scripts/app.js', 'utf8');
const css = fs.readFileSync('styles/app.css', 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(html.includes('<link rel="stylesheet" href="styles/app.css">'), 'index.html must load styles/app.css');
assert(
  html.includes('<script src="scripts/data.js"></script>\n<script src="scripts/app.js"></script>'),
  'index.html must load data.js before app.js'
);
assert(!html.match(/<style>[\s\S]*<\/style>/), 'index.html should not contain inline CSS');
assert(!html.match(/<script>[\s\S]*<\/script>/), 'index.html should not contain inline JavaScript');
assert(css.includes('@font-face'), 'app.css should contain the embedded font definitions');
new vm.Script(dataJs, { filename: 'scripts/data.js' });
new vm.Script(appJs, { filename: 'scripts/app.js' });

assert(appJs.includes('var MAXVIDS = isPhone ? 4 : 12;'), 'mobile video cap should remain bounded');
assert(appJs.includes("v.preload=isPhone?'metadata':'auto'"), 'mobile videos should preload metadata only');
assert(appJs.includes('function releaseMediaIn(container)'), 'media cleanup helper is required');
assert(appJs.includes('function refreshActiveMedia(container)'), 'active-screen media refresh helper is required');
assert(appJs.includes('function clipAttrs(id,n,thumb,extra)'), 'clip attribute helper is required');
assert(!html.includes('LEEME_EDDY') && !dataJs.includes('LEEME_EDDY') && !appJs.includes('LEEME_EDDY'), 'personal handoff filename should not be referenced');
assert(!appJs.match(/querySelectorAll\('\[data-vsrc\]'\)\.forEach\(function\(el\)\{mountVid\(el\);/), 'avoid eager mounting entire containers');
assert(!dataJs.includes('document.'), 'data.js should stay free of DOM work');

const clipManifest = dataJs.match(/var CLIPS=\{([^}]+)\}/);
assert(clipManifest, 'CLIPS manifest is required');

const missingThumbs = [];
for (const [, slug, countText] of clipManifest[1].matchAll(/([a-z0-9]+):([0-9]+)/g)) {
  const count = Number(countText);
  for (let i = 1; i <= count; i += 1) {
    const rel = `media/thumbs/${slug}/0${i}.mp4`;
    if (!fs.existsSync(rel)) missingThumbs.push(rel);
  }
}

assert(missingThumbs.length === 0, `missing thumbnail clips:\n${missingThumbs.join('\n')}`);

console.log('basic regression checks passed');
