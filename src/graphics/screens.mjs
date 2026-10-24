// "shot" — light-mode screenshot mock-ups that get marked up with red marker (see src/ink.js).
// Every annotatable part carries data-k="name" so carousel.json can target it:
//   { "type": "shot", "props": { "kind": "ig", ...kindProps, "rotate": -1.5,
//       "ink": [ {"type":"circle","target":"followers","label":"?"}, {"type":"note","text":"hmm","near":"followers","side":"right","arrowTo":"followers"} ] } }

import { extraKinds, extraAppKinds } from "./screens-extra.mjs";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const k = (name) => `data-k="${name}"`;

const SILHOUETTE = (fill = "#c7ced6") =>
  `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet" style="width:100%;height:100%"><circle cx="50" cy="38" r="19" fill="${fill}"/><path d="M14 100c0-21 16-35 36-35s36 14 36 35z" fill="${fill}"/></svg>`;

// A generic "stock photo": two suited figures shaking hands, flat corporate lighting, watermark.
const STOCK_PHOTO = (label = "STOCK") => `<div class="sx-stock">
  <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="sg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#dfe7ee"/><stop offset="1" stop-color="#b9c7d4"/></linearGradient></defs>
    <rect width="300" height="200" fill="url(#sg)"/>
    <rect x="0" y="120" width="300" height="80" fill="#a9b8c6" opacity=".5"/>
    <circle cx="95" cy="62" r="20" fill="#e4c3a6"/><path d="M58 200 L64 104 Q95 86 126 104 L132 200z" fill="#2f3b4c"/><path d="M88 98 L95 130 L102 98z" fill="#fff"/>
    <circle cx="205" cy="60" r="20" fill="#c99f7f"/><path d="M168 200 L174 102 Q205 84 236 102 L242 200z" fill="#3c4a5e"/><path d="M198 96 L205 128 L212 96z" fill="#fff"/>
    <path d="M124 128 Q150 118 176 128 L172 140 Q150 132 128 140z" fill="#e0bb9c"/>
  </svg>
  <div class="sx-wm">${`<span>${esc(label)}</span>`.repeat(12)}</div>
</div>`;

const BROWSER = (url, inner) => `<div class="sx-bar"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><div class="sx-url" ${k("url")}>${esc(url)}</div></div><div class="sx-page">${inner}</div>`;

