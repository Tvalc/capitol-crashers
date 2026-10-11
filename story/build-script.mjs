// Writes story/SCRIPT.md from story/panels.js. Run: node story/build-script.mjs
import fs from "node:fs";
import { STYLE, PAGES, SOURCES } from "./panels.js";

const src = Object.fromEntries(SOURCES.map((s) => [s.n, s.url]));
const cites = (list) => (list || []).map((n) => `[${n}](${src[n]})`).join(", ");
const out = [
  "# Three Roads to the Capitol: script and art prompts",
  "",
  "Generated from `story/panels.js` by `node story/build-script.mjs`. Edit panels.js, not this file.",
  "",
  "Lettering is set by the page on top of the art, so keep all text out of the art itself.",
  "A real person only says words they are on the record saying; every caption fact has a source.",
  "",
  `**Style for every panel:** ${STYLE}`,
  "",
];

for (const page of PAGES) {
  out.push(`## ${page.label}: ${page.chapter}`, "");
  for (const p of page.panels) {
    out.push(`### ${p.id}${p.tag ? ` · ${p.tag}` : ""}`, "");
    if (p.kind === "narration") out.push("- **Shape:** narration band");
    else out.push(`- **Shape:** ${p.size || "wide"} · art \`${p.art || "none"}\``);
    for (const c of p.captions || []) out.push(`- **Caption${c.at ? ` (${c.at})` : ""}:** ${c.text}`);
    for (const b of p.bubbles || []) out.push(`- **${b.who}:** “${b.text}”`);
    if (p.sfx) out.push(`- **SFX:** ${p.sfx.text}`);
    if (p.cites?.length) out.push(`- **Sources:** ${cites(p.cites)}`);
    if (p.prompt) out.push("", `**Art prompt:** ${p.prompt}`);
    out.push("");
  }
}

fs.writeFileSync(new URL("./SCRIPT.md", import.meta.url), out.join("\n"));
console.log("SCRIPT.md written");
