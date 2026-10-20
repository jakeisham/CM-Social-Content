// Tactile graphics: things that look made by a person, not generated — marked-up
// screenshots, redacted paper files, thermal receipts. No glows, no pills, no emoji.

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const RED = "#d92b1f";

// Paper grain as an inline SVG noise texture.
const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .09 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
)}")`;

// Seeded jitter so every render is identical.
function rng(seed) {
  let x = seed * 9301 + 49297;
  return () => ((x = (x * 9301 + 49297) % 233280) / 233280);
}

// A hand-drawn marker loop: slightly more than one lap, wobbling radius, open ends.
function scribble(cx, cy, rx, ry, seed = 1, width = 5) {
  const r = rng(seed);
  const start = r() * Math.PI * 2;
  const laps = 1.12 + r() * 0.08;
  const pts = [];
  const steps = 70;
  const p1 = r() * 6, p2 = r() * 6;
  for (let i = 0; i <= steps; i++) {
    const t = start + (i / steps) * laps * Math.PI * 2;
    const drift = 1 + 0.05 * Math.sin(2 * t + p1) + 0.03 * Math.sin(5 * t + p2) + (i / steps) * 0.06;
    pts.push(`${(cx + Math.cos(t) * rx * drift).toFixed(1)},${(cy + Math.sin(t) * ry * drift).toFixed(1)}`);
  }
  return `<path d="M${pts.join(" L")}" fill="none" stroke="${RED}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity=".92"/>`;
}

// A curved hand-drawn arrow ending at (x2, y2).
function arrow(x1, y1, x2, y2, bend = 0.25, width = 5) {
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const a = Math.atan2(y2 - my, x2 - mx);
  const h = 22;
  const l = `${(x2 - h * Math.cos(a - 0.45)).toFixed(1)},${(y2 - h * Math.sin(a - 0.45)).toFixed(1)}`;
  const rr = `${(x2 - h * Math.cos(a + 0.45)).toFixed(1)},${(y2 - h * Math.sin(a + 0.45)).toFixed(1)}`;
  return `<path d="M${x1},${y1} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2},${y2} M${l} L${x2},${y2} L${rr}" fill="none" stroke="${RED}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity=".92"/>`;
}

