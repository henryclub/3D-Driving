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
  await ev(`P.x = -160; P.z = -560; d.snap(); const v = d.createVehicle(d.byNum.get('1101'), -160, -560, 0); d.enter(v);`);
  await p.waitForTimeout(1500);
  await p.keyboard.down('w');
  for (let i = 0; i < 30; i++) { await p.waitForTimeout(3000); console.log(i, await ev(`const c = d.current; return [c.x.toFixed(1), c.z.toFixed(1), (c.speed*3.6).toFixed(0)].join(' ')`)); const z = await ev(`return d.current.z`); if (z < -708) break; }
  await p.screenshot({ path: S + 'shots/gate2_drive.png' });
  await p.keyboard.up('w');
  await p.keyboard.down('s'); await p.waitForTimeout(3000); await p.keyboard.up('s');
  console.log('stopped', await ev(`const c = d.current; return [c.x.toFixed(1), c.z.toFixed(1), (c.speed*3.6).toFixed(1)].join(' ')`));
  await p.keyboard.press('e'); await p.waitForTimeout(800);
  console.log('foot', await ev(`return [d.P.x.toFixed(1), d.P.z.toFixed(1), JSON.stringify(L.nearestDoor(d.P.x, d.P.z))].join(' ')`));
  await p.screenshot({ path: S + 'shots/gate2_out.png' });
  await p.keyboard.press('e'); await p.waitForTimeout(1800);
  console.log('inside', await ev(`return L.INT.active && L.INT.active.key`));
  console.log(errs.slice(0, 10).join('\n') || 'no errors');
  await b.close();
})();
