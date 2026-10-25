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
  await p.click('#startBtn'); await p.waitForTimeout(500);
  const ev = (js) => p.evaluate(`(() => { const d = window.__dbg, L = d.life, P = d.P; ${js} })()`);
  const tag = process.env.NIGHT ? 'n' : 'd';
  if (process.env.NIGHT) { await p.keyboard.press('n'); await p.waitForTimeout(500); }
  await ev(`L.enterHotel('Burj Khalifa','bk')`); await p.waitForTimeout(1500);
  await ev(`const s = L.INT.active.spots[3]; P.x = s.x; P.z = s.z + 0.2; L.lifeAction();`); await p.waitForTimeout(300);
  await p.click('#panelBody button[data-act="d1"]'); await p.waitForTimeout(2500);
  await p.screenshot({ path: S + 'shots/deck_' + tag + '1.png' });
  await ev(`P.h = 0.9;`); await p.waitForTimeout(800);
  await p.screenshot({ path: S + 'shots/deck_' + tag + '2.png' });
  console.log(errs.slice(0, 10).join('\n') || 'no errors');
  await b.close();
})();
