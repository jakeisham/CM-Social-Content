// Draws hand-made marker annotations onto .shot-wrap elements after layout.
// Each wrap carries a <script type="application/json" class="ink-spec"> with:
//   { rotate, marks: [ {type, target, pad, label, seed}, {type:"note", text, near, side, dx, dy, x, y, size, rotate, arrowTo} ] }
// type: circle | underline | strike | check | cross | note. `target`/`near`/`arrowTo` name a [data-k] element.
(async () => {
  await document.fonts.ready;
  const RED = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#d92b1f";
  const NS = "http://www.w3.org/2000/svg";

  const rng = (seed) => {
    let x = (seed * 9301 + 49297) % 233280;
    return () => (x = (x * 9301 + 49297) % 233280) / 233280;
  };
  const stroke = (d, w = 5) =>
    `<path d="${d}" fill="none" stroke="${RED}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity=".92"/>`;

  function circle(b, pad, seed) {
    const r = rng(seed);
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    const rx = (b.w / 2 + pad) * 1.06, ry = (b.h / 2 + pad) * 1.18;
    const start = r() * Math.PI * 2, laps = 1.1 + r() * 0.1, p1 = r() * 6, p2 = r() * 6;
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const t = start + (i / 80) * laps * Math.PI * 2;
      const k = 1 + 0.045 * Math.sin(2 * t + p1) + 0.025 * Math.sin(5 * t + p2) + (i / 80) * 0.07;
      pts.push(`${(cx + Math.cos(t) * rx * k).toFixed(1)},${(cy + Math.sin(t) * ry * k).toFixed(1)}`);
    }
    return { svg: stroke("M" + pts.join(" L")), box: { x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2, ellipse: [cx, cy, rx * 1.05, ry * 1.05] } };
  }

  function underline(b, pad, seed) {
    const r = rng(seed);
    const y = b.y + b.h + 6 + pad, x1 = b.x - 8, x2 = b.x + b.w + 10;
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const x = x1 + ((x2 - x1) * i) / 30;
      pts.push(`${x.toFixed(1)},${(y + Math.sin(i * 0.9 + r() * 2) * 2.5 - i * 0.12).toFixed(1)}`);
    }
    const back = `M${x2 - 30},${y + 9} L${x1 + 20},${y + 12}`;
    return { svg: stroke("M" + pts.join(" L")) + stroke(back, 4), box: { x: x1, y: y - 6, w: x2 - x1, h: 18 } };
  }

  function strike(b, pad, seed) {
    const r = rng(seed);
    const y = b.y + b.h / 2;
    const a = `M${b.x - 8},${y + 4 + r() * 4} L${b.x + b.w + 8},${y - 6 + r() * 4}`;
    const c = `M${b.x - 4},${y + 10} L${b.x + b.w + 4},${y - 1}`;
    return { svg: stroke(a, 6) + stroke(c, 4), box: b };
  }

  function check(b, pad, seed) {
    const x = b.x + b.w + 18 + pad, y = b.y + b.h / 2;
    return { svg: stroke(`M${x},${y} L${x + 14},${y + 18} L${x + 44},${y - 26}`, 7), box: { x, y: y - 26, w: 44, h: 44 } };
  }

  function box(b, pad, seed) {
    const r = rng(seed), j = () => (r() - 0.5) * 6;
    const x1 = b.x - pad, y1 = b.y - pad, x2 = b.x + b.w + pad, y2 = b.y + b.h + pad;
    const d = `M${x1 + j()},${y1 + j()} L${x2 + j()},${y1 + j()} L${x2 + j()},${y2 + j()} L${x1 + j()},${y2 + j()} Z`;
    return { svg: stroke(d, 5).replace("/>", ' stroke-dasharray="16 12"/>'), box: { x: x1, y: y1, w: x2 - x1, h: y2 - y1 } };
  }

  function cross(b, pad) {
    const x1 = b.x - pad, y1 = b.y - pad, x2 = b.x + b.w + pad, y2 = b.y + b.h + pad;
    return { svg: stroke(`M${x1},${y1} L${x2},${y2} M${x2},${y1 + 6} L${x1 + 4},${y2}`, 7), box: { x: x1, y: y1, w: x2 - x1, h: y2 - y1 } };
  }

  // Point on a box (or ellipse) boundary heading towards (tx, ty).
  function edge(box, tx, ty) {
    if (box.ellipse) {
      const [cx, cy, rx, ry] = box.ellipse;
      const a = Math.atan2((ty - cy) / ry, (tx - cx) / rx);
      return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
    }
    const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
    const dx = tx - cx, dy = ty - cy;
    const s = Math.min(Math.abs(box.w / 2 / (dx || 1e-6)), Math.abs(box.h / 2 / (dy || 1e-6)));
    return [cx + dx * s, cy + dy * s];
  }

  function arrow(from, to, bend = 0.22) {
    const [x1, y1] = from, [x2, y2] = to;
    const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
    const a = Math.atan2(y2 - my, x2 - mx), h = 22;
    const p = (s) => `${(x2 - h * Math.cos(a + s)).toFixed(1)},${(y2 - h * Math.sin(a + s)).toFixed(1)}`;
    return stroke(`M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} M${p(-0.45)} L${x2.toFixed(1)},${y2.toFixed(1)} L${p(0.45)}`);
  }

  for (const wrap of document.querySelectorAll(".shot-wrap")) {
    const spec = JSON.parse(wrap.querySelector(".ink-spec").textContent);
    // Scale the screenshot to fill the space left on the slide (never past 1.2x).
    const pre = wrap.getBoundingClientRect();
    const availW = 924, availH = window.innerHeight - 110 - pre.top;
    const z = spec.zoom ?? Math.min(1.2, availW / pre.width, availH / pre.height);
    wrap.style.zoom = z;
    // Short screenshots sit a little lower so the slide doesn't feel top-heavy.
    const left = availH - pre.height * z;
    if (left > 40) wrap.parentElement.style.paddingTop = Math.min(left * 0.35, 120) + "px";
    const W = wrap.getBoundingClientRect();
    const boxOf = (k) => {
      const el = wrap.querySelector(`[data-k="${k}"]`);
      if (!el) throw new Error(`ink: no [data-k="${k}"] in screenshot`);
      const r = el.getBoundingClientRect();
      return { x: (r.left - W.left) / z, y: (r.top - W.top) / z, w: r.width / z, h: r.height / z };
    };
    const drawn = {};
    let svg = "";
    const layer = document.createElement("div");
    layer.className = "ink-layer";
    wrap.appendChild(layer);

    spec.marks.forEach((m, i) => {
      if (m.type === "note") return;
      const fn = { circle, underline, strike, check, cross, box }[m.type || "circle"];
      const out = fn(boxOf(m.target), m.pad ?? 8, m.seed ?? i + 3);
      svg += out.svg;
      drawn[m.target] = out.box;
      if (m.label) {
        const l = document.createElement("div");
        l.className = "ink-note";
        l.textContent = m.label;
        l.style.fontSize = (m.labelSize ?? 40) + "px";
        layer.appendChild(l);
        const lb = l.getBoundingClientRect(); const lw = lb.width / z, lh = lb.height / z;
        l.style.left = out.box.x + out.box.w - lw * 0.3 + (m.labelDx ?? 0) + "px";
        l.style.top = out.box.y - lh * 0.75 + (m.labelDy ?? 0) + "px";
      }
    });

    for (const m of spec.marks.filter((m) => m.type === "note")) {
      const n = document.createElement("div");
      n.className = "ink-note";
      n.innerHTML = m.text.replace(/\n/g, "<br>");
      n.style.fontSize = (m.size ?? 40) + "px";
      n.style.transform = `rotate(${m.rotate ?? -4}deg)`;
      n.style.textAlign = m.align ?? "left";
      layer.appendChild(n);
      const nr = n.getBoundingClientRect();
      const nb = { width: nr.width / z, height: nr.height / z };
      let x = m.x ?? 0, y = m.y ?? 0;
      if (m.near) {
        const b = drawn[m.near] || boxOf(m.near);
        const side = m.side || "right";
        if (side === "right") { x = b.x + b.w + 14; y = b.y + b.h / 2 - nb.height / 2; }
        if (side === "left") { x = b.x - nb.width - 14; y = b.y + b.h / 2 - nb.height / 2; }
        if (side === "above") { x = b.x + b.w / 2 - nb.width / 2; y = b.y - nb.height - 10; }
        if (side === "below") { x = b.x + b.w / 2 - nb.width / 2; y = b.y + b.h + 10; }
        x += m.dx ?? 0; y += m.dy ?? 0;
      }
      n.style.left = x + "px";
      n.style.top = y + "px";
      if (m.arrowTo) {
        const t = drawn[m.arrowTo] || boxOf(m.arrowTo);
        const nbox = { x, y, w: nb.width, h: nb.height };
        const tc = [t.x + t.w / 2, t.y + t.h / 2];
        const start = edge(nbox, tc[0], tc[1]);
        const end = edge(t, start[0], start[1]);
        // Leave a small gap so the arrow doesn't touch the text or the mark.
        const pull = (p, q, d) => { const L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [p[0] + ((q[0] - p[0]) * d) / L, p[1] + ((q[1] - p[1]) * d) / L]; };
        svg += arrow(pull(start, end, 10), pull(end, start, 8), m.bend ?? 0.22);
      }
    }

    const s = document.createElementNS(NS, "svg");
    s.setAttribute("class", "ink-svg");
    s.setAttribute("width", W.width / z);
    s.setAttribute("height", W.height / z);
    s.innerHTML = svg;
    layer.prepend(s);
    wrap.style.transform = `rotate(${spec.rotate ?? 0}deg)`;
  }
  window.__inkDone = true;
})().catch((e) => {
  window.__inkError = String(e);
  window.__inkDone = true;
});
