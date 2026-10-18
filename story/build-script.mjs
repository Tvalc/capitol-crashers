import { writeFileSync } from "node:fs";
import { PAGES, SOURCES, STYLE } from "./panels.js";

const byN = Object.fromEntries(SOURCES.map((s) => [s.n, s]));

function citeLine(cites) {
  if (!cites?.length) return "";
  return cites
    .map((n) => {
      const s = byN[n];
      return s ? `[${n}](${s.url})` : `[${n}]`;
    })
    .join(", ");
}

function shape(panel) {
  if (panel.kind === "narration") return "narration page";
  const bits = [panel.size || "wide"];
  if (panel.tall) bits.push("tall");
  if (panel.splash) bits.push("splash");
  return bits.join(", ");
}

function capKind(cap) {
  if (cap.kind === "voice") return "Narrator";
  return "Caption";
}

let out = "";
out += "# Four Roads to the Capitol: script and Makko prompts\n\n";
out += "Generated from `story/panels.js`. Edit that file, not this one.\n\n";
out += "## How to add art\n\n";
out += "1. Generate each panel in Makko with the style line below plus that panel's prompt.\n";
out += "2. Save it as `art/story/<panel id>.webp` (for example `art/story/p01.webp`).\n";
out += "3. In `story/panels.js`, set that panel's `art` to the file name (`art: \"p01.webp\"`).\n\n";
out += "Keep all lettering out of the art. Captions and speech bubbles are added by the page, so they stay editable and correctly spelled.\n\n";
out += "**Style line for every panel:**\n\n";
out += `> ${STYLE}\n`;

for (const page of PAGES) {
  out += `\n## ${page.label}: ${page.chapter}\n`;
  for (const panel of page.panels) {
    out += `\n### ${panel.id} · ${panel.scene} · (${panel.tag || page.label})\n\n`;
    out += `- **Shape:** ${shape(panel)}\n`;
    for (const cap of panel.captions || []) {
      out += `- **${capKind(cap)}:** ${cap.text}\n`;
    }
    for (const line of panel.bubbles || []) {
      out += `- **${line.who}:** "${line.text}"\n`;
    }
    if (panel.sfx) out += `- **SFX:** ${panel.sfx.text}\n`;
    const cites = citeLine(panel.cites);
    if (cites) out += `- **Sources:** ${cites}\n`;
    if (panel.prompt) {
      out += `\n**Makko prompt:**\n\n> ${panel.prompt}\n`;
    }
  }
}

writeFileSync(new URL("./SCRIPT.md", import.meta.url), out);
console.log("wrote SCRIPT.md", out.length);
