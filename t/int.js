const { chromium } = require('playwright');
const S = '/tmp/forks/landmarks/t/';
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = [];
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('pageerror', (e) => errs.push('PAGEERR ' + e.message));
  await p.goto('file:///tmp/forks/landmarks/index.html#debug');
  await p.waitForTimeout(1500);
  await p.click('#startBtn');
  await p.waitForTimeout(500);
  const steps = JSON.parse(process.argv[2]);
  for (const [name, js, cam, wait] of steps) {
    try { await p.evaluate(`(() => { const d = window.__dbg, L = d.life; ${js} })()`); } catch (e) { errs.push('EVAL ' + name + ': ' + e.message); }
    await p.waitForTimeout(wait || 1200);
    if (cam) await p.evaluate(`(() => { const L = window.__dbg.life, it = L.INT.active, c = ${cam}; L.INT.camFn = () => [it.bx + c[0], c[1], it.bz + c[2], it.bx + c[3], c[4], it.bz + c[5]]; })()`);
    await p.waitForTimeout(400);
    await p.screenshot({ path: S + 'shots/' + name + '.png' });
  }
  console.log(errs.slice(0, 12).join('\n') || 'no errors');
  await b.close();
})();
