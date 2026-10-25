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
  if (process.env.NIGHT) { await p.keyboard.press('n'); await p.waitForTimeout(400); }
  const steps = JSON.parse(process.argv[2]);
  for (const [name, px, pz, cam, wait, pre] of steps) {
    if (pre) { try { await p.evaluate(`(() => { const d = window.__dbg, L = d.life, P = d.P; ${pre} })()`); } catch (e) { errs.push('PRE ' + name + ' ' + e.message); } }
    await p.evaluate(([px, pz, cam]) => { const d = window.__dbg, L = d.life; if (px !== null) { d.P.x = px; d.P.z = pz; d.snap(); } L.INT.camFn = cam ? () => cam : null; }, [px, pz, cam]);
    await p.waitForTimeout(wait || 2200);
    await p.screenshot({ path: S + 'shots/' + name + '.png' });
  }
  console.log(errs.slice(0, 12).join('\n') || 'no errors');
  await b.close();
})();
