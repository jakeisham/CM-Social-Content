// More screenshot kinds for the "shot" component: phone camera viewfinder, inbox,
// metrics dashboard, iMessage chat, booking page. Same rules as screens.mjs:
// every annotatable part carries data-k="name".

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const k = (name) => `data-k="${name}"`;

// ---------------------------------------------------------------------------
// camera — iPhone camera in video mode, filming a talking head.
// props: { lighting: "overhead"|"side"|"soft", background: "wall"|"deep", framing: "center"|"thirds",
//          grid, aeLock, exposurePulse, meter: "clipping"|"good"|null, reels, reelsCaption, recording, time }
function camera({
  lighting = "soft", background = "deep", framing = "thirds", grid = false, aeLock = false,
  exposurePulse = false, meter = null, reels = false, reelsCaption = "", recording = true, time = "00:00:12",
  reelsUser = "northside.co",
}) {
  const W = 400, H = 711;
  const cx = framing === "center" ? 200 : 150;
  const headY = framing === "center" ? 352 : 252; // eye line sits ~10px above head centre
  const deep = background === "deep";

  const face = {
    overhead: `<linearGradient id="face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7e2cf"/><stop offset=".45" stop-color="#d9ad8c"/><stop offset="1" stop-color="#9c7056"/></linearGradient>`,
    side: `<linearGradient id="face" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f6d9bf"/><stop offset=".55" stop-color="#c99674"/><stop offset="1" stop-color="#5e3f2e"/></linearGradient>`,
    soft: `<linearGradient id="face" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#efcfb3"/><stop offset="1" stop-color="#b98a6a"/></linearGradient>`,
  }[lighting];

  const bg = deep
    ? `<rect width="${W}" height="${H}" fill="url(#room)"/>
       <g filter="url(#bokeh)" opacity=".85" ${k("bokeh")}><circle cx="300" cy="170" r="26" fill="#ffcf8a"/><circle cx="350" cy="250" r="16" fill="#ffb86b"/><circle cx="60" cy="140" r="20" fill="#9fc2ff" opacity=".6"/><circle cx="330" cy="420" r="22" fill="#ffd9a0" opacity=".7"/><rect x="250" y="300" width="90" height="200" fill="#3a3129"/></g>`
    : `<rect width="${W}" height="${H}" fill="${lighting === "overhead" ? "#d9d4cb" : "#cfc8bd"}"/>
       <rect x="270" y="150" width="90" height="120" fill="#bfb7aa" stroke="#a9a094" stroke-width="4"/>
       ${lighting === "overhead" ? `<ellipse cx="${cx + 18}" cy="${headY + 260}" rx="140" ry="300" fill="#000" opacity=".12"/>` : ""}`;

  const ceiling = lighting === "overhead"
    ? `<g><rect x="0" y="64" width="${W}" height="70" fill="#e9e6e0"/><rect x="40" y="96" width="330" height="90" fill="url(#glare)"/><g ${k("light")}><rect x="60" y="82" width="120" height="18" rx="4" fill="#fff"/><rect x="230" y="82" width="120" height="18" rx="4" fill="#fff"/></g></g>`
    : "";
  const windowLight = lighting === "side"
    ? `<g ${k("window")}><rect x="-10" y="60" width="70" height="420" fill="#fffaf0" opacity=".9"/><rect x="-10" y="60" width="200" height="420" fill="url(#spill)"/></g>`
    : "";

  const sockets = lighting === "overhead"
    ? `<ellipse cx="${cx - 22}" cy="${headY - 6}" rx="17" ry="10" fill="#6b4a37" opacity=".55"/><ellipse cx="${cx + 22}" cy="${headY - 6}" rx="17" ry="10" fill="#6b4a37" opacity=".55"/><ellipse cx="${cx}" cy="${headY - 62}" rx="30" ry="12" fill="#fff" opacity=".5"/>`
    : "";
  const eyes = `<g ${k("eyes")}><ellipse cx="${cx - 22}" cy="${headY - 8}" rx="7" ry="4.5" fill="#2a1d16"/><ellipse cx="${cx + 22}" cy="${headY - 8}" rx="7" ry="4.5" fill="#2a1d16"/></g>`;

  const person = `<g ${k("face")}>
      <path d="${`M${cx - 150} ${H} Q${cx - 140} ${headY + 120} ${cx} ${headY + 108} Q${cx + 140} ${headY + 120} ${cx + 150} ${H}z`}" fill="#2e3440"/>
      <rect x="${cx - 26}" y="${headY + 56}" width="52" height="60" fill="url(#face)"/>
      <ellipse cx="${cx - 61}" cy="${headY + 4}" rx="10" ry="18" fill="url(#face)"/><ellipse cx="${cx + 61}" cy="${headY + 4}" rx="10" ry="18" fill="url(#face)"/>
      <ellipse cx="${cx}" cy="${headY}" rx="62" ry="78" fill="url(#face)"/>
      <path d="M${cx - 64} ${headY - 18} Q${cx - 66} ${headY - 96} ${cx} ${headY - 92} Q${cx + 68} ${headY - 96} ${cx + 64} ${headY - 18} Q${cx + 40} ${headY - 66} ${cx} ${headY - 62} Q${cx - 40} ${headY - 66} ${cx - 64} ${headY - 18}z" fill="#2a2019"/>
      ${sockets}${eyes}
      <path d="M${cx + 2} ${headY + 2} Q${cx + 9} ${headY + 18} ${cx + 1} ${headY + 22}" stroke="#8a5d45" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M${cx - 15} ${headY + 40} L${cx + 15} ${headY + 40}" stroke="#7a4f3a" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M${cx - 40} ${headY + 70} Q${cx} ${headY + 96} ${cx + 40} ${headY + 70}" fill="#2a2019" opacity=".25"/>
    </g>`;

  const gridLines = grid
    ? `<g ${k("grid")} stroke="#fff" stroke-opacity=".55" stroke-width="1.5"><line x1="${W / 3}" y1="0" x2="${W / 3}" y2="${H}"/><line x1="${(2 * W) / 3}" y1="0" x2="${(2 * W) / 3}" y2="${H}"/><line x1="0" y1="${H / 3}" x2="${W}" y2="${H / 3}"/><line x1="0" y1="${(2 * H) / 3}" x2="${W}" y2="${H * 2 / 3}"/></g>`
    : "";

  const scene = `<svg class="cam-scene" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
    <defs>${face}
      <linearGradient id="room" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2622"/><stop offset="1" stop-color="#4b3f34"/></linearGradient>
      <linearGradient id="glare" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="spill" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6e0" stop-opacity=".6"/><stop offset="1" stop-color="#fff6e0" stop-opacity="0"/></linearGradient>
      <filter id="bokeh"><feGaussianBlur stdDeviation="9"/></filter>
    </defs>
    <g ${k("background")}>${bg}</g>${windowLight}${ceiling}${person}${gridLines}
  </svg>`;

  const meterHtml = meter
    ? `<div class="cam-meter" ${k("meter")}>${Array.from({ length: 12 }, (_, i) => `<i class="${meter === "clipping" ? (i < 3 ? "r" : i < 5 ? "y" : "g") : i < 5 ? "off" : "g"}"></i>`).join("")}<span>${meter === "clipping" ? "CLIP" : "-12 dB"}</span></div>`
    : "";

  const reelsHtml = reels
    ? `<div class="cam-reels" ${k("reels-ui")}>
        ${["♥ 1,204", "❍ 88", "➤", "···"].map((t, i) => `<div class="cam-ri" ${i === 0 ? k("like") : ""}><b>${t.split(" ")[0]}</b><span>${t.split(" ")[1] || ""}</span></div>`).join("")}
      </div>
      <div class="cam-reels-bottom" ${k("reels-bottom")}><b>${esc(reelsUser)}</b> · Follow<br><span>♫ Original audio</span></div>
      <div class="cam-safe" ${k("safe")}></div>
      ${reelsCaption ? `<div class="cam-rcap" ${k("reels-caption")}>${esc(reelsCaption)}</div>` : ""}`
    : "";

  return `<div class="cam-screen" ${k("screen")}>${scene}
      <div class="cam-top"><span>⚡</span><span class="cam-rec ${recording ? "on" : ""}" ${k("timer")}>${recording ? "● " : ""}${esc(time)}</span><span>HD · 30</span></div>
      ${aeLock ? `<div class="cam-ae" ${k("aelock")}>AE/AF LOCK</div>` : ""}
      ${exposurePulse ? `<div class="cam-exp" ${k("exposure")}><i></i><span>☀</span></div>` : ""}
      ${meterHtml}${reelsHtml}
      ${reels ? "" : `<div class="cam-bottom"><div class="cam-modes"><span>CINEMATIC</span><span class="on">VIDEO</span><span>PHOTO</span></div><div class="cam-shutter ${recording ? "rec" : ""}"></div></div>`}
    </div>`;
}

