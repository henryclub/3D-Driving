
  // ================= LANDMARKS2: Burj Khalifa and Burj Al Arab, outside and in =================
  // ---- shared geometry helpers ----
  // A square-ish tower that narrows as it rises (flat shaded, tiled windows)
  function frustumGeo(wb, db, ratio, h) {
    let geo = new THREE.CylinderGeometry(0.7071 * ratio, 0.7071, h, 4, 1, false).rotateY(Math.PI / 4);
    geo.scale(wb, 1, db);
    geo = geo.toNonIndexed(); geo.computeVertexNormals();
    const uv = geo.attributes.uv, tu = Math.max(1, Math.round((wb + db) / 16)), tv = h / 16;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * tu * 2, uv.getY(i) * tv);
    return geo;
  }
  // The billowing sail: it narrows towards the top and bulges towards the viewer
  function sailGeo(hw0, H, dep, nu = 30, nv = 44) {
    const pos = [], idx = [];
    for (let j = 0; j <= nv; j++) {
      const v = j / nv, hw = hw0 * (1 - 0.82 * Math.pow(v, 1.1)), d = dep * (1 - 0.6 * v);
      for (let i = 0; i <= nu; i++) { const u = i / nu * 2 - 1; pos.push(u * hw - 0.55 * hw0 * Math.pow(v, 1.2), 4 + v * H, d * (1 - u * u)); }
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx); geo.computeVertexNormals();
    return geo;
  }
  function sailRibs(parent, hw0, H, dep, y0, z0) {
    const pts = [];
    const P3 = (u, v) => { const hw = hw0 * (1 - 0.82 * Math.pow(v, 1.1)), d = dep * (1 - 0.6 * v); return [u * hw - 0.55 * hw0 * Math.pow(v, 1.2), 4 + v * H + y0, d * (1 - u * u) + z0]; };
    for (const u of [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1]) for (let j = 0; j < 40; j++) { pts.push(...P3(u, j / 40), ...P3(u, (j + 1) / 40)); }
    for (let j = 1; j < 14; j++) { const v = j / 14; for (let i = 0; i < 24; i++) pts.push(...P3(i / 12 - 1, v), ...P3((i + 1) / 12 - 1, v)); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const ln = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0x59606c })); ln.userData.keep = true; parent.add(ln);
  }

  // ---- Burj Khalifa: three wings with spiralling setbacks around a hexagonal core, then the needle ----
  const BK_H = 828;
  const bkTex = canvasTex(128, 128, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, '#a9c3d8'); gr.addColorStop(1, '#6f8fae');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    g.fillStyle = '#eef4f9'; for (let i = 0; i < 4; i++) g.fillRect(i * 32, 0, 3, 128);
    g.fillStyle = '#4f6d8c'; for (let j = 0; j < 4; j++) g.fillRect(0, j * 32 + 29, 128, 3);
  });
  const BK_GLASS = new THREE.MeshPhongMaterial({ color: 0xdbe9f4, map: bkTex, shininess: 120, specular: 0xffffff, emissive: 0xffffff, emissiveMap: curtainLit, emissiveIntensity: 0 });
  NIGHT_MATS.push(BK_GLASS);
  function bkModel(g, m, noNeedle) {
    const H = 600, steps = 26, sh = H / steps, a0 = Math.PI;
    put(g, tubeGeo(11, 7, H + 24, 6, true), m, 0, (H + 24) / 2, 0);
    for (let s = 0; s < steps; s++) for (let k = 0; k < 3; k++) {
      const t = (s + k / 3) / steps, L = 31 * (1 - 0.9 * Math.pow(t, 0.8)), Wd = 17.5 * (1 - 0.6 * t);
      const y0 = s * sh, a = a0 + k * Math.PI * 2 / 3, dx = Math.sin(a), dz = Math.cos(a);
      put(g, buildingGeo(Wd, sh + 0.2, L), m, dx * L / 2, y0 + sh / 2, dz * L / 2, a);
      put(g, tubeGeo(Wd / 2, Wd / 2, sh + 0.2, 12), m, dx * (L - Wd / 2), y0 + sh / 2, dz * (L - Wd / 2));
    }
    put(g, tubeGeo(6.2, 8.5, 96, 16), m, 0, H + 20 + 48, 0);
    for (const y of [H + 36, H + 70]) put(g, new THREE.CylinderGeometry(7.4, 7.4, 1.2, 16), SILVER, 0, y, 0);
    if (!noNeedle) put(g, new THREE.CylinderGeometry(0.25, 3.2, BK_H - (H + 116), 10), SILVER, 0, H + 116 + (BK_H - (H + 116)) / 2, 0);
  }
  function buildBurjKhalifa(parent) {
    const g = new THREE.Group(); g.position.set(BK.x, 0, BK.z); parent.add(g);
    bkModel(g, BK_GLASS);
    // the paved forecourt and the glass pavilion with the entrance in the notch between the two southern wings
    plane(g, 62, 62, MAT.plaza, 0, 0.06, 0);
    plane(g, 30, 16, pho(texMarble(30, 16, 8, '#d9d2c2', '#cfc7b4', '#a99e84'), 60), 0, 0.08, 29);
    facade(g, 26, 14, 14, mat(0xcfd9e2), 0, 0, 22, 0);
    box(26.4, 10, 0.4, GLASS, 0, 6, 29.1, g);
    box(26.4, 0.8, 15, MAT.concreteL, 0, 14.4, 22, g);
    sign(g, 14, 1.8, labelMat('BURJ KHALIFA', '#f4e6c0', '#14212e', 640, 80, 46), 0, 12.6, 29.35, 0);
    for (const s of [-1, 1]) box(0.5, 6, 0.5, MAT.rail, s * 3.3, 3, 29.5, g);
    box(7.2, 0.3, 3.4, MAT.rail, 0, 6.2, 30.8, g); box(6.2, 5.6, 0.2, GLASS, 0, 2.8, 29.5, g);
    plane(g, 3.4, 6, mat(0x7a1a24), 0, 0.1, 33);
    dubai.bkBeacon = put(g, new THREE.SphereGeometry(1.1, 8, 6), RED_LIGHT, 0, BK_H + 1, 0, 0, false); dubai.bkBeacon.userData.keep = true;
    mergeStatic(g);
  }
  // collision boxes of the tower (chunk (3,1) lot (-1,-1) coordinates: the tower centre minus the chunk centre)
  const BK_COLS = (() => {
    const cx = BK.x - 240, cz = BK.z - 80, out = [{ x: cx, z: cz, w: 22, d: 22, h: BK_H }, { x: cx, z: cz + 22, w: 26, d: 14, h: 14 }];
    for (let k = 0; k < 3; k++) {
      const a = Math.PI + k * Math.PI * 2 / 3, dx = Math.sin(a), dz = Math.cos(a);
      out.push({ x: cx + dx * 15, z: cz + dz * 15, w: 14, d: 14, h: 320 }, { x: cx + dx * 24, z: cz + dz * 24, w: 10, d: 10, h: 80 });
    }
    return out;
  })();

  // ---- Burj Al Arab: the V-shaped hotel, the billowing sail, the Skyview cantilever and the helipad ----
  function buildBurjAlArab(parent) {
    const g = new THREE.Group(); g.position.set(BAA.x, 0, BAA.z); parent.add(g);
    const wingM = glassMat(0xb7cfe2), spineM = glassMat(0x8fa9bf); NIGHT_MATS.push(wingM, spineM);
    box(56, 9, 40, MAT.white, 0, 4.5, 1.5, g);
    box(58, 0.7, 42, GOLD, 0, 9.3, 1.5, g);
    // the two wings of the V, leaning slightly apart, and the spine at the back
    put(g, frustumGeo(15, 28, 0.55, 312), wingM, -17, 156, -3).rotation.z = 0.02;
    const rw = put(g, frustumGeo(20, 30, 0.25, 294), wingM, 16, 147, -3, 0.2); rw.rotation.z = 0.088;
    put(g, frustumGeo(24, 13, 0.3, 305), spineM, -8, 152, -15);
    put(g, new THREE.CylinderGeometry(0.4, 1.8, 46, 8), SILVER, -13, 312 + 18, -15);
    for (const x of [-12, -4]) put(g, new THREE.CylinderGeometry(0.5, 0.5, 300, 6), SILVER, x, 150, -22).rotation.x = -0.02;
    dubai.beacon = put(g, new THREE.SphereGeometry(1, 8, 6), RED_LIGHT, -13, 352, -15, 0, false); dubai.beacon.userData.keep = true;
    // the sail itself
    const sailM = new THREE.MeshPhongMaterial({ color: 0xf6f7f9, side: THREE.DoubleSide, shininess: 50, specular: 0x777777, transparent: true, opacity: 0.86, depthWrite: false, emissive: 0x000000 });
    dubai.sail = sailM;
    const sail = new THREE.Mesh(sailGeo(25, 292, 23), sailM); sail.position.set(0, 0, 10); sail.renderOrder = 2; sail.userData.keep = true; g.add(sail);
    sailRibs(g, 25, 292, 23, 0, 10);
    // the Skyview restaurant cantilevered out in front of the sail at 200 m, and the helipad on the left wing
    box(20, 2.8, 9, MAT.white, 0, 200, 31, g); box(20.4, 0.5, 9.4, GLASS, 0, 202.1, 31, g); box(20, 0.6, 9, GOLD, 0, 198.2, 31, g);
    for (const x of [-8, 8]) { const st = box(0.6, 0.6, 22, MAT.rail, x, 194, 21, g); st.rotation.x = 0.16; }
    box(13, 1, 3, MAT.white, -26, 209, -1, g);
    put(g, new THREE.CylinderGeometry(9, 9, 1, 24), MAT.white, -35, 209, -1);
    put(g, new THREE.RingGeometry(5.8, 6.4, 24).rotateX(-Math.PI / 2), MAT.blue, -35, 209.55, -1, 0, false);
    sign(g, 9, 1.4, labelMat('BURJ AL ARAB', '#e8c76a', '#14212e', 512, 80, 40), 0, 262, -8.2, 0);
    // entrance under a gold canopy
    box(7, 4.6, 0.3, GLASS, 0, 2.3, 21.3, g); box(0.5, 5, 0.5, GOLD, -3.7, 2.5, 21.3, g); box(0.5, 5, 0.5, GOLD, 3.7, 2.5, 21.3, g);
    box(16, 0.5, 10, GOLD, 0, 6.2, 26, g); box(15.4, 0.3, 9.4, mat(0xfff1c8), 0, 5.92, 26, g);
    for (const s of [-1, 1]) for (const z of [22.5, 30.5]) put(g, new THREE.CylinderGeometry(0.45, 0.45, 6, 12), GOLD, s * 7.6, 3, z);
    plane(g, 3.4, 10, mat(0x7a1a24), 0, 0.1, 26);
    box(56, 0.5, 40, MAT.concreteL, 0, 9.2, 1.5, g);
    // jets in the long pools either side of the drive (these move with the other fountains)
    for (const s of [-1, 1]) for (let i = 0; i < 6; i++) {
      const jm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.45, 1, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false }));
      jm.position.set(s * 16, 0.2, 31 + i * 4); jm.userData.keep = true; jm.userData.h0 = 4 + (i % 3) * 3; jm.userData.ph = i * 0.9 + s; g.add(jm); dubai.jets.push(jm);
    }
    mergeStatic(g);
  }
  // collision: the tower footprint, the gate pillars, the guard huts and the porch columns (island chunk coordinates are world coordinates here)
  const BAA_EXTRA_COLS = (() => {
    const bx = BAA.x, out = [];
    for (const s of [-1, 1]) {
      out.push({ minX: bx + s * 9.6 - 1.1, maxX: bx + s * 9.6 + 1.1, minZ: -686 - 1.1, maxZ: -686 + 1.1, h: 9 });
      out.push({ minX: bx + s * 15 - 1.6, maxX: bx + s * 15 + 1.6, minZ: -687 - 1.4, maxZ: -687 + 1.4, h: 3.2 });
      out.push({ minX: bx + s * 7.8 - 0.5, maxX: bx + s * 7.8 + 0.5, minZ: -717.5 - 0.5, maxZ: -717.5 + 0.5, h: 6 });
      out.push({ minX: bx + s * 7.8 - 0.5, maxX: bx + s * 7.8 + 0.5, minZ: -709.5 - 0.5, maxZ: -709.5 + 0.5, h: 6 });
    }
    return out;
  })();

  // The island: a real gate, the drive, the porch under the canopy and the long pools. Cars can drive right up to the door.
  // (island chunk: x = world - (-160), z = world + 720)
  function buildBaaIsland(g, cols, ox, oz) {
    box(80, 1.0, 80, MAT.concreteL, 0, -0.5, 0, g);
    box(83, 0.7, 83, MAT.rock, 0, -0.6, 0, g);
    plane(g, 80, 80, MAT.plaza, 0, 0.03, 0);
    plane(g, 80, 80, pho(texMarble(80, 80, 10, '#d9d2c0', '#cdc4ae', '#a99e84'), 40), 0, 0.04, 0);
    // the drive: dark asphalt from the gate to the porch with a gold edge line
    plane(g, 14, 40, mat(0x33363c), 0, 0.06, 20);
    for (const s of [-1, 1]) plane(g, 0.3, 40, mat(0xd9b24a), s * 6.6, 0.08, 20);
    plane(g, 0.3, 40, mat(0xf2c230), 0, 0.08, 20);
    plane(g, 20, 14, mat(0x33363c), 0, 0.06, 8);
    // long reflecting pools
    for (const s of [-1, 1]) {
      plane(g, 8, 24, LAKE_MAT, s * 16, 0.07, 20);
      for (const [x, z, w, d] of [[s * 16, 7.8, 9, 0.6], [s * 16, 32.2, 9, 0.6], [s * 12, 20, 0.6, 24.6], [s * 20, 20, 0.6, 24.6]]) box(w, 0.5, d, MAT.concreteL, x, 0.25, z, g);
    }
    // gate with two pillars, a gold arch and guard huts
    for (const s of [-1, 1]) {
      box(2.2, 9, 2.2, MAT.concreteL, s * 9.6, 4.5, 34, g); box(2.8, 0.6, 2.8, GOLD, s * 9.6, 9.2, 34, g);
      box(3.2, 3.2, 2.8, MAT.white, s * 15, 1.6, 33, g); box(3.4, 0.3, 3.0, GOLD, s * 15, 3.3, 33, g); box(2.4, 1.6, 0.1, GLASS, s * 15, 1.9, 31.5, g);
    }
    box(21, 1.6, 2.4, GOLD, 0, 8.6, 34, g);
    sign(g, 16, 1.4, labelMat('BURJ AL ARAB JUMEIRAH', '#14212e', '#e8c76a', 640, 56, 30), 0, 8.6, 32.7, 0);
    // palms and lamp posts along the drive and on the sides
    for (const x of [-26, -34, 26, 34]) for (const z of [12, 22, 30]) addTree(g, cols, ox, oz, x, z);
    for (const s of [-1, 1]) for (const z of [-10, 0]) addTree(g, cols, ox, oz, s * 36, z);
    for (const s of [-1, 1]) for (const z of [12, 24]) { const p = new THREE.Mesh(G.pole, mat(0x4a4f57)); p.position.set(s * 7.6, 3.25, z); g.add(p); const l = new THREE.Mesh(G.lamp, LAMP); l.position.set(s * 7.6 - s * 0.9, 6.4, z); g.add(l); }
    sign(g, 12, 2.0, labelMat('BURJ AL ARAB JUMEIRAH', '#e8c76a', '#14212e', 640, 88, 34), -26, 1.8, 36, 0);
  }
