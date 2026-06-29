# NOISE Prototype Notes

## Overview
The prototype is a single static file: `index.html` contains the HTML, CSS, and JavaScript.
There is no build step and no runtime dependency installation.

The `media/` directory contains trend clips (`media/<trend>/01.mp4`, `02.mp4`, `03.mp4`) and matching
poster images (`.jpg`). Brand imagery lives in `media/img/`. Vercel cache headers are defined in
`vercel.json`.

## Local Development
Open `index.html` directly in Chrome or Safari. Video paths are relative to `media/`, so keep
`index.html` and `media/` in the same directory.

## Code Map
All application code lives in `index.html`.

- `var CLIPS = {...}` - trend clip availability and counts.
- `var SUBMAP = {...}` - manually curated related trends for detail pages.
- `var ALLOWED = {...}` - allowlist for the 45 prototype trends.
- `mountVid()` / `unmountVid()` - lazy video mounting with the iOS memory cap (`MAXVIDS`).
- `releaseMediaIn()` / `refreshActiveMedia()` - media lifecycle cleanup; only the active screen should
  have mounted `<video>` elements.
- `clipSrc()` / `clipAttrs()` - full-screen Feed/detail clips use `media/<trend>/...`; small cards use
  `media/thumbs/<trend>/...` to preserve quality where it matters while reducing thumbnail decode cost.
- `renderExploreChunk()` - batched Search rendering; do not render every trend and every clip at once.
- `lockPhoneShellScroll()` - keeps the `#phone` shell fixed at `scrollTop = 0`; only internal
  `.scrollarea` elements should scroll.
- `ASSET_V` - cache-busting version for `.mp4` assets. Bump this when clips are re-encoded.
- Pro mode: `buildProDetail`, `chartHTML`, and the hold gesture handled through pointer events.

## Vercel Deployment
```bash
cd <project-directory>
npx vercel --prod --archive=tgz
```

Use `--archive=tgz` to avoid large-file upload interruptions. For manual cache-bust testing, open the
deployed URL with a query parameter such as `?v=8` or `?v=9`.

## Video Guidelines
- Clips should be H.264, muted, faststart, and roughly 10 seconds long.
- Posters (`.jpg`) should be the first frame so cards display instantly before video playback starts.
- On mobile, videos use `preload="metadata"` and do not blob-prefetch. The target behavior is instant
  poster display, a small number of mounted videos, and just-in-time loading near the viewport.
- For older phones, prefer 540-576px width at 24/30fps. Keep 720p only where the difference is meaningful.
- Add a matching `media/thumbs/<trend>/0N.mp4` file for every `media/<trend>/0N.mp4` clip. These thumbnail
  variants should be H.264, muted, faststart, 360px wide, and 30fps.
- Closed bottom sheets must use `visibility:hidden` and `pointer-events:none`; avoid large offscreen
  transforms that can create scrollable overflow inside `#phone`.

## Basic Verification
```bash
node scripts/basic-regression.mjs
```

The script checks inline JavaScript syntax, key media lifecycle safeguards, and thumbnail clip coverage.
