// Animated dot-topography background (based on the Madium site background).
// Usage: Topography.mount(canvas, { variant: 'home' | 'calm', hover: '.btn, .card' })
(() => {
  const VARIANTS = {
    home: {
      gap: [16, 18], alpha: [.018, .19], radius: [.7, .95], speed: 1,
      band: [-.52, -.26, .26, .54], centerHole: true, ripples: 1, pointer: 1
    },
    calm: {
      gap: [18, 18], alpha: [.006, .07], radius: [.65, .8], speed: .45,
      band: [-.52, -.18, .28, .55], centerHole: false, ripples: .45, pointer: .5
    }
  };
  const BUCKETS = 24, MAX_ALPHA = .34;
  const hash = (x, y) => { const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return value - Math.floor(value); };
  const smoothstep = (lo, hi, value) => { const n = Math.max(0, Math.min(1, (value - lo) / (hi - lo))); return n * n * (3 - 2 * n); };

  function mount(canvas, options = {}) {
    const cfg = VARIANTS[options.variant] || VARIANTS.home;
    const hoverSelector = options.hover || null;
    const context = canvas.getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPower = matchMedia('(pointer: coarse)').matches || innerWidth <= 760;
    let width = 0, height = 0, dots = [], lastDraw = 0, started = null, visible = true;
    // Mobile starts at 30fps; desktop drops to 30fps automatically if frames run slow.
    let minFrameGap = lowPower ? 1000 / 30 : 0, slowFrames = 0;
    const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, power: 0, target: 0 };
    const hover = { el: null, power: 0, rect: null };
    const ripples = [];
    const paths = new Array(BUCKETS);

    const layout = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, lowPower ? 1.5 : 2);
      width = bounds.width; height = bounds.height;
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const gap = width <= 560 ? cfg.gap[0] : cfg.gap[1], cols = Math.ceil(width / gap), rows = Math.ceil(height / gap);
      const cx = width / 2, cy = height / 2, diag = Math.hypot(cx, cy);
      dots = [];
      for (let rr = 0; rr <= rows; rr++) for (let cc = 0; cc <= cols; cc++) {
        const x = cc * gap + (hash(cc, rr) - .5) * 2.2, y = rr * gap + (hash(rr + 91, cc + 43) - .5) * 2.2;
        const dx = (x - cx) / (width / 2), dy = (y - cy) / (height / 2);
        const pr = cfg.centerHole ? smoothstep(.18, .5, Math.sqrt(dx * dx + dy * dy)) : 1;
        dots.push({
          x, y, nx: (x - cx) / width, ny: (y - cy) / height,
          seed: hash(cc + 7, rr + 13) * Math.PI * 2, mask: .28 + pr * .72,
          reveal: Math.hypot(x - cx, y - cy) / diag
        });
      }
    };

    const distToRect = (x, y, r) => {
      const dx = Math.max(r.left - x, 0, x - r.right), dy = Math.max(r.top - y, 0, y - r.bottom);
      return Math.hypot(dx, dy);
    };

    const draw = now => {
      if (started === null) started = now;
      const t = (reduced ? 0 : now / 1000) * cfg.speed;
      const age = (now - started) / 1000;
      context.clearRect(0, 0, width, height);

      pointer.x += (pointer.tx - pointer.x) * .08; pointer.y += (pointer.ty - pointer.y) * .08;
      pointer.power += (pointer.target - pointer.power) * .05;
      hover.power += ((hover.el ? 1 : 0) - hover.power) * .1;
      if (hover.el) hover.rect = hover.el.getBoundingClientRect();

      const nowS = now / 1000;
      for (let i = ripples.length - 1; i >= 0; i--) if (nowS - ripples[i].t0 > 1.8) ripples.splice(i, 1);

      const sway = Math.sin(t * .35) * .06;
      const [b0, b1, b2, b3] = cfg.band;
      for (let i = 0; i < BUCKETS; i++) paths[i] = new Path2D();

      for (const d of dots) {
        // load-in: dots appear in a wave travelling outward from the centre
        const intro = reduced ? 1 : smoothstep(0, .35, age * 1.1 - d.reveal * .75);
        if (intro <= 0) continue;
        const nx = d.nx + t * .045, ny = d.ny - t * .012;
        const terrain = Math.sin(nx * 13 + ny * 3.8 + t * .55) * .48 + Math.sin(nx * 6.7 - ny * 12.5 - t * .42) * .32;
        const rg = .5 + .5 * Math.sin(ny * 28 + terrain * 5.7 + Math.sin(nx * 8.5 + t * .3) * 1.4 - t * 1.6);
        const density = smoothstep(.28, .79, Math.max(0, Math.min(1, terrain + .86))) * rg;
        const fade = smoothstep(b0 + sway, b1 + sway, d.ny) * (1 - smoothstep(b2 + sway, b3 + sway, d.ny));
        let x = d.x, y = d.y, glow = 0;
        if (!reduced) { x += Math.sin(t * 1.4 + d.seed) * .9; y += Math.cos(t * 1.1 + d.seed) * .9; }

        if (pointer.power > .01) {
          const px = x - pointer.x, py = y - pointer.y, dist = Math.hypot(px, py);
          if (dist < 170) {
            const f = (1 - dist / 170) ** 2 * pointer.power * cfg.pointer; glow += f;
            const push = f * 9 / (dist || 1); x += px * push; y += py * push;
          }
        }
        for (const r of ripples) {
          const rage = nowS - r.t0, front = rage * 620, px = x - r.x, py = y - r.y, dist = Math.hypot(px, py);
          const band = Math.exp(-(((dist - front) / 38) ** 2)) * (1 - rage / 1.8) ** 2 * cfg.ripples;
          if (band > .01) { glow += band * .9; const push = band * 7 / (dist || 1); x += px * push; y += py * push; }
        }
        if (hover.power > .01 && hover.rect) {
          const dist = distToRect(x, y, hover.rect);
          if (dist < 110) glow += (1 - dist / 110) ** 2 * hover.power * 1.3;
        }

        const alpha = Math.min(MAX_ALPHA, ((cfg.alpha[0] + density * cfg.alpha[1]) * fade * d.mask + glow * .17) * intro);
        if (alpha <= .012) continue;
        const radius = (cfg.radius[0] + density * cfg.radius[1] + glow * .55) * (.4 + intro * .6);
        const path = paths[Math.min(BUCKETS - 1, Math.floor(alpha / MAX_ALPHA * BUCKETS))];
        path.moveTo(x + radius, y); path.arc(x, y, radius, 0, Math.PI * 2);
      }
      for (let i = 0; i < BUCKETS; i++) {
        context.fillStyle = `rgb(225 225 225 / ${(i + .5) / BUCKETS * MAX_ALPHA})`;
        context.fill(paths[i]);
      }
    };

    const loop = now => {
      requestAnimationFrame(loop);
      if (!visible || document.hidden || now - lastDraw < minFrameGap - 1) return;
      const spent = performance.now();
      draw(now); lastDraw = now;
      if (!minFrameGap && performance.now() - spent > 12 && ++slowFrames > 30) minFrameGap = 1000 / 30;
    };

    const onResize = () => { layout(); if (reduced) draw(performance.now()); };
    const onMove = event => {
      pointer.tx = event.clientX; pointer.ty = event.clientY; pointer.target = 1;
      if (pointer.x < -1e3) { pointer.x = pointer.tx; pointer.y = pointer.ty; }
    };
    const onLeave = () => { pointer.target = 0; };
    const onDown = event => {
      if (ripples.length > 5) ripples.shift();
      ripples.push({ x: event.clientX, y: event.clientY, t0: performance.now() / 1000 });
    };
    const onOver = event => { hover.el = event.target.closest?.(hoverSelector) || null; };

    layout();
    addEventListener('resize', onResize);
    if (reduced) { draw(performance.now()); return; }
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    if (hoverSelector) document.addEventListener('pointerover', onOver);
    if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(canvas);
    requestAnimationFrame(loop);
  }

  window.Topography = { mount };
})();
