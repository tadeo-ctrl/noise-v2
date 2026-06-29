import { spawn } from 'node:child_process';
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chromeCandidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function findChrome() {
  for (const candidate of chromeCandidates) {
    if (await exists(candidate)) return candidate;
  }
  throw new Error('Chrome executable not found. Set CHROME_PATH to run the mobile carousel smoke test.');
}

function contentType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  if (file.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (file.endsWith('.json')) return 'application/json; charset=utf-8';
  if (file.endsWith('.jpg') || file.endsWith('.jpeg')) return 'image/jpeg';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.avif')) return 'image/avif';
  if (file.endsWith('.mp4')) return 'video/mp4';
  return 'application/octet-stream';
}

async function startServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://127.0.0.1');
      let pathname = decodeURIComponent(url.pathname);
      if (pathname === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
      }
      if (pathname === '/') pathname = '/index.html';
      const file = path.normalize(path.join(repoRoot, pathname));
      if (!file.startsWith(repoRoot + path.sep)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      const stat = await fs.stat(file);
      if (!stat.isFile()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType(file), 'Content-Length': stat.size });
      createReadStream(file).pipe(res);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return {
    server,
    url: `http://127.0.0.1:${server.address().port}/?v=mobile-carousel-smoke`,
  };
}

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    socket.addEventListener('message', (event) => this.onMessage(event));
  }

  onMessage(event) {
    const message = JSON.parse(event.data);
    if (message.id && this.pending.has(message.id)) {
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result || {});
      return;
    }
    this.events.push(message);
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    const message = { id, method, params };
    if (sessionId) message.sessionId = sessionId;
    this.socket.send(JSON.stringify(message));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (!this.pending.has(id)) return;
        this.pending.delete(id);
        reject(new Error(`CDP command timed out: ${method}`));
      }, 10000);
    });
  }
}

async function connect(wsUrl) {
  assert(globalThis.WebSocket, 'This Node.js runtime does not expose WebSocket.');
  const socket = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  return new CdpClient(socket);
}

async function launchChrome(chromePath) {
  const userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'noise-carousel-chrome-'));
  const child = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--no-default-browser-check',
    '--no-first-run',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  const wsUrl = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timed out waiting for Chrome DevTools URL.')), 10000);
    const inspect = (chunk) => {
      const match = String(chunk).match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (!match) return;
      clearTimeout(timer);
      resolve(match[1]);
    };
    child.stdout.on('data', inspect);
    child.stderr.on('data', inspect);
    child.once('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome exited before DevTools was ready: ${code}`));
    });
  });

  return { child, userDataDir, wsUrl };
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const chromePath = await findChrome();
  const { server, url } = await startServer();
  const chrome = await launchChrome(chromePath);
  const cdp = await connect(chrome.wsUrl);

  try {
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Log.enable', {}, sessionId);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
    }, sessionId);
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, sessionId);
    await cdp.send('Page.navigate', { url }, sessionId);

    await waitForApp(cdp, sessionId);
    const before = await readState(cdp, sessionId);
    assert(before.currentId === 'humanoidrobots', `expected first trend, got ${before.currentId}`);
    assert(before.firstDot === 0, `expected first slide active, got ${before.firstDot}`);
    assert(before.touchAction === 'pan-y', `expected pan-y touch action, got ${before.touchAction}`);
    assert(before.transformStyle === 'preserve-3d', `expected preserve-3d transform style, got ${before.transformStyle}`);
    assert(before.mountedVideos <= 4, `too many videos mounted initially: ${before.mountedVideos}`);

    await mouseDrag(cdp, sessionId, [
      [330, 360],
      [250, 360],
      [170, 360],
      [80, 360],
    ]);
    await sleep(700);
    const afterHorizontal = await readState(cdp, sessionId);
    assert(afterHorizontal.currentId === before.currentId, 'horizontal drag should not change trend');
    assert(afterHorizontal.scrollTop < 12, `horizontal drag should not scroll feed, got ${afterHorizontal.scrollTop}`);
    assert(afterHorizontal.firstDot === 1, `horizontal drag should advance to slide 1, got ${afterHorizontal.firstDot}`);
    assert(afterHorizontal.mountedVideos <= 4, `too many videos mounted after horizontal drag: ${afterHorizontal.mountedVideos}`);

    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: 195,
      y: 420,
      deltaX: 0,
      deltaY: 900,
    }, sessionId);
    await sleep(900);
    const afterVertical = await readState(cdp, sessionId);
    assert(afterVertical.currentId !== before.currentId, 'vertical scroll should advance to another trend');
    assert(afterVertical.scrollTop > 500, `vertical scroll should move feed, got ${afterVertical.scrollTop}`);
    assert(afterVertical.mountedVideos <= 4, `too many videos mounted after vertical scroll: ${afterVertical.mountedVideos}`);

    const seriousLogs = cdp.events.filter((event) => (
      event.method === 'Runtime.exceptionThrown' ||
      (event.method === 'Log.entryAdded' && ['error', 'warning'].includes(event.params?.entry?.level))
    ));
    assert(seriousLogs.length === 0, `browser reported console/runtime issues:\n${JSON.stringify(seriousLogs, null, 2)}`);

    console.log('mobile carousel smoke checks passed');
  } finally {
    try { await cdp.send('Browser.close'); } catch {}
    chrome.child.kill('SIGKILL');
    server.close();
    await fs.rm(chrome.userDataDir, { recursive: true, force: true });
  }
}

async function waitForApp(cdp, sessionId) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    const ready = await evaluate(cdp, sessionId, 'Boolean(document.querySelector(".topic [data-track]"))');
    if (ready) return;
    await sleep(100);
  }
  throw new Error('Timed out waiting for feed carousel to render.');
}

async function evaluate(cdp, sessionId, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  }, sessionId);
  if (result.exceptionDetails) throw new Error(`Runtime evaluation failed: ${JSON.stringify(result.exceptionDetails)}`);
  return result.result.value;
}

async function readState(cdp, sessionId) {
  return evaluate(cdp, sessionId, `(() => {
    const feed = document.getElementById('feed');
    const topics = Array.from(document.querySelectorAll('.topic'));
    const mid = window.innerHeight / 2;
    let current = null;
    for (const topic of topics) {
      const rect = topic.getBoundingClientRect();
      if (rect.top <= mid && rect.bottom >= mid) { current = topic; break; }
    }
    const first = topics[0];
    return {
      scrollTop: Math.round(feed.scrollTop),
      currentId: current && current.getAttribute('data-id'),
      currentDot: current ? Array.from(current.querySelectorAll('[data-dots] span')).findIndex((dot) => dot.classList.contains('on')) : -1,
      firstDot: first ? Array.from(first.querySelectorAll('[data-dots] span')).findIndex((dot) => dot.classList.contains('on')) : -1,
      mountedVideos: document.querySelectorAll('video').length,
      touchAction: getComputedStyle(document.querySelector('[data-track]')).touchAction,
      transformStyle: getComputedStyle(document.querySelector('[data-track]')).transformStyle,
    };
  })()`);
}

async function mouseDrag(cdp, sessionId, points) {
  const [start, ...rest] = points;
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: start[0], y: start[1], button: 'none' }, sessionId);
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: start[0], y: start[1], button: 'left', buttons: 1, clickCount: 1 }, sessionId);
  for (const [x, y] of rest) {
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'left', buttons: 1 }, sessionId);
    await sleep(40);
  }
  const end = points[points.length - 1];
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: end[0], y: end[1], button: 'left', buttons: 0, clickCount: 1 }, sessionId);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
