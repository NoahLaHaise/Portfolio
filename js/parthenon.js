/* =========================================================================
   Parthenon plate — a raymarched Greek temple in drifting fog, rendered in
   WebGL at one fragment per dither cell and Bayer-dithered to an ultramarine
   palette. Any <canvas data-parthenon> on the page gets one.

   Per-canvas camera (all optional, defaults = home page view):
     data-yaw    viewing angle around the temple, radians (0 = long side, 1.57 = front)
     data-dist   camera distance
     data-ty     height the camera looks at
     data-cy     camera height relative to that target
     data-pan    how far to slide the temple left on wide plates
     data-moon   "x,y,r" sphere position (fraction of half-width, height) and radius; r = 0 hides it
     data-t0     seconds into the light cycle to start at

   Shader notes: keep every smoothstep with edge0 < edge1 and never pow() a
   negative base — both are undefined in GLSL and real GPUs (D3D/ANGLE) render
   garbage where SwiftShader happens to cope.
   ========================================================================= */
(() => {
  const CELL = 3;                                       // css px per dither cell
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const FRAG = `
  precision highp float;
  uniform vec2 res; uniform float t; uniform vec2 m;
  uniform vec4 cam;                   // yaw, distance, target height, camera height offset
  uniform float pan;                  // how far to slide the temple left on wide plates
  uniform vec3 moon;                  // screen x (fraction of half-width), screen y, radius; r = 0 hides it

  const float SP = 4.25;              // column spacing
  const float LH = 34.0;              // half-length (8 * SP): 17 columns down the long side
  const float WH = 14.875;            // half-width (3.5 * SP): 8 columns across the front
  const float CH = 10.4;              // column height

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
  float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a*noise(p); p *= 2.03; a *= .5; } return v; }
  float bayer2(vec2 a){ a = floor(a); return fract(a.x/2. + a.y*a.y*.75); }
  float bayer4(vec2 a){ return bayer2(.5*a)*.25 + bayer2(a); }
  float bayer8(vec2 a){ return bayer4(.5*a)*.25 + bayer2(a); }

  float sdBox(vec3 p, vec3 b){ vec3 q = abs(p) - b; return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.); }

  float column(vec3 p){
    float h = clamp(p.y / CH, 0., 1.);
    float r = .95 - .16*h;                                   // taper
    r -= .05*abs(sin(atan(p.z, p.x + 1e-4) * 10.));          // 20 flutes
    float d = max((length(p.xz) - r) * .8, abs(p.y - CH*.5) - CH*.5);
    float cap = sdBox(p - vec3(0., CH - .22, 0.), vec3(1.22, .22, 1.22));
    return min(d, cap);
  }

  vec3 gCam;                                                  // camera position, set in main()

  float groundH(vec2 xz){
    float far = smoothstep(42., 95., length(xz * vec2(.8, 1.)));
    float near = 1. - smoothstep(-58., -34., xz.y);           // foreground dunes between the viewer and the temple
    float clear = smoothstep(8., 22., length(xz - gCam.xz));  // ...but never under the camera itself
    if ((far + near) * clear <= 0.) return -1.6;              // flat precinct around the temple
    float n = fbm(xz * .03);
    return -1.6 + clear * (far * (fbm(xz * .018) * 9. - 2.5) + near * (n * n * 16. - 1.5));
  }

  vec3 figurePos(){
    float x = 45. - mod(t * .3, 70.);                         // a very slow walk across the precinct, right to left
    return vec3(x, -1.6, -WH - 14.);
  }

  // returns (distance, material): 1 marble, 2 cella, 3 ground, 4 figure
  vec2 map(vec3 p){
    // stylobate: three steps
    float d = sdBox(p - vec3(0., -.25, 0.), vec3(LH + 2.2, .25, WH + 2.2));
    d = min(d, sdBox(p - vec3(0., -.75, 0.), vec3(LH + 2.9, .25, WH + 2.9)));
    d = min(d, sdBox(p - vec3(0., -1.25, 0.), vec3(LH + 3.6, .25, WH + 3.6)));

    // peristyle: long sides, then the short ends
    vec3 q = p; q.z = abs(q.z) - WH; q.x -= SP * clamp(floor(q.x / SP + .5), -8., 8.);
    d = min(d, column(q));
    q = p; q.x = abs(q.x) - LH; q.z -= SP * (clamp(floor(q.z / SP), -4., 3.) + .5);
    d = min(d, column(q));

    // entablature, cornice, pitched roof
    d = min(d, sdBox(p - vec3(0., CH + 1.3, 0.), vec3(LH + 1.25, 1.3, WH + 1.25)));
    d = min(d, sdBox(p - vec3(0., CH + 2.75, 0.), vec3(LH + 1.7, .15, WH + 1.7)));
    float y0 = CH + 2.9, s = .24, wr = WH + 1.7;
    float roof = max(max(abs(p.x) - (LH + 1.7), ((p.y - y0) + s*abs(p.z) - s*wr) / sqrt(1. + s*s)), y0 - p.y);
    d = min(d, roof);
    vec2 res = vec2(d, 1.);

    float cella = sdBox(p - vec3(0., CH*.5, 0.), vec3(LH - 6., CH*.5, WH - 4.6));
    if (cella < res.x) res = vec2(cella, 2.);

    float g = (p.y - groundH(p.xz)) * .6;
    if (g < res.x) res = vec2(g, 3.);

    vec3 f = p - figurePos();
    float fig = length(vec2(length(f.xz), max(abs(f.y - .75) - .55, 0.))) - .22;   // capsule body
    fig = min(fig, length(f - vec3(0., 1.62, 0.)) - .16);                          // head
    if (fig < res.x) res = vec2(fig, 4.);
    return res;
  }

  vec3 calcNormal(vec3 p){
    vec2 e = vec2(.02, -.02);
    return normalize(e.xyy*map(p + e.xyy).x + e.yyx*map(p + e.yyx).x + e.yxy*map(p + e.yxy).x + e.xxx*map(p + e.xxx).x);
  }

  float shadow(vec3 ro, vec3 rd){
    float r = 1., s = .3;
    for (int i = 0; i < 40; i++){
      float h = map(ro + rd*s).x;
      r = min(r, 8.*h/s);
      s += clamp(h, .25, 4.);
      if (r < .01 || s > 110.) break;
    }
    return clamp(r, 0., 1.);
  }

  vec3 ramp(float b){
    b = clamp(b, 0., 1.);
    vec3 c = mix(vec3(.08,.08,.38), vec3(.15,.15,.65), smoothstep(0., .22, b));   // deep -> ultramarine ink
    c = mix(c, vec3(.40,.44,.88), smoothstep(.2, .5, b));                           // periwinkle
    c = mix(c, vec3(.72,.70,.95), smoothstep(.45, .75, b));                         // lavender
    return mix(c, vec3(.94,.93,.90), smoothstep(.72, 1., b));                       // paper
  }

  void main(){
    float aspect = res.x / res.y;
    vec2 p = (gl_FragCoord.xy - .5*res) / res.y;

    // camera: three-quarter view of the west front, eye level, drifting a hair with the cursor
    float yaw = cam.x + (m.x - .5) * .05;
    float D = cam.y * max(1., 1.9 / aspect);
    vec3 tgt = vec3(0., cam.z, 0.);
    vec3 ro = tgt + vec3(-sin(yaw) * D, cam.w + (m.y - .5) * -1.2, -cos(yaw) * D);
    vec3 fw = normalize(tgt - ro);
    vec3 rt = normalize(cross(vec3(0., 1., 0.), fw));
    vec3 up = cross(fw, rt);
    float slide = clamp(aspect - 1.6, 0., 1.) * pan;          // wide plates: slide the temple left of centre
    ro += rt * slide;
    gCam = ro;
    const float FOC = 1.6;
    vec3 rd = normalize(p.x*rt + p.y*up + FOC*fw);

    // sun swings slowly from the left, ~100 s per cycle, so column shadows creep across the cella
    vec3 sun = normalize(vec3(-.8 + .22*sin(t*.06), .5 + .07*sin(t*.045), -.28 + .12*cos(t*.06)));

    // sky: deep at the zenith, washing out toward the horizon, faint drifting cloud
    float sky = mix(.80, .10, smoothstep(-.12, .5, p.y));
    sky += .07 * (fbm(vec2(p.x*2.2 + t*.006, p.y*7.) ) - .5);

    // moon / sphere, engraved like the reference prints
    vec2 mp = vec2(.5*aspect*moon.x, moon.y), md = (p - mp) / max(moon.z, 1e-3);
    float mr = dot(md, md);
    if (moon.z > 0. && mr < 1.){
      vec3 n = vec3(md.x, md.y, sqrt(1. - mr));
      float lam = max(0., dot(n, normalize(vec3(-.7, .4, .6))));
      sky = .08 + .85*lam;
      if (mod(gl_FragCoord.y, 2.) < 1.) sky *= .7;
    }

    float b = sky;
    float s = 0.; vec2 h = vec2(0.);
    for (int i = 0; i < 110; i++){
      h = map(ro + rd*s);
      if (h.x < .01*s*.05 + .005 || s > 420.) break;
      s += h.x;
    }
    if (s < 420.){
      vec3 pos = ro + rd*s;
      vec3 n = calcNormal(pos);
      float dif = max(dot(n, sun), 0.);
      float sh = dif > 0. ? shadow(pos + n*.05, sun) : 0.;
      float amb = .32 + .22*n.y;
      float ao = clamp(map(pos + n*1.2).x / 1.2, 0., 1.);
      float alb = 1.;
      if (h.y == 2.) alb = .55;
      if (h.y == 3.) alb = .62;
      if (h.y == 1.){
        // triglyphs in the frieze band, roof tiles on the slopes
        float along = abs(n.x) > .5 ? pos.z : pos.x;
        if (pos.y > CH + .95 && pos.y < CH + 2.2 && fract(along / (SP*.5)) < .16) alb = .6;
        if (pos.y > CH + 2.95 && n.y > .5 && fract(pos.x * .9) < .12) alb = .8;
      }
      b = alb * (amb*(.55 + .45*ao) + .95*dif*sh);
      if (h.y == 4.) b = .04;

      // fog: distance haze + a low, slowly drifting ground fog that swallows the base
      float haze = 1. - exp(-s * .0032);
      float low = exp(-max(pos.y + 1.6, 0.) * .38) * smoothstep(.3, .8, fbm(pos.xz*.035 + vec2(t*.012, t*.005)));
      float fog = clamp(haze + low*.75*(1. - haze), 0., 1.);
      if (h.y == 4.) fog *= .35;
      b = mix(b, .86, fog);
    }

    // breathing mist band across the horizon, independent of geometry
    float by = (p.y + .16) / .12;
    float band = exp(-by*by) * (.35 + .25*fbm(vec2(p.x*1.5 - t*.01, t*.004)));
    b = mix(b, .88, band * .55);

    b *= mix(1., .72, 1. - smoothstep(-.5, -.18, p.y));        // weight the foreground, like the reference prints

    vec3 col = ramp(b);
    float bay = bayer8(gl_FragCoord.xy) - .5;
    col = floor(col*5. + .5 + bay) / 5.;
    gl_FragColor = vec4(col, 1.);
  }`;
  const VERT = 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }';

  function plate(cv) {
    const gl = cv.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) { cv.hidden = true; return; }               // the plate's CSS gradient stands in
    const compile = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    try {
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (err) { console.error('parthenon:', err); cv.hidden = true; return; }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = name => gl.getUniformLocation(prog, name);
    const uRes = u('res'), uT = u('t'), uM = u('m');

    const d = cv.dataset, num = (v, def) => (v === undefined || v === '' ? def : +v);
    const moon = (d.moon || '.66,.27,.085').split(',').map(Number);
    gl.uniform4f(u('cam'), num(d.yaw, .64), num(d.dist, 80), num(d.ty, 8.5), num(d.cy, -4.5));
    gl.uniform1f(u('pan'), num(d.pan, 16));
    gl.uniform3f(u('moon'), moon[0], moon[1], moon[2]);
    const t0 = num(d.t0, 40);                             // start mid-cycle so the first frame is well lit

    let mouse = [.5, .5], target = [.5, .5], last = -1e9, visible = true, lost = false;
    function resize() {
      const r = cv.getBoundingClientRect();
      cv.width = Math.max(1, Math.round(r.width / CELL)); cv.height = Math.max(1, Math.round(r.height / CELL));
      gl.viewport(0, 0, cv.width, cv.height);
    }
    function draw(now) {
      if (lost) return;
      mouse[0] += (target[0] - mouse[0]) * .015; mouse[1] += (target[1] - mouse[1]) * .015;
      gl.uniform2f(uRes, cv.width, cv.height); gl.uniform1f(uT, t0 + now / 1000);
      gl.uniform2f(uM, mouse[0], mouse[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    resize();
    cv.addEventListener('webglcontextlost', e => { e.preventDefault(); lost = true; cv.hidden = true; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(cv);
    (function loop(now = 0) {
      if (reduce) { draw(0); return; }
      requestAnimationFrame(loop);
      if (!visible || now - last < 1000 / 30) return;    // 30 fps is plenty for motion this slow
      last = now; draw(now);
    })();
    addEventListener('resize', () => { resize(); draw(reduce ? 0 : performance.now()); });
    cv.addEventListener('pointermove', e => {
      const r = cv.getBoundingClientRect();
      target = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
    });
  }

  document.querySelectorAll('canvas[data-parthenon]').forEach(plate);
})();
