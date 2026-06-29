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
assert(css.includes('touch-action:pan-y'), 'feed carousel must preserve native vertical panning');
assert(css.includes('transform-style:preserve-3d'), 'feed carousel should keep a 3D transform context');
assert(!css.includes('.dots{') && !appJs.includes('data-dots') && !appJs.includes('class="dots"'), 'feed carousel top indicators should not render');
assert(/\.chartvid\{[^}]*filter:blur\(0\)/.test(css) && /@media \(max-width:600px\)[\s\S]*\.chartvid\{filter:blur\(0\)/.test(css) && /\.chartmedia\.holding \.chartvid\{filter:blur\(9px\)/.test(css), 'Pro chart video should only blur while the chart is held');
assert(css.includes('.cmp-opt-media') && css.includes('aspect-ratio:205/444'), 'compose trend picker previews should match post video aspect ratio');
assert(css.includes('.cmp-opt{display:flex;align-items:flex-start'), 'compose trend picker labels should align to the top of video previews');
new vm.Script(dataJs, { filename: 'scripts/data.js' });
new vm.Script(appJs, { filename: 'scripts/app.js' });

assert(appJs.includes('var MAXVIDS = isPhone ? 4 : 12;'), 'mobile video cap should remain bounded');
assert(appJs.includes("v.preload=isPhone?'metadata':'auto'"), 'mobile videos should preload metadata only');
assert(appJs.includes('function releaseMediaIn(container)'), 'media cleanup helper is required');
assert(appJs.includes('function refreshActiveMedia(container)'), 'active-screen media refresh helper is required');
assert(appJs.includes('function clipAttrs(id,n,thumb,extra)'), 'clip attribute helper is required');
assert(appJs.includes('function renderCubePosition'), 'feed carousel cube renderer is required');
assert(appJs.includes('rotateY'), 'feed carousel should use a 3D cube-style transition');
assert(appJs.includes('setPointerCapture'), 'feed carousel should capture horizontal drags after axis lock');
assert(appJs.includes('if(c.n<2)') && appJs.includes("cm.classList.contains('holding')"), 'single-slide Pro feed tracks should leave horizontal drags to the chart hold interaction');
assert(appJs.includes('function currentFeedTopicId()') && appJs.includes('renderFeed(feedKind,restoreTopic)'), 'Pro mode feed rebuild should preserve the currently visible trend');
assert(appJs.includes('function previewClipId(id)') && appJs.includes('class="cmp-opt-media"') && appJs.includes('clipAttrs(vid,1,true)'), 'compose trend picker should render video-backed trend previews');
assert(!html.includes('LEEME_EDDY') && !dataJs.includes('LEEME_EDDY') && !appJs.includes('LEEME_EDDY'), 'personal handoff filename should not be referenced');
assert(!appJs.match(/querySelectorAll\('\[data-vsrc\]'\)\.forEach\(function\(el\)\{mountVid\(el\);/), 'avoid eager mounting entire containers');
assert(!dataJs.includes('document.'), 'data.js should stay free of DOM work');

const clipManifest = dataJs.match(/var CLIPS=\{([^}]+)\}/);
assert(clipManifest, 'CLIPS manifest is required');

const missingThumbs = [];
const missingFeedAssets = [];
for (const [, slug, countText] of clipManifest[1].matchAll(/([a-z0-9]+):([0-9]+)/g)) {
  const count = Number(countText);
  for (let i = 1; i <= count; i += 1) {
    const thumb = `media/thumbs/${slug}/0${i}.mp4`;
    const full = `media/${slug}/0${i}.mp4`;
    const poster = `media/${slug}/0${i}.jpg`;
    if (!fs.existsSync(thumb)) missingThumbs.push(thumb);
    if (!fs.existsSync(full)) missingFeedAssets.push(full);
    if (!fs.existsSync(poster)) missingFeedAssets.push(poster);
  }
}

assert(missingThumbs.length === 0, `missing thumbnail clips:\n${missingThumbs.join('\n')}`);
assert(missingFeedAssets.length === 0, `missing full-screen feed clips/posters:\n${missingFeedAssets.join('\n')}`);

console.log('basic regression checks passed');