// ---------------------------------------------------------------------------
// inbox — a mail client list.
// props: { title, count, rows: [{from, subject, preview, time, unread, tag}] }
function inbox({ title = "Inbox", count = "", rows = [] }) {
  return `<div class="ib-top"><b>${esc(title)}</b>${count ? `<span class="ib-count" ${k("count")}>${esc(count)}</span>` : ""}<div class="ib-search">Search mail</div></div>
    ${rows.map((r, i) => `<div class="ib-row ${r.unread ? "un" : ""}" ${k(`row-${i}`)}>
      <span class="ib-dot"></span><div class="ib-from" ${k(`from-${i}`)}>${esc(r.from)}</div>
      <div class="ib-msg"><span class="ib-subj" ${k(`subject-${i}`)}>${esc(r.subject)}</span>${r.tag ? `<span class="ib-tag">${esc(r.tag)}</span>` : ""}<span class="ib-prev"> — ${esc(r.preview || "")}</span></div>
      <div class="ib-time">${esc(r.time || "")}</div></div>`).join("")}`;
}

// ---------------------------------------------------------------------------
// dashboard — two or three metric cards over a small bar chart.
// props: { title, range, metrics: [{label, value, delta, trend: "up"|"down"|"flat"}], bars: [numbers], barsLabel }
function dashboard({ title = "Marketing overview", range = "Last 30 days", metrics = [], bars = [], barsLabel = "" }) {
  const max = Math.max(1, ...bars);
  return `<div class="db-top"><b>${esc(title)}</b><span>${esc(range)} ▾</span></div>
    <div class="db-cards">${metrics.map((m, i) => `<div class="db-card" ${k(`metric-${i}`)}><div class="db-l">${esc(m.label)}</div>
      <div class="db-v" ${k(`value-${i}`)}>${esc(m.value)}</div><div class="db-d ${m.trend || "flat"}">${esc(m.delta || "")}</div></div>`).join("")}</div>
    ${bars.length ? `<div class="db-chart" ${k("chart")}><div class="db-cl">${esc(barsLabel)}</div><div class="db-bars">${bars.map((b) => `<i style="height:${Math.round((b / max) * 100)}%"></i>`).join("")}</div></div>` : ""}`;
}

