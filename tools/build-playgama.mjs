#!/usr/bin/env node
/*
 * Build a self-contained Capitol Crashers archive for Playgama.
 *
 *   node tools/build-playgama.mjs [--music <dir>] [--out <dir>]
 *   npm run build:playgama
 *
 * Output: dist/playgama/ (the unpacked build) and dist/capitol-crashers-playgama.zip.
 * index.html sits at the archive root. Everything the game loads is copied inside:
 * sprites, environment art, story panels and clips, the house ad creatives and,
 * when a music folder is found, the soundtrack. Only the Playgama Bridge SDK is
 * fetched from the network. No AdSense tag, no analytics, no links out, no domain
 * checks. Latin-only file names and a 300 MB ceiling are enforced at the end.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "..");
const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : fallback; };
const out = path.resolve(repo, opt("--out", "dist/playgama"));
const zipPath = path.resolve(path.dirname(out), "capitol-crashers-playgama.zip");
const musicCandidates = [
  opt("--music", ""),
  path.resolve(repo, "../political-arcades/horse/assets/music"),
  path.resolve(repo, "../political-arcades-redesign/horse/assets/music"),
].filter(Boolean);
const LIMIT = 300 * 1024 * 1024;

const log = (...m) => console.log("[build:playgama]", ...m);
const read = (rel) => fs.readFileSync(path.join(repo, rel), "utf8");
const write = (rel, text) => { const p = path.join(out, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); };
const copyTree = (fromRel, toRel, filter = () => true) => {
  const from = path.join(repo, fromRel);
  if (!fs.existsSync(from)) { log("skip missing", fromRel); return; }
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name), rel = path.posix.join(toRel, entry.name);
    if (entry.isDirectory()) copyTree(path.join(fromRel, entry.name), rel, filter);
    else if (filter(rel)) { fs.mkdirSync(path.join(out, path.dirname(rel)), { recursive: true }); fs.copyFileSync(srcPath, path.join(out, rel)); }
  }
};
const must = (text, old, label) => { if (!text.includes(old)) throw new Error(`build rewrite failed: ${label} not found`); return text; };

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

// ---- index.html --------------------------------------------------------------
let html = read("play/index.html").replace(/\r\n/g, "\n");
html = must(html, '<link rel="canonical" href="https://capitolcrashers.com/play/" />', "canonical").replace('  <link rel="canonical" href="https://capitolcrashers.com/play/" />\n', "");
html = must(html, '../chibi-ui.css', "chibi-ui").replace('../chibi-ui.css', 'chibi-ui.css');
html = must(html, '<a class="brand" href="../">Capitol Crashers</a>', "brand").replace('<a class="brand" href="../">Capitol Crashers</a>', '<span class="brand">Capitol Crashers</span>');
html = html.replace(/\s*<a class="patreon"[^>]*>Support on Patreon<\/a>/g, "");
html = must(html, 'id="story-more"', "story-more").replace(/\s*<a class="story-more"[^>]*>Read the whole comic<\/a>/, "");
html = must(html, '<footer class="site-foot">', "footer").replace(/<footer class="site-foot">[\s\S]*?<\/footer>\n/, "");
html = must(html, '../soundtrack.js', "soundtrack").replace('../soundtrack.js', 'soundtrack.js');
html = must(html, 'window.A2A_ADS = { enabled: false, stub: true };', "A2A_ADS").replace(
  'window.A2A_ADS = { enabled: false, stub: true };',
  'window.A2A_ADS = { enabled: false, stub: true, google: false, build: "playgama" };');
write("index.html", html);

// ---- css / js next to index.html ----------------------------------------------
write("game-page.css", read("play/game-page.css").replace(/\.\.\/art\//g, "art/"));
write("styles.css", read("play/styles.css"));
write("touch.css", read("play/touch.css"));
write("touch.js", read("play/touch.js"));
write("site.js", read("play/site.js"));
write("site-config.js", 'export const SITE = { patreonUrl: "" };\n');   // no links out of the game in this build
write("chibi-ui.css", read("chibi-ui.css"));
write("playgama-bridge-config.json", read("play/playgama-bridge-config.json"));
copyTree("play/ads", "ads");
copyTree("play/src", "src", (rel) => rel.endsWith(".js"));
for (const file of fs.readdirSync(path.join(out, "src"))) {
  const p = path.join(out, "src", file);
  let js = fs.readFileSync(p, "utf8");
  js = js.replace(/"\.\.\/\.\.\/story\/panels\.js"/g, '"../story/panels.js"');   // module import: relative to src/
  js = js.replace(/\.\.\/art\//g, "art/");                                       // image and video src: relative to index.html
  js = js.replace(/`\.\.\/story\/#\$\{panel\.id\}`/g, '"#"');                   // no comic site in the build
  if (file === "render.js") {                                                   // optional parallax art does not exist yet: no 404s in the build
    js = js.replace(/^\s*for \(const stage of STAGES\) for \(const layer of stage\.layers \|\| \[\]\) tryLoad\(.*$/m, "");
    js = js.replace(/^\s*tryLoad\("icicles".*$/m, "");
  }
  fs.writeFileSync(p, js);
}
copyTree("story", "story", (rel) => rel === "story/panels.js");

// ---- art and sprites ------------------------------------------------------------
copyTree("play/assets", "assets");
copyTree("art/chibi", "art/chibi", (rel) => !rel.endsWith(".json") || rel.endsWith("provenance.json"));
copyTree("art/story/chibi", "art/story/chibi");
copyTree("art/story/motion", "art/story/motion");

// ---- soundtrack --------------------------------------------------------------------
let soundtrack = read("soundtrack.js");
const musicDir = musicCandidates.find((dir) => fs.existsSync(dir));
if (musicDir) {
  const have = new Set(fs.readdirSync(musicDir).filter((f) => f.endsWith(".mp3")).map((f) => f.slice(0, -4)));
  const listed = [...soundtrack.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]).filter((t) => have.has(t));
  fs.mkdirSync(path.join(out, "music"), { recursive: true });
  for (const track of listed) fs.copyFileSync(path.join(musicDir, `${track}.mp3`), path.join(out, "music", `${track}.mp3`));
  soundtrack = must(soundtrack, "https://politicalarcades.com/horse/assets/music/", "music url").replace("https://politicalarcades.com/horse/assets/music/", "music/");
  soundtrack = soundtrack.replace(/const tracks = \[[\s\S]*?\];/, `const tracks = ${JSON.stringify(listed)};`);
  log(`music: ${listed.length} tracks from ${musicDir}`);
} else {
  soundtrack = soundtrack.replace(/const tracks = \[[\s\S]*?\];/, "const tracks = [];");
  soundtrack = soundtrack.replace("https://politicalarcades.com/horse/assets/music/", "music/");
  log("music: no folder found, soundtrack ships with an empty track list (pass --music <dir>)");
}
write("soundtrack.js", soundtrack);

// ---- checks ---------------------------------------------------------------------------
const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p); else files.push(p);
  }
})(out);
let total = 0;
const problems = [];
const allowedHosts = ["bridge.playgama.com"];
for (const file of files) {
  const rel = path.relative(out, file).split(path.sep).join("/");
  total += fs.statSync(file).size;
  if (!/^[A-Za-z0-9._\/-]+$/.test(rel)) problems.push(`non-Latin or odd file name: ${rel}`);
  if (/\.(html|js|css|json|svg)$/.test(file)) {
    const text = fs.readFileSync(file, "utf8");
    for (const m of text.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
      const host = m[1].toLowerCase();
      if (allowedHosts.includes(host)) continue;
      if (rel === "story/panels.js") continue;                      // source citations, data only, never rendered in the game
      if (rel.startsWith("ads/sponsors.json") || rel.startsWith("ads/house/")) continue; // sponsor hrefs are data; the game never navigates
      if (rel === "ads/a2a-ads.js" && /googlesyndication/.test(host)) continue;       // present but unreachable: google:false
      if (/w3\.org|schema\.org/.test(host)) continue;                // xml namespaces
      if (rel.endsWith(".json") && /makko\.ai$/.test(host)) continue;  // sprite provenance metadata, never fetched
      problems.push(`external reference in ${rel}: ${m[0]}`);
    }
    if (/googletagmanager|google-analytics|gtag\(/.test(text)) problems.push(`analytics tag in ${rel}`);
    if (rel === "index.html" && /adsbygoogle/.test(text)) problems.push("adsbygoogle tag in index.html");
  }
}
if (total > LIMIT) problems.push(`archive would be ${(total / 1048576).toFixed(1)} MB, over 300 MB`);
if (!fs.existsSync(path.join(out, "index.html"))) problems.push("index.html missing at root");
if (problems.length) { for (const p of problems) console.error("[build:playgama] PROBLEM", p); process.exit(1); }

// ---- zip (stored with deflate, forward slashes, no dependencies) ------------------------
const crcTable = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const dosTime = (d) => ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xffff;
const dosDate = (d) => (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff;
const locals = [], centrals = [];
let offset = 0;
const now = new Date();
for (const file of files.sort()) {
  const name = Buffer.from(path.relative(out, file).split(path.sep).join("/"), "utf8");
  const data = fs.readFileSync(file);
  const packed = zlib.deflateRawSync(data, { level: 9 });
  const useDeflate = packed.length < data.length;
  const body = useDeflate ? packed : data;
  const crc = crc32(data);
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0); header.writeUInt16LE(20, 4); header.writeUInt16LE(0x0800, 6);
  header.writeUInt16LE(useDeflate ? 8 : 0, 8); header.writeUInt16LE(dosTime(now), 10); header.writeUInt16LE(dosDate(now), 12);
  header.writeUInt32LE(crc, 14); header.writeUInt32LE(body.length, 18); header.writeUInt32LE(data.length, 22);
  header.writeUInt16LE(name.length, 26); header.writeUInt16LE(0, 28);
  locals.push(header, name, body);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x0800, 8);
  central.writeUInt16LE(useDeflate ? 8 : 0, 10); central.writeUInt16LE(dosTime(now), 12); central.writeUInt16LE(dosDate(now), 14);
  central.writeUInt32LE(crc, 16); central.writeUInt32LE(body.length, 20); central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(name.length, 28); central.writeUInt16LE(0, 30); central.writeUInt16LE(0, 32);
  central.writeUInt16LE(0, 34); central.writeUInt16LE(0, 36); central.writeUInt32LE(0, 38); central.writeUInt32LE(offset, 42);
  centrals.push(central, name);
  offset += header.length + name.length + body.length;
}
const centralSize = centrals.reduce((n, b) => n + b.length, 0);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(0, 4); end.writeUInt16LE(0, 6);
end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(centralSize, 12); end.writeUInt32LE(offset, 16); end.writeUInt16LE(0, 20);
fs.writeFileSync(zipPath, Buffer.concat([...locals, ...centrals, end]));

log(`files: ${files.length}, unpacked ${(total / 1048576).toFixed(1)} MB`);
log(`zip: ${zipPath} (${(fs.statSync(zipPath).size / 1048576).toFixed(1)} MB)`);
