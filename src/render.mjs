// Renders a carousel folder (carousels/<slug>/carousel.json) to 1080x1350 PNGs.
// Usage: npm run render -- carousels/<slug>   (or no arg to render every carousel)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { graphics } from "./graphics/index.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WIDTH = 1080;
const HEIGHT = 1350;

const VERIFIED = `<svg viewBox="0 0 22 22" aria-label="Verified"><path fill="#1d9bf0" d="M20.4 11c0-1.3-.8-2.5-2-3.1.4-1.3.2-2.7-.7-3.6s-2.3-1.2-3.6-.7C13.5 2.4 12.3 1.6 11 1.6s-2.5.8-3.1 2c-1.3-.4-2.7-.2-3.6.7s-1.2 2.3-.7 3.6C2.4 8.5 1.6 9.7 1.6 11s.8 2.5 2 3.1c-.4 1.3-.2 2.7.7 3.6s2.3 1.2 3.6.7c.6 1.2 1.8 2 3.1 2s2.5-.8 3.1-2c1.3.4 2.7.2 3.6-.7s1.2-2.3.7-3.6c1.2-.6 2-1.8 2-3.1z"/><path fill="#fff" d="M9.6 15.1 6.2 11.7l1.3-1.3 2.1 2.1 4.9-5.3 1.4 1.3z"/></svg>`;

const BLANK_AVATAR = `<svg viewBox="0 0 100 100"><circle cx="50" cy="38" r="20" fill="#fff"/><path d="M12 100c0-22 17-36 38-36s38 14 38 36z" fill="#fff"/></svg>`;

const escape = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Minimal markdown: blank line = new paragraph, **bold**, single newline = <br>.
function formatText(text) {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((para) => `<p>${escape(para).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function avatarHtml(brand) {
  if (!brand.avatar) return BLANK_AVATAR;
  return `<img src="${pathToFileURL(path.join(ROOT, brand.avatar)).href}">`;
}

function slideHtml(brand, slide) {
  let graphic = "";
  if (slide.graphic) {
    const fn = graphics[slide.graphic.type];
    if (!fn) throw new Error(`Unknown graphic type "${slide.graphic.type}". Available: ${Object.keys(graphics).join(", ")}`);
    graphic = `<div class="graphic">${fn(slide.graphic.props || {})}</div>`;
  }
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${pathToFileURL(path.join(ROOT, "src/styles.css")).href}">
<script defer src="${pathToFileURL(path.join(ROOT, "src/ink.js")).href}"></script>
</head><body><div class="slide">
  <div class="header">
    <div class="avatar">${avatarHtml(brand)}</div>
    <div class="who">
      <div class="name">${escape(brand.name)}${brand.verified ? VERIFIED : ""}</div>
      <div class="handle">@${escape(brand.handle)}</div>
    </div>
  </div>
  <div class="text">${formatText(slide.text)}</div>
  ${graphic}
</div></body></html>`;
}

async function renderCarousel(browser, dir, brand) {
  const spec = JSON.parse(fs.readFileSync(path.join(dir, "carousel.json"), "utf8"));
  const outDir = path.join(dir, "output");
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
  for (const [i, slide] of spec.slides.entries()) {
    const n = String(i + 1).padStart(2, "0");
    const htmlFile = path.join(outDir, `.slide-${n}.html`);
    fs.writeFileSync(htmlFile, slideHtml(brand, slide));
    await page.goto(pathToFileURL(htmlFile).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => window.__inkDone === true);
    const inkError = await page.evaluate(() => window.__inkError);
    if (inkError) throw new Error(`slide ${n}: ${inkError}`);
    const overflow = await page.evaluate(() => document.querySelector(".slide").scrollHeight > window.innerHeight);
    if (overflow) console.warn(`  ! slide ${n} content overflows the canvas — trim the copy or graphic`);
    await page.screenshot({ path: path.join(outDir, `slide-${n}.png`) });
    fs.rmSync(htmlFile);
  }
  await page.close();

  if (spec.caption) fs.writeFileSync(path.join(outDir, "caption.txt"), spec.caption.trim() + "\n");
  console.log(`✓ ${path.relative(ROOT, dir)} → ${spec.slides.length} slides`);
}

const brand = JSON.parse(fs.readFileSync(path.join(ROOT, "brand.json"), "utf8"));
const targets = process.argv.slice(2).length
  ? process.argv.slice(2).map((p) => path.resolve(p))
  : fs.readdirSync(path.join(ROOT, "carousels")).map((d) => path.join(ROOT, "carousels", d)).filter((d) => fs.existsSync(path.join(d, "carousel.json")));

const browser = await chromium.launch();
try {
  for (const dir of targets) await renderCarousel(browser, dir, brand);
} finally {
  await browser.close();
}
