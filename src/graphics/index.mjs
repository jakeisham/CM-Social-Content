// Graphic components. Each takes a props object from carousel.json and returns HTML
// rendered inside the dark panel under the slide copy. Styles live next to each component.

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const CHECK = `<svg class="icon" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="rgba(74,222,128,.15)"/><path d="M12 20.5l5.5 5.5L28.5 14" stroke="#4ade80" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const CROSS = `<svg class="icon" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="rgba(255,92,92,.15)"/><path d="M14 14l12 12M26 14L14 26" stroke="#ff5c5c" stroke-width="4" stroke-linecap="round"/></svg>`;
const EMPTY_BOX = `<svg class="icon" viewBox="0 0 40 40"><rect x="3" y="3" width="34" height="34" rx="9" fill="none" stroke="#4b5360" stroke-width="3"/></svg>`;
const PERSON = `<svg viewBox="0 0 100 100"><circle cx="50" cy="38" r="20" fill="#fff"/><path d="M12 100c0-22 17-36 38-36s38 14 38 36z" fill="#fff"/></svg>`;

const panel = (inner, chip, style = "") =>
  `<div class="panel"><div class="panel-inner" style="${style}">${chip ? `<div class="chip"><span class="dot"></span>${esc(chip)}</div>` : ""}${inner}</div></div>`;

// ---------------------------------------------------------------------------
// scorecard — checklist of items with pass/fail + a big score. Good for hooks.
// props: { chip, items: [{label, pass}], scoreLabel }
function scorecard({ chip = "Brand Trust Audit", items = [], scoreLabel = "Trust score" }) {
  const passed = items.filter((i) => i.pass).length;
  const rows = items
    .map((i) => `<div class="sc-row ${i.pass ? "" : "fail"}">${i.pass ? CHECK : CROSS}<span>${esc(i.label)}</span></div>`)
    .join("");
  return `<style>
    .sc { display:flex; gap:28px; margin-top:24px; align-items:stretch; }
    .sc-list { flex:1; display:grid; grid-template-columns:1fr 1fr; gap:14px 22px; }
    .sc-row { display:flex; align-items:center; gap:12px; white-space:nowrap; font-size:26px; font-weight:600; }
    .sc-row.fail span { color: var(--panel-muted); text-decoration: line-through; text-decoration-color: rgba(255,92,92,.7); }
    .sc-score { width:210px; flex:none; border-left:2px solid var(--panel-line); display:flex; flex-direction:column; align-items:center; justify-content:center; }
    .sc-big { font-size:100px; font-weight:800; letter-spacing:-3px; color: var(--bad); line-height:1; text-shadow:0 0 30px rgba(255,92,92,.35); }
    .sc-big small { font-size:50px; color: var(--panel-muted); letter-spacing:0; }
  </style>` +
    panel(`<div class="sc"><div class="sc-list">${rows}</div>
      <div class="sc-score"><div class="sc-big">${passed}<small>/${items.length}</small></div>
      <div class="muted" style="font-size:24px;margin-top:12px;font-weight:600">${esc(scoreLabel)}</div>
      <div class="tag bad" style="margin-top:16px">${items.length - passed} failing</div></div></div>`, chip);
}

// ---------------------------------------------------------------------------
// brand-mismatch — the "same" brand rendered three inconsistent ways.
// props: { chip, company, variants: [{where, font, color, bg, weight, style, swatches:[...]}] }
function brandMismatch({ chip = "Same company?", company = "Northside Co.", variants = [] }) {
  const cards = variants
    .map(
      (v) => `<div class="bm-card">
        <div class="bm-where">${esc(v.where)}</div>
        <div class="bm-logo" style="background:${v.bg};color:${v.color};font-family:${v.font};font-weight:${v.weight || 700};font-style:${v.style || "normal"};letter-spacing:${v.tracking || "0"}">${esc(v.company || company)}</div>
        <div class="bm-swatches">${(v.swatches || []).map((c) => `<span style="background:${c}"></span>`).join("")}</div>
      </div>`
    )
    .join("");
  return `<style>
    .bm { display:flex; gap:20px; margin-top:26px; }
    .bm-card { flex:1; background: var(--panel-2); border-radius:18px; padding:20px; border:2px solid var(--panel-line); }
    .bm-where { font-size:22px; font-weight:700; color: var(--panel-muted); text-transform:uppercase; letter-spacing:2px; margin-bottom:14px; }
    .bm-logo { height:150px; border-radius:12px; display:flex; align-items:center; justify-content:center; text-align:center; font-size:34px; line-height:1.1; padding:10px; }
    .bm-swatches { display:flex; gap:10px; margin-top:16px; }
    .bm-swatches span { width:34px; height:34px; border-radius:50%; border:2px solid rgba(255,255,255,.15); }
    .bm-q { position:absolute; top:26px; right:30px; }
  </style>` +
    panel(`<div class="tag bad bm-q">3 different looks</div><div class="bm">${cards}</div>`, chip);
}

// ---------------------------------------------------------------------------
// browser-compare — an outdated site next to a modern one.
// props: { chip, before: {year, url, label}, after: {year, url, headline, label} }
function browserCompare({ chip = "First impression", before = {}, after = {} }) {
  const bar = (url) => `<div class="bc-bar"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><div class="bc-url">${esc(url)}</div></div>`;
  return `<style>
    .bc { display:flex; gap:22px; margin-top:26px; }
    .bc-col { flex:1; display:flex; flex-direction:column; gap:16px; }
    .bc-win { border-radius:14px; overflow:hidden; border:2px solid var(--panel-line); height:290px; display:flex; flex-direction:column; }
    .bc-bar { height:42px; background:#22262e; display:flex; align-items:center; gap:8px; padding:0 14px; flex:none; }
    .bc-bar i { width:13px; height:13px; border-radius:50%; display:block; }
    .bc-url { margin-left:10px; flex:1; background:#14171c; border-radius:7px; font-size:17px; color:#8b95a1; padding:4px 12px; }
    .bc-old { flex:1; background:#d4d0c8; font-family:"Times New Roman", "Liberation Serif", serif; color:#000; padding:14px 16px; }
    .bc-old h4 { font-size:28px; color:#000080; text-align:center; font-weight:700; }
    .bc-old .marq { background:#ffff00; font-size:17px; text-align:center; margin:8px 0; border:1px dashed #000; padding:2px; }
    .bc-old a { color:#0000ee; text-decoration:underline; font-size:19px; display:block; line-height:1.45; }
    .bc-old .ctr { font-family:"Courier New", "Liberation Mono", monospace; font-size:16px; background:#000; color:#0f0; display:inline-block; padding:2px 6px; margin-top:8px; }
    .bc-new { flex:1; background:#fff; color:#0f1419; padding:20px 22px; display:flex; flex-direction:column; }
    .bc-nav { display:flex; justify-content:space-between; align-items:center; font-size:16px; font-weight:700; }
    .bc-nav span:last-child { color:#8b95a1; font-weight:500; }
    .bc-new h4 { font-size:33px; font-weight:800; letter-spacing:-1px; line-height:1.08; margin-top:26px; }
    .bc-btn { margin-top:auto; align-self:flex-start; background:#0f1419; color:#fff; font-size:17px; font-weight:700; padding:10px 20px; border-radius:999px; }
    .bc-label { display:flex; justify-content:space-between; align-items:center; }
    .bc-year { font-size:26px; font-weight:700; color: var(--panel-muted); }
  </style>` +
    panel(`<div class="bc">
      <div class="bc-col"><div class="bc-win">${bar(before.url || "northside-co.net/index.html")}
        <div class="bc-old"><h4>Welcome to Our Website!!</h4><div class="marq">★ NEW: Spring Specials ★</div>
        <a>Home</a><a>About Us</a><a>Services</a><a>Contact</a><span class="ctr">Visitors: 004213</span></div></div>
        <div class="bc-label"><span class="bc-year">${esc(before.year || "Built 2014")}</span><span class="tag bad">${esc(before.label || "Looks closed")}</span></div></div>
      <div class="bc-col"><div class="bc-win">${bar(after.url || "northside.co")}
        <div class="bc-new"><div class="bc-nav"><span>Northside</span><span>Work · About · Contact</span></div>
        <h4>${esc(after.headline || "Built to grow your business.")}</h4><div class="bc-btn">Book a call →</div></div></div>
        <div class="bc-label"><span class="bc-year">${esc(after.year || "Refreshed 2026")}</span><span class="tag good">${esc(after.label || "Looks open")}</span></div></div>
    </div>`, chip);
}

// ---------------------------------------------------------------------------
// social-profile — an Instagram-style business profile that's gone quiet.
// props: { chip, username, posts, followers, following, lastPost }
function socialProfile({ chip = "Company Instagram", username = "northside.co", posts = "48", followers = "1,204", following = "312", lastPost = "Last post: 97 days ago" }) {
  const tiles = ["#3b4a66", "#5a4a36", "#3d5a4a", "#5a3d52", "#44495a", "#4a5560"]
    .map((c, i) => `<div class="sp-tile" style="background:${c};opacity:${0.85 - i * 0.1}"></div>`)
    .join("");
  return `<style>
    .sp { display:flex; gap:30px; margin-top:26px; align-items:center; }
    .sp-left { width:330px; flex:none; }
    .sp-head { display:flex; align-items:center; gap:18px; }
    .sp-av { width:92px; height:92px; border-radius:50%; background:#3a404a; padding:4px; border:3px solid #4b5360; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:34px; color:#8b95a1; }
    .sp-user { font-size:28px; font-weight:700; }
    .sp-stats { display:flex; gap:22px; margin-top:22px; }
    .sp-stats div { font-size:20px; color: var(--panel-muted); }
    .sp-stats b { display:block; font-size:28px; color: var(--panel-text); }
    .sp-grid { flex:1; display:grid; grid-template-columns:repeat(3,1fr); gap:6px; position:relative; }
    .sp-tile { aspect-ratio:1; border-radius:4px; }
    .sp-stamp { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
    .sp-stamp .tag { font-size:28px; padding:14px 24px; background:#2a1416; border:2px solid var(--bad); box-shadow:0 10px 30px rgba(0,0,0,.5); }
  </style>` +
    panel(`<div class="sp">
      <div class="sp-left"><div class="sp-head"><div class="sp-av">N</div><div class="sp-user">${esc(username)}</div></div>
        <div class="sp-stats"><div><b>${esc(posts)}</b>posts</div><div><b>${esc(followers)}</b>followers</div><div><b>${esc(following)}</b>following</div></div>
        <div class="tag warn" style="margin-top:24px">Link in bio: 404</div></div>
      <div class="sp-grid">${tiles}<div class="sp-stamp"><span class="tag bad">⏸ ${esc(lastPost)}</span></div></div>
    </div>`, chip);
}

// ---------------------------------------------------------------------------
// founder-profile — a founder account gone dark, with a trust meter.
// props: { chip, title, lastActive, trust (0-100) }
function founderProfile({ chip = "Founder profile", title = "Founder & CEO at Northside Co.", lastActive = "Last post: 11 months ago", trust = 18 }) {
  return `<style>
    .fp { display:flex; gap:26px; margin-top:26px; }
    .fp-card { flex:1.25; background: var(--panel-2); border:2px solid var(--panel-line); border-radius:18px; overflow:hidden; }
    .fp-banner { height:80px; background:#232830; }
    .fp-body { padding:0 24px 22px; }
    .fp-av { width:110px; height:110px; border-radius:50%; background:#3a404a; border:5px solid var(--panel-2); margin-top:-55px; overflow:hidden; display:flex; align-items:flex-end; justify-content:center; }
    .fp-av svg { width:80%; height:80%; opacity:.5; }
    .fp-line { height:22px; border-radius:6px; background:#2a3039; margin-top:14px; }
    .fp-title { font-size:22px; color: var(--panel-muted); margin-top:12px; }
    .fp-act { display:flex; flex-direction:column; gap:10px; margin-top:16px; font-size:21px; color: var(--panel-muted); }
    .fp-act div { display:flex; align-items:center; gap:10px; }
    .fp-act div::before { content:""; width:10px; height:10px; border-radius:50%; background:#4b5360; }
    .fp-meter { flex:1; display:flex; flex-direction:column; justify-content:center; gap:18px; }
    .fp-meter h5 { font-size:26px; font-weight:700; color: var(--panel-muted); }
    .fp-bar { height:28px; background:#232830; border-radius:999px; overflow:hidden; }
    .fp-fill { height:100%; background: linear-gradient(90deg, #ff5c5c, #ff8a5c); border-radius:999px; box-shadow:0 0 18px rgba(255,92,92,.5); }
    .fp-pct { font-size:80px; font-weight:800; color: var(--bad); letter-spacing:-2px; line-height:1; }
  </style>` +
    panel(`<div class="fp">
      <div class="fp-card"><div class="fp-banner"></div><div class="fp-body">
        <div class="fp-av">${PERSON}</div>
        <div class="fp-line" style="width:55%"></div>
        <div class="fp-title">${esc(title)}</div>
        <div class="fp-act"><div>${esc(lastActive)}</div><div>No profile photo · 0 recent activity</div></div>
      </div></div>
      <div class="fp-meter"><h5>Buyer trust</h5><div class="fp-pct">${trust}%</div>
        <div class="fp-bar"><div class="fp-fill" style="width:${trust}%"></div></div>
        <div class="tag bad" style="align-self:flex-start">“Is anyone even there?”</div></div>
    </div>`, chip);
}

// ---------------------------------------------------------------------------
// stock-vs-real — a watermarked stock photo next to a real team photo.
// props: { chip, stockFile, stockEmoji, realEmoji, realCaption }
function stockVsReal({ chip = "Your website photos", stockFile = "handshake_business_47.jpg", stockEmoji = "🤝", realEmoji = "👩‍🔧👨‍🔧", realCaption = "Your team. Your space." }) {
  return `<style>
    .svr { display:flex; gap:22px; margin-top:26px; }
    .svr-col { flex:1; display:flex; flex-direction:column; gap:16px; }
    .svr-img { height:290px; border-radius:16px; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; }
    .svr-stock { background: linear-gradient(135deg, #c9d3dc, #9fb0bf); }
    .svr-stock .em { font-size:130px; filter: saturate(.35); }
    .svr-wm { position:absolute; inset:-40px; display:flex; flex-wrap:wrap; gap:26px 40px; transform:rotate(-24deg); align-content:center; justify-content:center; }
    .svr-wm span { font-size:30px; font-weight:800; color:rgba(255,255,255,.55); letter-spacing:3px; }
    .svr-file { position:absolute; bottom:12px; left:12px; font-size:17px; background:rgba(0,0,0,.55); color:#fff; padding:5px 10px; border-radius:6px; font-family:"JetBrains Mono", monospace; }
    .svr-real { background: radial-gradient(circle at 30% 30%, #f6c38b, #c97b4a 60%, #7a4429); }
    .svr-real .em { font-size:110px; }
    .svr-cap { position:absolute; bottom:12px; left:12px; font-size:19px; font-weight:700; background:rgba(0,0,0,.45); color:#fff; padding:6px 12px; border-radius:8px; }
    .svr-lbl { display:flex; justify-content:flex-end; }
  </style>` +
    panel(`<div class="svr">
      <div class="svr-col"><div class="svr-img svr-stock"><div class="svr-wm">${"<span>STOCK</span>".repeat(18)}</div><div class="em">${stockEmoji}</div><div class="svr-file">${esc(stockFile)}</div></div>
        <div class="svr-lbl"><span class="tag bad">Generic. Fake. Forgettable.</span></div></div>
      <div class="svr-col"><div class="svr-img svr-real"><div class="em">${realEmoji}</div><div class="svr-cap">📍 ${esc(realCaption)}</div></div>
        <div class="svr-lbl"><span class="tag good">Real. Local. Trusted.</span></div></div>
    </div>`, chip);
}

// ---------------------------------------------------------------------------
// message-bubbles — a question, a jargon answer, and a clear answer.
// props: { chip, question, bad, good, badReaction, goodReaction }
function messageBubbles({ chip = "The one-sentence test", question = "So… what does your company do?", bad = "We leverage end-to-end synergistic solutions to empower scalable growth across verticals.", good = "We help local businesses get more customers online.", badReaction = "Huh?", goodReaction = "Got it. How much?" }) {
  return `<style>
    .mb { display:flex; flex-direction:column; gap:16px; margin-top:26px; }
    .mb-b { max-width:80%; font-size:27px; line-height:1.35; padding:18px 24px; border-radius:26px; }
    .mb-q { align-self:flex-start; background:#2a2f38; border-bottom-left-radius:8px; }
    .mb-row { display:flex; align-items:center; gap:16px; justify-content:flex-end; }
    .mb-a { border-bottom-right-radius:8px; }
    .mb-bad { background:#2a1416; border:2px solid rgba(255,92,92,.6); color:#f3c7c7; }
    .mb-good { background:#12301f; border:2px solid rgba(74,222,128,.6); color:#d6f5e1; }
  </style>` +
    panel(`<div class="mb">
      <div class="mb-b mb-q">${esc(question)}</div>
      <div class="mb-row"><span class="tag bad">${CROSS.replace('class="icon"', 'class="icon" style="width:30px;height:30px"')}${esc(badReaction)}</span><div class="mb-b mb-a mb-bad">${esc(bad)}</div></div>
      <div class="mb-row"><span class="tag good">${CHECK.replace('class="icon"', 'class="icon" style="width:30px;height:30px"')}${esc(goodReaction)}</span><div class="mb-b mb-a mb-good">${esc(good)}</div></div>
    </div>`, chip);
}

// ---------------------------------------------------------------------------
// testimonial — a review card plus a case-study stat.
// props: { chip, quote, author, role, stat, statLabel }
function testimonial({ chip = "Social proof", quote = "", author = "", role = "", stat = "+212%", statLabel = "inbound leads in 90 days" }) {
  return `<style>
    .tm { display:flex; gap:22px; margin-top:26px; }
    .tm-card { flex:1.6; background: var(--panel-2); border:2px solid var(--panel-line); border-radius:18px; padding:26px 28px; }
    .tm-stars { color: var(--warn); font-size:34px; letter-spacing:4px; }
    .tm-q { font-size:28px; line-height:1.38; margin-top:12px; font-weight:500; }
    .tm-who { display:flex; align-items:center; gap:14px; margin-top:20px; }
    .tm-av { width:52px; height:52px; border-radius:50%; background:#3a404a; display:flex; align-items:flex-end; justify-content:center; overflow:hidden; }
    .tm-av svg { width:80%; height:80%; opacity:.6; }
    .tm-name { font-size:22px; font-weight:700; }
    .tm-role { font-size:19px; color: var(--panel-muted); }
    .tm-stat { flex:1; background:#12301f; border:2px solid rgba(74,222,128,.45); border-radius:18px; padding:26px; display:flex; flex-direction:column; justify-content:center; }
    .tm-stat .k { font-size:20px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color: var(--good); }
    .tm-stat .v { font-size:78px; font-weight:800; color: var(--good); letter-spacing:-2px; line-height:1.05; margin-top:10px; text-shadow:0 0 26px rgba(74,222,128,.35); }
    .tm-stat .l { font-size:22px; color:#bfe8cf; margin-top:6px; line-height:1.3; }
  </style>` +
    panel(`<div class="tm">
      <div class="tm-card"><div class="tm-stars">★★★★★</div><div class="tm-q">“${esc(quote)}”</div>
        <div class="tm-who"><div class="tm-av">${PERSON}</div><div><div class="tm-name">${esc(author)}</div><div class="tm-role">${esc(role)}</div></div></div></div>
      <div class="tm-stat"><div class="k">Case study</div><div class="v">${esc(stat)}</div><div class="l">${esc(statLabel)}</div></div>
    </div>`, chip);
}

// ---------------------------------------------------------------------------
// checklist — empty checkboxes for the reader to score themselves. Good for CTAs.
// props: { chip, items: [string], footer }
function checklist({ chip = "Your audit", items = [], footer = "Your score: ___ / 7" }) {
  const rows = items.map((i) => `<div class="cl-row">${EMPTY_BOX}<span>${esc(i)}</span></div>`).join("");
  return `<style>
    .cl { display:grid; grid-template-columns:1fr 1fr; gap:16px 26px; margin-top:26px; }
    .cl-row { display:flex; align-items:center; gap:14px; font-size:27px; font-weight:600; }
    .cl-foot { margin-top:26px; padding-top:22px; border-top:2px solid var(--panel-line); display:flex; justify-content:space-between; align-items:center; font-size:30px; font-weight:800; }
  </style>` +
    panel(`<div class="cl">${rows}</div><div class="cl-foot"><span>${esc(footer)}</span><span class="tag good">Save this ↗</span></div>`, chip);
}

export const graphics = {
  scorecard,
  "brand-mismatch": brandMismatch,
  "browser-compare": browserCompare,
  "social-profile": socialProfile,
  "founder-profile": founderProfile,
  "stock-vs-real": stockVsReal,
  "message-bubbles": messageBubbles,
  testimonial,
  checklist,
};
