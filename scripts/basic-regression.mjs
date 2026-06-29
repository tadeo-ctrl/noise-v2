import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(scriptMatch, 'index.html must contain an inline <script> block');
new vm.Script(scriptMatch[1], { filename: 'index.html inline script' });

assert(html.includes('var MAXVIDS = isPhone ? 4 : 12;'), 'mobile video cap should remain bounded');
assert(html.includes("v.preload=isPhone?'metadata':'auto'"), 'mobile videos should preload metadata only');
assert(html.includes('function releaseMediaIn(container)'), 'media cleanup helper is required');
assert(html.includes('function refreshActiveMedia(container)'), 'active-screen media refresh helper is required');
assert(html.includes('function clipAttrs(id,n,thumb,extra)'), 'clip attribute helper is required');
assert(!html.includes('LEEME_EDDY'), 'personal handoff filename should not be referenced');
assert(!html.match(/querySelectorAll\('\[data-vsrc\]'\)\.forEach\(function\(el\)\{mountVid\(el\);/), 'avoid eager mounting entire containers');

const clipManifest = scriptMatch[1].match(/var CLIPS=\{([^}]+)\}/);
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