// ---------------------------------------------------------------------------
// markup-profile — a light-mode Instagram profile "screenshot" with marker annotations.
// props: { username, initial, name, category, bio:[lines], link, posts, followers, following,
//          tiles:[{bg, color, text, font}], empty, marks:[{x,y,rx,ry,n}], arrows:[{x1,y1,x2,y2,bend}],
//          notes:[{text, x, y, rotate, size}], rotate, height }
function markupProfile(p) {
  const {
    username = "northside.co", initial = "N", name = "Northside Co.", category = "", bio = [], link = "",
    posts = "48", followers = "1,204", following = "312", tiles = [], empty = false,
    marks = [], arrows = [], notes = [], rotate = -1.5, height = 560,
  } = p;
  const tileHtml = tiles
    .map((t) => `<div class="mp-tile" style="background:${t.bg};color:${t.color || "#fff"};font-family:${t.font || "InterLocal"}">${t.text ? `<span>${esc(t.text)}</span>` : ""}</div>`)
    .join("");
  const grid = empty
    ? `<div class="mp-empty"><svg viewBox="0 0 64 64" width="74" height="74"><circle cx="32" cy="32" r="29" fill="none" stroke="#262626" stroke-width="2.5"/><rect x="17" y="22" width="30" height="22" rx="4" fill="none" stroke="#262626" stroke-width="2.5"/><circle cx="32" cy="33" r="6" fill="none" stroke="#262626" stroke-width="2.5"/><path d="M26 22l2-4h8l2 4" fill="none" stroke="#262626" stroke-width="2.5"/></svg><b>No posts yet</b></div>`
    : `<div class="mp-grid">${tileHtml}</div>`;
  const svg = `<svg class="mp-ink" viewBox="0 0 760 ${height}" width="760" height="${height}">${marks.map((m, i) => scribble(m.x, m.y, m.rx, m.ry, i + 3)).join("")}${arrows.map((a) => arrow(a.x1, a.y1, a.x2, a.y2, a.bend ?? 0.25)).join("")}</svg>`;
  const nums = marks.filter((m) => m.n).map((m) => `<div class="mp-num" style="left:${m.nx ?? m.x + m.rx - 4}px;top:${m.ny ?? m.y - m.ry - 34}px">${esc(m.n)}</div>`).join("");
  const noteHtml = notes.map((n) => `<div class="mp-note" style="left:${n.x}px;top:${n.y}px;transform:rotate(${n.rotate ?? -4}deg);font-size:${n.size ?? 40}px">${esc(n.text)}</div>`).join("");
  return `<style>
    .mp-wrap { position:relative; height:${height + 40}px; display:flex; justify-content:center; padding-top:10px; }
    .mp-shot { position:relative; width:760px; height:${height}px; background:#fff; border-radius:18px; overflow:hidden; transform:rotate(${rotate}deg);
      box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 12px 40px rgba(0,0,0,.14); border:1px solid #e6e6e6; font-family:"InterLocal"; color:#000; }
    .mp-top { height:64px; display:flex; align-items:center; justify-content:space-between; padding:0 26px; font-size:26px; font-weight:700; border-bottom:1px solid #efefef; }
    .mp-top span:first-child, .mp-top span:last-child { font-weight:400; font-size:30px; color:#262626; }
    .mp-head { display:flex; align-items:center; gap:40px; padding:22px 30px 10px; }
    .mp-av { width:124px; height:124px; border-radius:50%; flex:none; background:#e8833a; color:#fff; font-family:"Serif"; font-style:italic; font-size:72px; display:flex; align-items:center; justify-content:center; outline:3px solid #fff; box-shadow:0 0 0 5px #dbdbdb; }
    .mp-stats { flex:1; display:flex; justify-content:space-around; text-align:center; }
    .mp-stats b { display:block; font-size:30px; font-weight:700; }
    .mp-stats span { font-size:21px; color:#262626; }
    .mp-bio { padding:4px 30px 0; font-size:21px; line-height:1.4; }
    .mp-bio b { font-size:22px; }
    .mp-bio .cat { color:#737373; }
    .mp-bio .lnk { color:#00376b; font-weight:600; }
    .mp-btns { display:flex; gap:10px; padding:16px 30px; }
    .mp-btns div { flex:1; height:50px; border-radius:10px; background:#efefef; font-size:20px; font-weight:600; display:flex; align-items:center; justify-content:center; }
    .mp-btns div:first-child { background:#0095f6; color:#fff; }
    .mp-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:3px; border-top:1px solid #efefef; padding-top:3px; }
    .mp-tile { aspect-ratio:1; display:flex; align-items:center; justify-content:center; text-align:center; padding:14px; font-weight:800; font-size:24px; line-height:1.1; }
    .mp-empty { border-top:1px solid #efefef; height:260px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; }
    .mp-empty b { font-size:30px; font-weight:800; }
    .mp-ink { position:absolute; inset:0; pointer-events:none; mix-blend-mode:multiply; }
    .mp-num { position:absolute; font-family:"Marker"; color:${RED}; font-size:38px; line-height:1; }
    .mp-note { position:absolute; font-family:"Marker"; color:${RED}; line-height:1.05; white-space:nowrap; z-index:2; }
  </style>
  <div class="mp-wrap"><div class="mp-shot">
    <div class="mp-top"><span>‹</span><span>${esc(username)}</span><span>···</span></div>
    <div class="mp-head"><div class="mp-av">${esc(initial)}</div>
      <div class="mp-stats"><div><b>${esc(posts)}</b><span>posts</span></div><div><b>${esc(followers)}</b><span>followers</span></div><div><b>${esc(following)}</b><span>following</span></div></div></div>
    <div class="mp-bio"><b>${esc(name)}</b>${category ? `<br><span class="cat">${esc(category)}</span>` : ""}${bio.map((l) => `<br>${esc(l)}`).join("")}${link ? `<br><span class="lnk">${esc(link)}</span>` : ""}</div>
    <div class="mp-btns"><div>Follow</div><div>Message</div></div>
    ${grid}
    ${svg}${nums}
  </div>${noteHtml}</div>`;
}

