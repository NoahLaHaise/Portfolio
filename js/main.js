/* =========================================================================
   Shared page behaviour: the ordered-dither glow behind the footer, and the
   local-time readout in the header.
   ========================================================================= */
(() => {
  // ---- header clock (Jacksonville time) ----
  const clock = document.querySelector('[data-clock]');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => { clock.textContent = `JAX ${fmt.format(new Date())} ET`; };
    tick(); setInterval(tick, 15000);
  }

  // ---- footer dither ----
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fc = document.querySelector('footer.end canvas');
  if (!fc) return;

  const fx = fc.getContext('2d');
  const B = [0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,62,30,54,22,
             3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,29,53,21];
  let fw = 1, fh = 1, img, mx = 0.7, last = 0, visible = false;

  function resize() {
    const r = fc.getBoundingClientRect();
    fw = Math.max(1, Math.round(r.width / 3)); fh = Math.max(1, Math.round(r.height / 3));
    fc.width = fw; fc.height = fh; img = fx.createImageData(fw, fh);
  }
  function draw(t) {
    const d = img.data;
    for (let j = 0; j < fh; j++) for (let i = 0; i < fw; i++) {
      const u = i / fw, v = j / fh;
      const g = 0.5 * Math.exp(-((u - mx) ** 2) * 5 - ((v - 1.2) ** 2) * 3.2)
              + 0.1 * Math.sin(u * 9 + t * 0.4 + v * 3) * v;
      const p = (j * fw + i) * 4;
      const lit = g * 64 > B[(j & 7) * 8 + (i & 7)];
      const hot = g * 64 > B[(j & 7) * 8 + (i & 7)] + 22;   // a second, brighter tier near the core
      d[p] = hot ? 138 : 42; d[p + 1] = hot ? 143 : 42; d[p + 2] = hot ? 248 : 208;
      d[p + 3] = lit ? (hot ? 170 : 210) : 0;
    }
    fx.putImageData(img, 0, 0);
  }

  resize(); draw(0);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(fc);
  (function loop(now = 0) {
    if (reduce) return;
    requestAnimationFrame(loop);
    if (!visible || now - last < 66) return;
    last = now; draw(now / 1000);
  })();
  addEventListener('resize', () => { resize(); draw(performance.now() / 1000); });
  fc.parentElement.addEventListener('pointermove', e => {
    const r = fc.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width;
  });
})();