// ---------------------------------------------------------------------------
// chat — iMessage thread.
// props: { contact, sub, messages: [{from: "them"|"me", text}] }
function chat({ contact = "", sub = "", messages = [] }) {
  return `<div class="ch-top"><span class="ch-back">‹</span><div class="ch-who"><div class="ch-av">${esc((contact || "?")[0])}</div><b>${esc(contact)}</b>${sub ? `<span>${esc(sub)}</span>` : ""}</div></div>
    <div class="ch-body">${messages.map((m, i) => `<div class="ch-row ${m.from === "me" ? "me" : "them"}"><div class="ch-b" ${k(`msg-${i}`)}>${esc(m.text)}</div></div>`).join("")}</div>`;
}

// ---------------------------------------------------------------------------
// booking — a scheduling page.
// props: { host, title, duration, desc, day, slots: [string], selected }
function booking({ host = "Creative Minds", title = "Brand Audit", duration = "30 min", desc = "", day = "", slots = [], selected = -1 }) {
  return `<div class="bk">
    <div class="bk-left"><div class="bk-host">${esc(host)}</div><div class="bk-t" ${k("title")}>${esc(title)}</div><div class="bk-dur">◷ ${esc(duration)}</div>${desc ? `<p>${esc(desc)}</p>` : ""}</div>
    <div class="bk-right"><div class="bk-day">${esc(day)}</div>${slots.map((s, i) => `<div class="bk-slot ${i === selected ? "on" : ""}" ${k(`slot-${i}`)}>${esc(s)}</div>`).join("")}</div>
  </div>`;
}

export const extraKinds = { camera, inbox, dashboard, chat, booking };
export const extraAppKinds = ["camera", "inbox", "dashboard", "chat", "booking"];
