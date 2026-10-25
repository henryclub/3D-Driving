
  // ---- Interiors of the two towers ----
  const FISH_COLORS = [0xf29a2e, 0xe8e8f0, 0x2e8be8, 0xf2d12e, 0xe8505b];
  function makeFish(it, n, bounds) {
    const fish = [];
    for (let i = 0; i < n; i++) {
      const f = new THREE.Group();
      box(0.9, 0.4, 0.3, mat(FISH_COLORS[i % 5]), 0, 0, 0, f); box(0.3, 0.5, 0.1, mat(FISH_COLORS[(i + 2) % 5]), -0.6, 0, 0, f);
      f.traverse((o) => { o.userData.keep = true; });
      f.userData.a = Math.random() * 6.28; f.userData.sp = 0.25 + Math.random() * 0.5; f.userData.r = bounds.r * (0.45 + Math.random() * 0.5); f.userData.y = bounds.y0 + Math.random() * (bounds.y1 - bounds.y0); f.userData.ph = Math.random() * 6;
      it.g.add(f); fish.push(f);
    }
    it.upd.push((dt, t) => { for (const f of fish) { f.userData.a += f.userData.sp * dt; const a = f.userData.a; f.position.set(bounds.x + Math.cos(a) * f.userData.r, f.userData.y + Math.sin(t + f.userData.ph) * 0.5, bounds.z + Math.sin(a) * f.userData.r); f.rotation.y = -a - Math.PI / 2; } });
  }
  // a ring of animated jets: the water in a lobby fountain
  function jetRing(it, x, z, r, n, h0, h1, y0 = 1.0) {
    const mt = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false });
    const geo = new THREE.CylinderGeometry(0.08, 0.3, 1, 6), jets = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2, m = new THREE.Mesh(geo, mt); m.position.set(x + Math.cos(a) * r, y0, z + Math.sin(a) * r); m.userData.keep = true; m.userData.ph = a * 3; it.g.add(m); jets.push(m);
    }
    it.upd.push((dt, t) => { for (const m of jets) { const h = h0 + (h1 - h0) * (0.5 + 0.5 * Math.sin(t * 2.4 + m.userData.ph)); m.scale.y = h; m.position.y = y0 + h / 2; } });
    return jets;
  }
  function diningTable(it, x, z, cuisine, name, topM, chairM) {
    it.cyl(1.15, 0.12, topM || mat(0x4a2e1c), x, 0.78, z, false, 14); it.cyl(0.14, 0.78, mat(0x2a2018), x, 0.39, z, false, 6);
    it.col(x, z, 2.3, 2.3, 0.9);
    for (const [dx, dz] of [[1.55, 0], [-1.55, 0], [0, 1.55], [0, -1.55]]) {
      it.box(0.7, 0.1, 0.7, chairM, x + dx, 0.5, z + dz); it.box(0.7, 0.5, 0.1, chairM, x + dx + (dx ? Math.sign(dx) * 0.3 : 0), 0.85, z + dz + (dz ? Math.sign(dz) * 0.3 : 0), false, dx ? Math.PI / 2 : 0); it.box(0.1, 0.5, 0.1, mat(0x2a2018), x + dx, 0.25, z + dz);
    }
    const sp = it.spot(x, z, 2.7, () => mealLabel(sp), () => { it.cuisine = cuisine; it.title = name; mealAct(it, sp); });
    return sp;
  }
  // payment counter, waiter and the "no payment, no leaving" rule for an interior with its own tables
  function wireMeals(it, payX, payZ, exitX, exitZ, baseTitle) {
    it.payAt = { x: it.bx + payX, z: it.bz + payZ }; it.exitAt = { x: it.bx + exitX, z: it.bz + exitZ };
    it.upd.push((dt) => mealUpdate(it, dt));
    it.onLeave = () => { clearPlates(); meal.spot = null; meal.state = 'none'; meal.tab = 0; guards.phase = ''; hideBanner(); };
    it.spot(payX, payZ, 3.8, () => (meal.tab > 0 ? 'pay the bill (' + fmtMoney(meal.tab) + ')' : 'cashier: nothing to pay'), () => payBill(it));
  }
  function exitSpot(it, x, z, baseTitle) { return it.spot(x, z, 4, () => (meal.tab > 0 ? 'leave (you owe ' + fmtMoney(meal.tab) + ')' : 'leave ' + baseTitle), () => tryLeave(it)); }
  function resetMeal() { clearPlates(); meal.tab = 0; meal.state = 'none'; meal.spot = null; meal.food = 0; meal.hp = 0; guards.phase = ''; }
  function liftDoors(it, x, z0, n, gap, dir, m) {
    for (let i = 0; i < n; i++) { it.box(3.2, 4.6, 0.3, m || MAT.rail, x, 2.3, z0 + i * gap); it.box(0.15, 0.4, 0.4, RED_LIGHT, x - 0.2 * Math.sign(x), 4.8, z0 + i * gap); }
  }

  // ---------------- Burj Al Arab Jumeirah: the golden atrium ----------------
  function buildBaaInterior() {
    const it = newInterior('hotel:baa', 'Burj Al Arab Jumeirah');
    it.theme = 'baa'; it.wide = true;
    const W = 120, D = 96, H = 62;
    it.W = W; it.D = D;
    const gold = GOLD, blue = mat(0x16305c), cream = mat(0xf3e8c6);
    exitSpot(it, 0, D / 2 - 3, 'the hotel');
    it.spot(0, -D / 2 + 12 + 3.6, 5.2, 'reception: book a royal suite', () => openBooking(it));
    it.spot(W / 2 - 4, -D / 2 + 26.5, 5, 'lifts: go to your suite', () => openLift(it));
    it.room(W, D, H, pho(texMarble(W, D, 8, '#dccf9e', '#cfbf86', '#b8922c'), 90), cream, mat(0xfaf1d6));
    it.plane(8, 40, lam(texCarpet(8, 40, '#6a1420', '#d9b24a')), 0, 0.06, D / 2 - 22);
    // stacked golden balconies up both side walls, lit by coloured bulbs
    for (const s of [-1, 1]) for (let lv = 0; lv < 6; lv++) {
      const y = 9 + lv * 9;
      it.box(3, 0.6, D - 16, gold, s * (W / 2 - 1.6), y, 0); it.box(0.25, 1.1, D - 16, gold, s * (W / 2 - 3.1), y + 0.8, 0);
      for (let k = 0; k < 8; k++) it.bulb(s * (W / 2 - 3.4), y + 0.3, -D / 2 + 12 + k * ((D - 24) / 7), 0.22);
    }
    for (let lv = 0; lv < 5; lv++) { it.box(W - 16, 0.5, 2.6, gold, 0, 11 + lv * 10, -D / 2 + 1.6); it.box(W - 16, 1.0, 0.25, gold, 0, 11.7 + lv * 10, -D / 2 + 3); }
    // tall gold columns
    for (const x of [-48, -24, 24, 48]) for (const z of [-26, 22]) it.cyl(1.8, H, gold, x, H / 2, z, true, 18);
    for (let r = 1; r <= 3; r++) for (let i = 0; i < 18 * r; i++) { const a = i / (18 * r) * Math.PI * 2; it.bulb(Math.cos(a) * 9 * r, H - 2.2, -4 + Math.sin(a) * 9 * r, 0.3); }
    // the central water feature: a golden basin with a ring of jets and a tall central plume
    it.cyl(11, 1.0, gold, 0, 0.5, -4, false, 32); it.cyl(10.4, 1.04, POOL_MAT, 0, 0.52, -4, false, 32); it.col(0, -4, 22, 22, 1.0);
    it.cyl(0.9, 4, gold, 0, 2.5, -4, false, 10);
    jetRing(it, 0, -4, 8.5, 28, 1.5, 5.5); jetRing(it, 0, -4, 5, 14, 3, 9); jetRing(it, 0, -4, 0.0001, 1, 16, 26, 2.2);
    // reception, staff, lifts and the way out
    const dz = -D / 2 + 12;
    it.box(18, 1.2, 2.8, mat(0x4a2e1c), 0, 0.6, dz, true); it.box(18.4, 0.14, 3.2, gold, 0, 1.27, dz);
    it.box(22, 8, 0.4, blue, 0, 5.2, -D / 2 + 0.5); it.name = dynSign(it, 17, 2.6, 0, 6.6, -D / 2 + 0.75, 0); it.name.set('BURJ AL ARAB JUMEIRAH', '#f4e6c0', '#16305c', 70);
    for (const x of [-5, 5]) it.human(makeHuman(0xf3f3f3, 0x16305c, SKINS[(x + 8) % 4], false), x, dz - 2.4, Math.PI);
    liftDoors(it, W / 2 - 0.3, -D / 2 + 22, 4, 4.4, 1, gold);
    it.sign(10, 1.1, 'LIFTS', '#16305c', '#e8c76a', W / 2 - 0.35, 5.8, -D / 2 + 26.5, -Math.PI / 2, 34);
    for (const x of [-3, 3]) it.human(makeHuman(0xf3f3f3, 0x16305c, SKINS[(x + 7) % 4], false), x * 2.4, D / 2 - 7, 0);
    // Al Mahara: the aquarium restaurant on the left
    const ax = -40, az = 8;
    it.cyl(8, 13, new THREE.MeshPhongMaterial({ color: 0x8fd6ff, transparent: true, opacity: 0.32, shininess: 120, specular: 0xffffff, depthWrite: false }), ax, 6.5, az, true, 28);
    it.cyl(7.7, 12.6, new THREE.MeshBasicMaterial({ color: 0x1a86ad }), ax, 6.4, az, false, 28);
    it.cyl(8.6, 0.6, gold, ax, 0.3, az, false, 28); it.cyl(8.6, 0.6, gold, ax, 13.2, az, false, 28);
    makeFish(it, 22, { x: ax, z: az, r: 6.4, y0: 1.5, y1: 11 });
    it.sign(16, 2.0, 'AL MAHARA · SEAFOOD', '#f4e6c0', '#16305c', ax, 16, az - 10.8, 0, 40);
    const tc = mat(0xf6f1e4), ch = mat(0x16305c);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.2; diningTable(it, ax + Math.cos(a) * 15.5, az + Math.sin(a) * 15.5, 'seafood', 'Al Mahara', tc, ch); }
    // Skyview Bar and lounge on the right
    const sx = 40, sz = 8;
    it.cyl(14, 0.1, lam(texCarpet(28, 28, '#16305c', '#d9b24a')), sx, 0.07, sz, false, 30);
    it.sign(16, 2.0, 'SKYVIEW BAR AND LOUNGE', '#f4e6c0', '#16305c', sx, 14, sz - 12.4, 0, 36);
    for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; diningTable(it, sx + Math.cos(a) * 9, sz + Math.sin(a) * 9, 'cafe', 'Skyview Bar', mat(0x2a2018), mat(0x8a2a2a)); }
    sofa(it, sx + 15.5, sz - 4, -Math.PI / 2, 0x16305c); sofa(it, sx + 15.5, sz + 6, -Math.PI / 2, 0x16305c);
    plant(it, -W / 2 + 4, -D / 2 + 4, 1.4); plant(it, W / 2 - 4, D / 2 - 4, 1.4); plant(it, -W / 2 + 4, D / 2 - 4, 1.4); plant(it, W / 2 - 4, -D / 2 + 4, 1.4);
    // a counter for the restaurants and the glass doors
    it.box(7, 1.2, 1.8, mat(0x4a2e1c), 0, 0.6, 24, true); it.box(7.4, 0.12, 2.2, gold, 0, 1.26, 24);
    it.waiter = it.human(makeHuman(0xf3f3f3, 0x16305c, SKINS[1], false), -2, 26, Math.PI);
    it.human(makeHuman(0xf3f3f3, 0x16305c, SKINS[2], false), 2, 26, Math.PI);
    it.box(14, 5.4, 0.3, GLASS, 0, 2.7, D / 2 - 0.1); it.box(0.7, 5.6, 0.7, gold, -7.2, 2.8, D / 2 - 0.1); it.box(0.7, 5.6, 0.7, gold, 7.2, 2.8, D / 2 - 0.1);
    it.sign(5, 0.9, 'EXIT', '#ffffff', '#1a6b3a', 0, 6.4, D / 2 - 0.5, Math.PI, 34);
    it.spawn = { x: 0, z: D / 2 - 6, h: 0 };
    wireMeals(it, 0, 21.8, 0, D / 2 - 3, 'the hotel');
    it.onEnter = () => { it.title = 'Burj Al Arab Jumeirah'; resetMeal(); };
    return registerInterior(it);
  }

  // ---------------- Burj Khalifa: lobby, statue, restaurant, reception, lifts ----------------
  function buildBkInterior() {
    const it = newInterior('hotel:bk', 'Burj Khalifa');
    it.theme = 'bk'; it.wide = true;
    const W = 150, D = 110, H = 48;
    it.W = W; it.D = D;
    const wall = mat(0xe9e4d6), steel = SILVER;
    exitSpot(it, 0, D / 2 - 3, 'the Burj Khalifa');
    it.spot(22, -D / 2 + 11 + 3.6, 5.2, 'reception: book a room (160 floors)', () => openBooking(it));
    it.spot(W / 2 - 4, -D / 2 + 26.5, 5, 'lifts: go to your floor', () => openLift(it));
    it.spot(W / 2 - 5.5, -D / 2 + 44.5, 4.2, 'At the Top: roof deck lift (level 160)', () => openDeckTicket());
    it.room(W, D, H, pho(texMarble(W, D, 12, '#dcd5c5', '#cdc5b0', '#a99e84'), 100), wall, mat(0xf6f2e6));
    // tapered pylons along the walls, echoing the tower's wings
    for (const x of [-60, -30, 30, 60]) for (const z of [-D / 2 + 3, D / 2 - 3]) { it.cyl(1.6, H, steel, x, H / 2, z, true, 12); }
    for (let i = 0; i < 24; i++) it.box(0.5, H - 6, 0.5, mat(0xcfd6dc), -W / 2 + 0.6, (H - 6) / 2 + 2, -D / 2 + 6 + i * ((D - 12) / 23));
    // facade glass on the south wall
    for (let i = 0; i < 30; i++) it.box(0.4, 10, 0.4, steel, -W / 2 + 5 + i * 4.8, 5, D / 2 - 0.2);
    // ---- the statue of the Burj Khalifa in the middle, in a basin ringed with small fountains
    it.cyl(17.8, 1.0, MAT.concreteL, 0, 0.5, 0, false, 40); it.cyl(17.2, 1.03, POOL_MAT, 0, 0.52, 0, false, 40); it.col(0, 0, 36, 36, 1.0);
    it.cyl(9.2, 2.2, mat(0xe6e0d0), 0, 1.1, 0, false, 32); it.cyl(6.4, 2.8, mat(0xcfc6b0), 0, 1.4, 0, false, 32);
    const sg = new THREE.Group(); sg.position.set(0, 2.8, 0); sg.scale.setScalar(0.02); it.g.add(sg);
    bkModel(sg, new THREE.MeshPhongMaterial({ color: 0xd3e3f0, map: bkTex, shininess: 120, specular: 0xffffff }));
    jetRing(it, 0, 0, 13.4, 40, 1.2, 3.6); jetRing(it, 0, 0, 15.8, 28, 0.8, 2.2); jetRing(it, 0, 0, 11, 24, 1.8, 4.6);
    it.sign(12, 1.4, 'BURJ KHALIFA · 828 m · 163 FLOORS', '#f4e6c0', '#14212e', 0, 1.6, 9.35, 0, 30);
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; it.bulb(Math.cos(a) * 19.2, 0.9, Math.sin(a) * 19.2, 0.25); }
    for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2; it.bulb(Math.cos(a) * 17, H - 4, Math.sin(a) * 17, 0.32); }
    for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; it.bulb(Math.cos(a) * 26, H - 3, Math.sin(a) * 26, 0.3); }
    // ---- the big restaurant (west)
    const rx = -52;
    it.sign(26, 2.4, 'SKYLINE GRAND BRASSERIE', '#f4e6c0', '#14212e', -50, 11, -D / 2 + 0.6, 0, 46);
    it.plane(44, 92, lam(texCarpet(44, 92, '#14304f', '#c9b27a')), rx - 4, 0.07, 0);
    const tc = mat(0xf6f1e4), cc = mat(0x14304f);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 6; r++) diningTable(it, -63 + c * 9.5, -36 + r * 13.4, 'arabic', 'Skyline Grand Brasserie', tc, cc);
    for (let z = -44; z <= 44; z += 9) if (Math.abs(z) > 5) plant(it, -30, z, 1.0);
    it.box(3, 1.2, 36, mat(0x3a2418), -W / 2 + 4, 0.6, -4, true); it.box(3.2, 0.12, 36.4, GOLD, -W / 2 + 4, 1.26, -4);
    it.human(makeHuman(0xf3f3f3, 0x141820, SKINS[2], false), -W / 2 + 1.8, -10, Math.PI / 2); it.human(makeHuman(0xf3f3f3, 0x141820, SKINS[0], false), -W / 2 + 1.8, 4, Math.PI / 2);
    it.box(30, 7, 0.3, mat(0x14212e), -50, 6, 49.7);
    it.box(6, 1.2, 1.8, mat(0x3a2418), -44, 0.6, 40, true); it.box(6.4, 0.12, 2.2, GOLD, -44, 1.26, 40);
    it.waiter = it.human(makeHuman(0xf3f3f3, 0x141820, SKINS[1], false), -44, 42, Math.PI);
    it.human(makeHuman(0xf3f3f3, 0x141820, SKINS[3], false), -46.4, 42, Math.PI);
    // ---- reception (north east) and the lifts (east wall)
    const dz = -D / 2 + 11, rcx = 22;
    it.box(18, 1.2, 2.8, mat(0x2b2118), rcx, 0.6, dz, true); it.box(18.4, 0.14, 3.2, steel, rcx, 1.27, dz);
    it.box(22, 7, 0.4, mat(0x14212e), rcx, 5, -D / 2 + 0.5); it.name = dynSign(it, 17, 2.4, rcx, 5.6, -D / 2 + 0.75, 0); it.name.set('RESERVATIONS AND CHECK-IN', '#f4e6c0', '#14212e', 50);
    for (const x of [-5, 5]) it.human(makeHuman(0xf3f3f3, 0x14212e, SKINS[(x + 8) % 4], false), rcx + x, dz - 2.4, Math.PI);
    liftDoors(it, W / 2 - 0.3, -D / 2 + 22, 6, 4.4, 1, steel);
    it.sign(10, 1.1, 'LIFTS · 160 FLOORS', '#ffffff', '#14212e', W / 2 - 0.35, 5.8, -D / 2 + 26.5, -Math.PI / 2, 28);
    // the observation deck lift: two gold doors and a ticket desk
    for (let i = 0; i < 2; i++) { it.box(3.4, 4.8, 0.3, GOLD, W / 2 - 0.3, 2.4, -D / 2 + 44 + i * 4.6); it.box(0.15, 0.4, 0.4, RED_LIGHT, W / 2 - 0.5, 5, -D / 2 + 44 + i * 4.6); }
    it.sign(12, 1.2, 'AT THE TOP · SKY DECK · LEVEL 160', '#14212e', '#e8c76a', W / 2 - 0.35, 6.2, -D / 2 + 46.3, -Math.PI / 2, 26);
    it.box(2.2, 1.2, 8, mat(0x2b2118), W / 2 - 7, 0.6, -D / 2 + 46.3, true);
    it.human(makeHuman(0xf3f3f3, 0x14212e, SKINS[2], false), W / 2 - 8.8, -D / 2 + 46.3, -Math.PI / 2);
    // seating, plants and the glass entrance
    for (let i = 0; i < 3; i++) sofa(it, 42, 18 + i * 7, -Math.PI / 2, 0x14304f);
    plant(it, W / 2 - 4, D / 2 - 4, 1.4); plant(it, 4, D / 2 - 4, 1.4); plant(it, -4, D / 2 - 4, 1.4); plant(it, W / 2 - 4, -D / 2 + 4, 1.4);
    it.box(16, 6, 0.3, GLASS, 0, 3, D / 2 - 0.1); it.box(0.7, 6.2, 0.7, steel, -8.2, 3.1, D / 2 - 0.1); it.box(0.7, 6.2, 0.7, steel, 8.2, 3.1, D / 2 - 0.1);
    it.sign(5, 0.9, 'EXIT', '#ffffff', '#1a6b3a', 0, 7, D / 2 - 0.5, Math.PI, 34);
    it.spawn = { x: 0, z: D / 2 - 6, h: 0 };
    wireMeals(it, -44, 37.4, 0, D / 2 - 3, 'the Burj Khalifa');
    it.onEnter = () => { it.title = 'Burj Khalifa'; resetMeal(); };
    return registerInterior(it);
  }

  // ---------------- At the Top: the roof deck high above the city ----------------
  const deck = { it: null, endTotal: 0, warned: false };
  function cityMapTexture(canvas, f) {
    const g = canvas.getContext('2d'), N = 1024, scale = N / 3000, ox = -BK.x, oz = -BK.z;
    const px = (x) => (x + ox + 1500) * scale, pz = (z) => (z + oz + 1500) * scale;
    const night = f < 0.5;
    g.fillStyle = night ? '#070b14' : '#c9b98c'; g.fillRect(0, 0, N, N);
    // the Gulf, the Palm and the creek
    const coast = pz(-520);
    g.fillStyle = night ? '#06182a' : '#3d9ec4'; g.fillRect(0, 0, N, coast);
    g.fillStyle = night ? '#241d12' : '#e6d6a8';
    g.beginPath(); g.moveTo(px(232), pz(-520)); g.lineTo(px(248), pz(-520)); g.lineTo(px(248), pz(-1130)); g.lineTo(px(232), pz(-1130)); g.fill();
    for (const sg of [-1, 1]) for (let i = 0; i < 8; i++) { const az = -872 - i * 36; g.beginPath(); g.moveTo(px(240), pz(az)); g.lineTo(px(240 + sg * 45), pz(az - 63)); g.lineWidth = 5 * scale * 3; g.strokeStyle = g.fillStyle; g.stroke(); }
    g.fillStyle = night ? '#241d12' : '#e6d6a8'; g.fillRect(px(-199), pz(-759), 78 * scale, 79 * scale);
    // roads, lit at night
    g.lineWidth = Math.max(1.2, 14 * scale); g.strokeStyle = night ? 'rgba(255,170,80,0.65)' : '#6a6d73';
    g.beginPath();
    for (let i = -14; i <= 14; i++) { const x = px(i * 80); g.moveTo(x, coast); g.lineTo(x, N); }
    for (let j = -6; j <= 18; j++) { const z = pz(j * 80); if (z > coast) { g.moveTo(0, z); g.lineTo(N, z); } }
    g.stroke();
    g.strokeStyle = night ? 'rgba(255,255,255,0.95)' : '#d33a2c'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, pz(0)); g.lineTo(N, pz(0)); g.stroke();
    // buildings: lit windows at night, pale blocks by day, densest around the Burj Khalifa
    const rnd = mulberry(7);
    for (let i = 0; i < 9000; i++) {
      const x = (rnd() - 0.5) * 3000, z = -520 + rnd() * 2400, cx = x - BK.x, cz = z - BK.z;
      const dens = Math.exp(-Math.hypot(cx, cz * 1.4) / 700) + 0.1;
      if (rnd() > dens) continue;
      const X = px(x), Z = pz(z);
      if (night) { g.fillStyle = rnd() < 0.7 ? 'rgba(255,214,140,0.9)' : 'rgba(190,225,255,0.9)'; g.fillRect(X, Z, 1.6 + rnd() * 1.6, 1.6 + rnd() * 1.6); }
      else { g.fillStyle = rnd() < 0.5 ? '#e8e2d2' : '#9eb3c4'; g.fillRect(X, Z, 2 + rnd() * 3, 2 + rnd() * 3); }
    }
    // the Burj Khalifa below, glowing; the Burj Al Arab sail far to the north west
    g.fillStyle = night ? 'rgba(255,240,200,1)' : '#ffffff'; g.beginPath(); g.arc(px(BK.x), pz(BK.z), 5, 0, 7); g.fill();
    g.fillStyle = night ? 'rgba(160,220,255,1)' : '#ffffff'; g.beginPath(); g.arc(px(BAA.x), pz(BAA.z), 4, 0, 7); g.fill();
  }
  function buildBkDeck() {
    const it = newInterior('bk:deck', 'At the Top · Level 160');
    it.theme = 'bk'; deck.it = it;
    // the platform: a round marble deck with a glass rail, a lift pavilion and telescopes
    it.cyl(11, 0.5, lam(texMarble(22, 22, 6, '#b9b2a2', '#aaa290', '#8c8270')), 0, -0.25, 0, false, 40).receiveShadow = false;
    it.cyl(11.4, 0.7, steel2(), 0, -0.42, 0, false, 40);
    for (let i = 0; i < 28; i++) {
      const a = i / 28 * Math.PI * 2, x = Math.cos(a) * 10.4, z = Math.sin(a) * 10.4;
      const p = it.box(2.2, 1.5, 0.12, new THREE.MeshPhongMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0.3, shininess: 130, specular: 0xffffff, depthWrite: false }), x, 0.85, z, false, -a + Math.PI / 2);
      it.col(x, z, 2.4, 2.4, 1.6);
      it.cyl(0.09, 1.5, steel2(), x + Math.cos(a + 0.12) * 0, 0.85, z, false, 6);
    }
    for (let i = 0; i < 56; i++) { const a = i / 56 * Math.PI * 2; it.bulb(Math.cos(a) * 10.4, 1.62, Math.sin(a) * 10.4, 0.08); }
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.5, x = Math.cos(a) * 4.6, z = Math.sin(a) * 4.6; it.box(1.8, 0.45, 0.7, mat(0x6b4a2f), x, 0.45, z, true, -a + Math.PI / 2); }
    it.cyl(0.9, 150, steel2(), 0, 75, 0, true, 10).castShadow = false; it.bulb(0, 151, 0, 0.6);
    // lift pavilion on the south side
    it.box(5.4, 3.6, 4, new THREE.MeshPhongMaterial({ color: 0x9fb8cc, transparent: true, opacity: 0.55, shininess: 100, specular: 0xffffff }), 0, 1.8, 7.8, true);
    it.box(5.6, 0.3, 4.2, GOLD, 0, 3.75, 7.8); it.sign(4.4, 0.7, 'LIFT', '#14212e', '#e8c76a', 0, 3.1, 5.78, Math.PI, 30);
    // telescopes
    for (const a of [1.1, 2.2, 3.9]) { const x = Math.cos(a) * 8.6, z = Math.sin(a) * 8.6; it.cyl(0.07, 1.5, steel2(), x, 0.75, z, true, 6); it.cyl(0.18, 1.1, mat(0x14212e), x, 1.6, z, false, 10).rotation.z = 0.9; }
    // sky, city lights far below, stars and drifting clouds
    const cc = document.createElement('canvas'); cc.width = cc.height = 1024;
    const ct = new THREE.CanvasTexture(cc);
    const ground = new THREE.Mesh(new THREE.CircleGeometry(1500, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: ct }));
    ground.position.set(0, -395, 0); ground.userData.keep = true; it.g.add(ground);
    deck.canvas = cc; deck.tex = ct; deck.lastF = -9;
    const cloudTex = canvasTex(128, 64, (g) => { for (let i = 0; i < 9; i++) { const x = 20 + Math.random() * 88, y = 20 + Math.random() * 24, r = 12 + Math.random() * 16, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 64); } });
    cloudTex.wrapS = cloudTex.wrapT = THREE.ClampToEdgeWrapping;
    const clouds = [];
    for (let i = 0; i < 18; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, transparent: true, opacity: 0.5, depthWrite: false }));
      const big = 60 + Math.random() * 90; sp.scale.set(big, big * 0.45, 1);
      sp.position.set((Math.random() - 0.5) * 700, i < 5 ? -8 + Math.random() * 20 : -160 + Math.random() * 130, -Math.random() * 360 + 120); sp.userData.sp = 2.5 + Math.random() * 4;
      it.g.add(sp); clouds.push(sp);
    }
    const sp = []; for (let i = 0; i < 700; i++) { const a = Math.random() * Math.PI * 2, e = Math.random() * 1.3 + 0.05, r = 1050; sp.push(Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r); }
    const sgeo = new THREE.BufferGeometry(); sgeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    const stars = new THREE.Points(sgeo, new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, transparent: true, depthWrite: false, fog: false })); stars.frustumCulled = false; it.g.add(stars);
    it.upd.push((dt, t) => {
      for (const c of clouds) { c.position.x += c.userData.sp * dt; if (c.position.x > 380) c.position.x = -380; }
      const f = lightF < 0 ? 1 : lightF;
      if (Math.abs(f - deck.lastF) > 0.05) { deck.lastF = f; cityMapTexture(cc, f); ct.needsUpdate = true; stars.material.opacity = clamp(1.4 - f * 1.8, 0, 1); }
      const left = deck.endTotal - GC.total;
      if (left < 5 && !deck.warned) { deck.warned = true; toast('Your sky deck time is almost up.', 'fail'); }
      if (left <= 0 && INT.active === it && !uiBusy) deckDown();
    });
    it.spawn = { x: 0, z: 3.6, h: 0 };
    it.spot(0, 5.8, 3.4, 'take the lift back down', () => deckDown());
    it.spot(Math.cos(1.1) * 8.6, Math.sin(1.1) * 8.6, 3, 'look through the telescope', () => { toast('Far below, the Dubai Mall and the Fountain, the Palm in the Gulf and the Burj Al Arab sail glow in the haze.'); addXP(15); });
    it.spot(Math.cos(2.2) * 8.6, Math.sin(2.2) * 8.6, 3, 'take a photo of the skyline', () => { toast('Great photo! You are higher than the clouds.', 'win'); addXP(25); beep([1319], 0.15, 'sine', 0.06); });
    it.onEnter = () => {
      deck.warned = false; deck.lastF = -9; sun.castShadow = false; for (const m of seaPlanes()) m.visible = false;
      // look slightly downwards so the city far below is in view
      INT.camFn = () => { const f = fwd(P.h); return [P.x - f.x * 7, 7.5, P.z - f.z * 7, P.x + f.x * 24, -9, P.z + f.z * 24]; };
    };
    it.onLeave = () => { sun.castShadow = true; for (const m of seaPlanes()) m.visible = true; INT.camFn = null; };
    return registerInterior(it);
  }
  const steel2 = () => SILVER;
  const seaPlanes = () => scene.children.filter((o) => o.isMesh && o.geometry && o.geometry.parameters && o.geometry.parameters.width === 12000);
  function openDeckTicket() {
    const opts = [
      { id: 'd1', name: 'Roof Deck · level 160', note: '30 minutes of game time on the open sky deck', price: 10000, mins: 30 },
      { id: 'd2', name: 'Sunset VIP deck', note: '60 minutes, Arabic coffee and dates, private telescope', price: 25000, mins: 60 },
      { id: 'd3', name: 'Private sky terrace', note: '3 hours for you and your guests', price: 80000, mins: 180 },
    ];
    let html = '<p class="note">At the Top, level 160: a small open deck above the clouds. At night the whole city glows far below. Every ticket costs at least AED 10,000.</p>';
    for (const o of opts) html += '<div class="row"><div class="nm">' + o.name + '<small>' + o.note + '</small></div><div class="pr">' + fmtMoney(o.price) + '</div><button class="b" data-act="' + o.id + '" data-p="' + o.price + '" data-m="' + o.mins + '">Buy</button></div>';
    openPanel('At the Top · Sky Deck', html, (act, d) => {
      const price = +d.p, mins = +d.m;
      if (save.cash < price) { toast('Not enough cash for this ticket.', 'fail'); return; }
      save.cash -= price; persist(); addXP(Math.round(price / 40));
      closePanel(); deck.endTotal = GC.total + mins; deck.warned = false;
      toast('Going up to the sky deck...'); beep([880, 1175, 1568], 0.7, 'sine', 0.08);
      switchInterior(deck.it || buildBkDeck(), null, () => toast('Level 160. Welcome to the top of the world!', 'win', 3500));
    });
  }
  function deckDown() {
    toast('Going down to the lobby...'); beep([1175, 880], 0.5, 'sine', 0.08);
    const lb = INTERIORS.get('hotel:bk') || buildBkInterior();
    switchInterior(lb, { x: lb.W / 2 - 8, z: -lb.D / 2 + 44.5, h: Math.PI / 2 });
  }

  // ---- plug the new interiors and the 160-floor rooms into the hotel code ----
  ROOM_CLASSES.bk = [
    { id: 'bkdeluxe', name: 'Deluxe Room', lo: 3, hi: 38, price: 900 },
    { id: 'bksuite', name: 'Skyline Suite', lo: 39, hi: 78, price: 2200 },
    { id: 'bkresi', name: 'Residence Suite', lo: 79, hi: 118, price: 4500 },
    { id: 'bkpent', name: 'Sky Penthouse', lo: 119, hi: 159, price: 12000 },
  ];
  const _origHotel = buildHotelInterior;
  buildHotelInterior = function (theme) { return theme === 'baa' ? buildBaaInterior() : theme === 'bk' ? buildBkInterior() : _origHotel(theme); };
