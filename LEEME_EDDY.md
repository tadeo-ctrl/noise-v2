# NOISE — Prototipo (handoff para Eddy)

## Qué es
Toda la app es **un solo archivo**: `index.html` (HTML + CSS + JS, sin build, sin dependencias).
La carpeta `media/` tiene los clips (`media/<trend>/01.mp4`, `02.mp4`, `03.mp4`) y sus posters (`.jpg`).
`media/img/` son las imágenes de marca. `vercel.json` define los headers de cache.

## Correr local
Abrir `index.html` en el navegador (Chrome/Safari). Los videos cargan desde `media/` (rutas relativas),
así que mantené `index.html` y `media/` juntos.

## Dónde están las cosas en el código (todo dentro de index.html)
- `var CLIPS = {...}` — qué trends tienen clips y cuántos.
- `var SUBMAP = {...}` — trends relacionados de cada página (curado a mano).
- `var ALLOWED = {...}` — allowlist: solo estos 45 trends aparecen en el prototipo.
- `mountVid()` / `unmountVid()` — montaje lazy de videos + cap de memoria para iOS (MAXVIDS).
- `ASSET_V` — versión para cache-busting de los .mp4. **Súbela cada vez que re-encodees clips**
  (si no, el navegador sirve el video viejo cacheado con el mismo nombre).
- Pro mode: `buildProDetail`, `chartHTML`, gesto de hold en `pointerdown/move/up`.

## Deploy (Vercel)
    cd <carpeta>
    npx vercel --prod --archive=tgz
El flag `--archive=tgz` evita los cortes de subida (EPIPE) con archivos grandes.
Para forzar refresco en el navegador al testear: abrir la URL con `?v=8`, `?v=9`, etc.

## Notas de los videos
- Clips: 720p, ~10s, H.264, sin audio, faststart. ~70 MB en total.
- Los posters (`.jpg`) son el primer frame; se muestran al instante para que no haya "flash".