// ---------------------------------------------------------------------------
// case-file — a typed audit document with redacted findings. Reveal lines one per slide.
// props: { fileNo, subject, time, findings:[string], reveal:[index], highlight:index, stamp, rotate }
function caseFile({ fileNo = "0427", subject = "", time = "00:10", findings = [], reveal = [], highlight = -1, stamp = "", rotate = 1 }) {
  const rows = findings
    .map((f, i) => {
      const shown = reveal.includes(i) || i === highlight;
      const cls = i === highlight ? "cf-hl" : shown ? "cf-done" : "cf-red";
      return `<div class="cf-row"><span class="cf-n">${String(i + 1).padStart(2, "0")}.</span><span class="${cls}" style="--w:${0.9 + ((i * 37) % 10) / 100}">${esc(f)}</span></div>`;
    })
    .join("");
  return `<style>
    .cf-wrap { display:flex; justify-content:center; padding:6px 0 18px; }
    .cf { position:relative; width:860px; background:#f4f0e6; background-image:${GRAIN}; color:#1d1b17; font-family:"Typewriter"; padding:36px 44px 40px; transform:rotate(${rotate}deg);
      box-shadow: 0 1px 1px rgba(0,0,0,.12), 0 14px 34px rgba(60,40,10,.18); }
    .cf::before { content:""; position:absolute; top:-14px; left:70px; width:150px; height:34px; background:rgba(255,245,200,.75); transform:rotate(-4deg); box-shadow:0 1px 2px rgba(0,0,0,.1); }
    .cf-head { display:flex; justify-content:space-between; font-size:24px; letter-spacing:1px; border-bottom:2px solid #1d1b17; padding-bottom:12px; }
    .cf-meta { font-size:24px; margin:16px 0 18px; line-height:1.55; }
    .cf-row { display:flex; gap:16px; font-size:29px; line-height:1.25; margin-top:13px; align-items:baseline; }
    .cf-n { flex:none; color:#6b655a; }
    .cf-red { background:#141310; color:transparent; border-radius:2px; transform:scaleX(var(--w)) rotate(-.3deg); transform-origin:left; box-shadow:1px 1px 0 #141310; user-select:none; }
    .cf-done { color:#8a8478; text-decoration:line-through; text-decoration-color:${RED}; text-decoration-thickness:3px; }
    .cf-hl { background: linear-gradient(100deg, rgba(255,230,0,0) 0 1%, rgba(255,226,40,.85) 3% 96%, rgba(255,230,0,0) 99%); padding:0 6px; margin:0 -6px; }
    .cf-stamp { position:absolute; right:38px; top:118px; font-family:"InterLocal"; font-weight:800; font-size:38px; letter-spacing:3px; color:${RED}; border:5px solid ${RED}; padding:6px 18px; border-radius:6px;
      transform:rotate(-12deg); opacity:.88; mix-blend-mode:multiply; }
  </style>
  <div class="cf-wrap"><div class="cf">
    <div class="cf-head"><span>BRAND AUDIT</span><span>FILE NO. ${esc(fileNo)}</span></div>
    <div class="cf-meta">SUBJECT: ${subject ? esc(subject) : `<span class="cf-red" style="--w:1">Your business here</span>`}<br>TIME TO VERDICT: ${esc(time)}<br>FINDINGS:</div>
    ${rows}
    ${stamp ? `<div class="cf-stamp">${esc(stamp)}</div>` : ""}
  </div></div>`;
}

// ---------------------------------------------------------------------------
// receipt — a thermal till receipt. Blur the items for a hook, highlight one for a step.
// props: { store, meta:[lines], lines:[{item, price}], blur, highlight, circle, total, totalValue, torn, rotate }
function receipt({ store = "YOUR BUSINESS", meta = [], lines = [], blur = false, highlight = -1, circle = false, total = "TOTAL", totalValue = "", torn = false, rotate = -2 }) {
  const rows = lines
    .map((l, i) => `<div class="rc-row ${blur && i !== highlight ? "rc-blur" : ""} ${i === highlight ? "rc-hl" : ""}"><span>${esc(l.item)}</span><span>${esc(l.price)}</span></div>`)
    .join("");
  return `<style>
    .rc-wrap { display:flex; justify-content:center; padding:4px 0 10px; position:relative; }
    .rc { position:relative; width:600px; background:#fbfaf6; background-image:${GRAIN}; color:#2a2a2a; font-family:"JetBrains Mono", monospace; font-size:24px; padding:34px 38px ${torn ? 60 : 34}px; transform:rotate(${rotate}deg);
      box-shadow:0 12px 30px rgba(0,0,0,.14); ${torn ? "clip-path: polygon(0 0,100% 0,100% 94%,95% 97%,90% 93.5%,84% 98%,77% 94%,70% 97.5%,63% 93%,56% 98%,49% 94.5%,42% 97%,35% 93%,28% 98%,21% 94%,14% 97.5%,7% 93.5%,0 97%);" : ""} }
    .rc h4 { text-align:center; font-size:30px; font-weight:800; letter-spacing:4px; }
    .rc-meta { text-align:center; font-size:20px; color:#555; margin-top:8px; line-height:1.5; }
    .rc-hr { border-top:3px dashed #999; margin:18px 0; }
    .rc-row { display:flex; justify-content:space-between; gap:20px; line-height:1.7; text-transform:uppercase; }
    .rc-blur { filter: blur(6px); opacity:.8; }
    .rc-hl { background:rgba(255,226,40,.8); margin:0 -10px; padding:0 10px; }
    .rc-total { display:flex; justify-content:space-between; font-size:30px; font-weight:800; }
    .rc-ink { position:absolute; inset:0; pointer-events:none; }
  </style>
  <div class="rc-wrap"><div class="rc">
    <h4>${esc(store)}</h4><div class="rc-meta">${meta.map(esc).join("<br>")}</div>
    <div class="rc-hr"></div>${rows}<div class="rc-hr"></div>
    <div class="rc-total"><span>${esc(total)}</span><span>${esc(totalValue)}</span></div>
  </div></div>`;
}

export const tactile = {
  "markup-profile": markupProfile,
  "case-file": caseFile,
  receipt,
};