// ---------------------------------------------------------------- kinds
const kinds = {
  // Instagram profile (phone app).
  ig({ username = "northside.co", initial = "N", avatarBg = "#e8833a", avatarFont = "Serif", name = "Northside Co.", category = "", bio = [], link = "", posts = "48", followers = "1,204", following = "312", tiles = [], empty = false, avatarBlank = false }) {
    const grid = empty
      ? `<div class="ig-empty" ${k("empty")}><svg viewBox="0 0 64 64" width="70" height="70"><circle cx="32" cy="32" r="29" fill="none" stroke="#262626" stroke-width="2.5"/><rect x="17" y="22" width="30" height="22" rx="4" fill="none" stroke="#262626" stroke-width="2.5"/><circle cx="32" cy="33" r="6" fill="none" stroke="#262626" stroke-width="2.5"/></svg><b>No posts yet</b></div>`
      : `<div class="ig-grid" ${k("grid")}>${tiles.map((t, i) => `<div class="ig-tile" ${k(`tile-${i}`)} style="background:${t.bg};color:${t.color || "#fff"};font-family:${t.font || "InterLocal"}">${t.text ? `<span>${esc(t.text)}</span>` : ""}</div>`).join("")}</div>`;
    return `<div class="ig-top"><span>‹</span><span ${k("username")}>${esc(username)}</span><span>···</span></div>
      <div class="ig-head"><div class="ig-av" ${k("avatar")} style="background:${avatarBlank ? "#dbe1e7" : avatarBg};font-family:${avatarFont}">${avatarBlank ? SILHOUETTE("#fff") : esc(initial)}</div>
        <div class="ig-stats" ${k("stats")}><div ${k("posts")}><b>${esc(posts)}</b><span>posts</span></div><div ${k("followers")}><b>${esc(followers)}</b><span>followers</span></div><div ${k("following")}><b>${esc(following)}</b><span>following</span></div></div></div>
      <div class="ig-bio"><b ${k("name")}>${esc(name)}</b>${category ? `<br><span class="cat" ${k("category")}>${esc(category)}</span>` : ""}${bio.map((l, i) => `<br><span ${k(`bio-${i}`)}>${esc(l)}</span>`).join("")}${link ? `<br><span class="lnk" ${k("link")}>${esc(link)}</span>` : ""}</div>
      <div class="ig-btns"><div>Follow</div><div>Message</div></div>${grid}`;
  },

  // A 2014-era small business website.
  "old-site"({ url = "northside-co.net/index.html", title = "Welcome to Our Website!!", marquee = "★ NEW: Spring Specials ★", links = ["Home", "About Us", "Services", "Contact"], counter = "Visitors: 004213", copyright = "© 2014 Northside Co. Best viewed in Internet Explorer." }) {
    return BROWSER(url, `<div class="os">
      <div class="os-title" ${k("title")}>${esc(title)}</div>
      <div class="os-marq" ${k("marquee")}>${esc(marquee)}</div>
      <div class="os-body"><div class="os-nav" ${k("links")}>${links.map((l) => `<a>${esc(l)}</a>`).join("")}</div>
        <div class="os-main"><div class="os-img" ${k("image")}>[ image not found ]</div><p>We are a full service company dedicated to quality and customer satisfaction since 1998.</p></div></div>
      <div class="os-foot"><span class="os-ctr" ${k("counter")}>${esc(counter)}</span><span ${k("copyright")}>${esc(copyright)}</span></div>
    </div>`);
  },

  // Modern homepage hero.
  hero({ url = "northside.co", brand = "Northside", nav = ["Work", "About", "Contact"], eyebrow = "", headline = "", sub = "", button = "Book a call" }) {
    return BROWSER(url, `<div class="hr">
      <div class="hr-nav"><b>${esc(brand)}</b><span>${nav.map(esc).join("&nbsp;&nbsp;&nbsp;")}</span></div>
      ${eyebrow ? `<div class="hr-eye" ${k("eyebrow")}>${esc(eyebrow)}</div>` : ""}
      <div class="hr-h"><span ${k("headline")}>${esc(headline)}</span></div>
      ${sub ? `<div class="hr-sub"><span ${k("sub")}>${esc(sub)}</span></div>` : ""}
      <div class="hr-btn" ${k("button")}>${esc(button)}</div>
    </div>`);
  },

  // "Meet the team" page.
  team({ url = "northside.co/about", heading = "Meet the team", members = [] }) {
    return BROWSER(url, `<div class="tm">
      <div class="tm-h" ${k("heading")}>${esc(heading)}</div>
      <div class="tm-grid">${members.map((m, i) => `<div class="tm-card" ${k(`member-${i}`)}>
        <div class="tm-ph ${m.kind === "empty" ? "tm-empty" : ""}">${m.kind === "empty" ? SILHOUETTE() : STOCK_PHOTO()}</div>
        <div class="tm-name">${esc(m.name)}</div><div class="tm-role">${esc(m.role || "")}</div></div>`).join("")}</div>
    </div>`);
  },

  // About section with a big stock photo.
  about({ url = "northside.co/about", heading = "About us", body = "", filename = "" }) {
    return BROWSER(url, `<div class="ab">
      <div class="ab-photo" ${k("photo")}>${STOCK_PHOTO()}${filename ? `<div class="ab-file" ${k("filename")}>${esc(filename)}</div>` : ""}</div>
      <div class="ab-txt"><div class="ab-h" ${k("heading")}>${esc(heading)}</div><p ${k("body")}>${esc(body)}</p></div>
    </div>`);
  },

  // Testimonials section.
  testimonials({ url = "northside.co", heading = "What our clients say", items = [] }) {
    return BROWSER(url, `<div class="ts">
      <div class="ts-h">${esc(heading)}</div>
      <div class="ts-grid">${items.map((t, i) => `<div class="ts-card" ${k(`t-${i}`)}>
        ${t.stars ? `<div class="ts-stars">${"★".repeat(t.stars)}</div>` : ""}
        <div class="ts-q" ${k(`quote-${i}`)}>“${esc(t.quote)}”</div>
        <div class="ts-who" ${k(`who-${i}`)}><div class="ts-av ${t.photo ? "ts-real" : ""}">${t.photo ? esc((t.name || "?")[0]) : "?"}</div><div><b>${esc(t.name)}</b>${t.role ? `<br><span>${esc(t.role)}</span>` : ""}</div></div>
        ${t.result ? `<div class="ts-res" ${k(`result-${i}`)}>${esc(t.result)}</div>` : ""}
      </div>`).join("")}</div>
    </div>`);
  },

  // LinkedIn-style profile card.
  linkedin({ name = "Mike Turner", headline = "Founder & CEO at Northside Co.", location = "Austin, Texas", followers = "212 followers", connections = "189 connections", activity = "Mike hasn't posted yet", activitySub = "Recent posts Mike shares will be displayed here." }) {
    return `<div class="li-banner"></div>
      <div class="li-body"><div class="li-av" ${k("avatar")}>${SILHOUETTE("#fff")}</div>
        <div class="li-name" ${k("name")}>${esc(name)}</div><div class="li-head" ${k("headline")}>${esc(headline)}</div>
        <div class="li-meta">${esc(location)}</div>
        <div class="li-meta"><span class="li-blue" ${k("followers")}>${esc(followers)}</span> · <span class="li-blue">${esc(connections)}</span></div>
        <div class="li-btns"><div>Connect</div><div>Message</div></div></div>
      <div class="li-act"><b>Activity</b><div class="li-none" ${k("activity")}><b>${esc(activity)}</b><br><span>${esc(activitySub)}</span></div></div>`;
  },

  // Google results page for a business name.
  google({ query = "northside co", results = [], panel = {} }) {
    return `<div class="gg-top"><span class="gg-logo"><b style="color:#4285f4">G</b><b style="color:#ea4335">o</b><b style="color:#fbbc05">o</b><b style="color:#4285f4">g</b><b style="color:#34a853">l</b><b style="color:#ea4335">e</b></span><div class="gg-q" ${k("query")}>${esc(query)}</div></div>
      <div class="gg-tabs"><span class="on">All</span><span>Images</span><span>Maps</span><span>Reviews</span></div>
      <div class="gg-body"><div class="gg-res">${results.map((r, i) => `<div class="gg-r" ${k(`result-${i}`)}><div class="gg-site">${esc(r.site)}</div><div class="gg-t">${esc(r.title)}</div><div class="gg-d">${esc(r.desc || "")}</div></div>`).join("")}</div>
        ${panel.name ? `<div class="gg-panel" ${k("panel")}><div class="gg-pimg" ${k("panel-photo")}>${panel.photo === "stock" ? STOCK_PHOTO() : `<span>No photos</span>`}</div><div class="gg-pn">${esc(panel.name)}</div>
          <div class="gg-rate" ${k("rating")}><b>${esc(panel.rating)}</b> <span class="gg-st">${"★".repeat(Math.round(+panel.rating || 0))}</span> <span class="gg-rc">(${esc(panel.reviews)})</span></div>
          <div class="gg-cat">${esc(panel.category || "")}</div>
          <div class="gg-pl" ${k("panel-website")}>Website</div><div class="gg-pl" ${k("panel-social")}>Instagram · LinkedIn</div></div>` : ""}
      </div>`;
  },

  // The same logo in three places.
  logos({ items = [] }) {
    return `<div class="lg">${items.map((it, i) => `<div class="lg-c"><div class="lg-where">${esc(it.where)}</div>
      <div class="lg-logo" ${k(`logo-${i}`)} style="background:${it.bg};color:${it.color};font-family:${it.font};font-weight:${it.weight || 700};font-style:${it.style || "normal"};letter-spacing:${it.tracking || "0"};${it.round ? "border-radius:50%;" : ""}">${esc(it.text)}</div></div>`).join("")}</div>`;
  },

  // Video player with auto-captions.
  video({ title = "", caption = "", time = "0:07 / 1:42", channel = "" }) {
    return `<div class="vd-player" ${k("player")}>
        <svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" class="vd-frame"><rect width="400" height="225" fill="#55606b"/><rect y="150" width="400" height="75" fill="#3d454e"/><circle cx="200" cy="92" r="34" fill="#c9a589"/><path d="M140 225 Q145 140 200 132 Q255 140 260 225z" fill="#25303c"/><rect x="292" y="40" width="70" height="90" fill="#6b7782"/></svg>
        <div class="vd-cap" ${k("caption")}>${esc(caption)}</div>
        <div class="vd-ctrl"><span>▶</span><div class="vd-prog"><i></i></div><span>${esc(time)}</span><svg ${k("volume")} viewBox="0 0 24 24" width="26" height="26"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff"/><path d="M16 8q3 4 0 8M18.5 5.5q5 6.5 0 13" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg></div>
      </div>
      <div class="vd-meta"><div class="vd-t" ${k("title")}>${esc(title)}</div><div class="vd-ch">${esc(channel)}</div></div>`;
  },

  // iOS Notes with a checklist.
  notes({ title = "", items = [], footer = "" }) {
    return `<div class="nt-top"><span>‹ Notes</span><span>Done</span></div>
      <div class="nt-body"><div class="nt-t" ${k("title")}>${esc(title)}</div>
        ${items.map((it, i) => `<div class="nt-i" ${k(`item-${i}`)}><span class="nt-box"></span><span>${esc(it)}</span></div>`).join("")}
        ${footer ? `<div class="nt-foot" ${k("footer")}>${esc(footer)}</div>` : ""}</div>`;
  },

  // Simple quiz landing page.
  quiz({ url = "creativeminds.co/score", headline = "What's your brand score?", sub = "", button = "Take the quiz" }) {
    return BROWSER(url, `<div class="qz">
      <div class="qz-h" ${k("headline")}>${esc(headline)}</div>
      ${sub ? `<div class="qz-sub">${esc(sub)}</div>` : ""}
      <div class="qz-q"><div class="qz-n">Question 1 of 7</div><div class="qz-qt">Does your logo look the same on every platform?</div>
        <div class="qz-opts"><div>Yes</div><div>Not sure</div><div>No</div></div></div>
      <div class="qz-btn" ${k("button")}>${esc(button)} →</div>
    </div>`);
  },
};

Object.assign(kinds, extraKinds);
const APP_KINDS = new Set(["ig", "linkedin", "notes", "video", "logos", "google", ...extraAppKinds]);

export function shot(props) {
  const { kind, rotate = 0, width = 820, height, zoom, ink = [] } = props;
  const fn = kinds[kind];
  if (!fn) throw new Error(`Unknown shot kind "${kind}". Available: ${Object.keys(kinds).join(", ")}`);
  return `<div class="shot-stage"><div class="shot-wrap" style="width:${width}px">
    <div class="shot shot-${kind} ${APP_KINDS.has(kind) ? "shot-app" : "shot-browser"}"${height ? ` style="height:${height}px"` : ""}>${fn(props)}</div>
    <script type="application/json" class="ink-spec">${JSON.stringify({ rotate, zoom, marks: ink }).replace(/</g, "\\u003c")}</script>
  </div></div>`;
}

export const screens = { shot };
