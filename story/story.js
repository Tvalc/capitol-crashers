// Renders one issue of the comic. The page names its data file in
// <body data-issue="...">, relative to this script; Issue #1 is panels.js.
import { ISSUES } from "./issues.js";

const here = (path) => new URL(path, import.meta.url).href;
const ART_DIR = here("../art/story/");
const issueFile = document.body.dataset.issue || "panels.js";
const { PAGES, PLANKS = [], SOURCES = [], BACK } = await import(here(`./${issueFile}`));

const book = document.getElementById("book");
const planksHost = document.getElementById("planks");
const sourcesHost = document.getElementById("sources");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function citeLink(className, cites) {
  const cite = el("a", className, `src ${cites.join(", ")}`);
  cite.href = `#src-${cites[0]}`;
  cite.setAttribute("aria-label", `Sources ${cites.join(", ")}`);
  return cite;
}

function panelShell(panel) {
  const size = panel.size && panel.size !== "wide" ? ` ${panel.size}` : "";
  const extra = `${panel.tall ? " tall" : ""}${panel.splash ? " splash" : ""}${panel.type === "stat" ? " stat" : ""}`;
  const node = el("figure", `panel ${panel.where}${size}${extra}`);
  node.id = panel.id;
  return node;
}

// A "by the numbers" panel: one big figure and what it means. Needs no art.
function renderStat(panel) {
  const node = panelShell(panel);
  const body = el("div", "stat-body");
  body.append(el("strong", `stat-big${panel.big.length > 6 ? " long" : ""}`, panel.big));
  body.append(el("p", "stat-label", panel.label));
  if (panel.sub) body.append(el("p", "stat-sub", panel.sub));
  node.append(body);
  if (panel.tag) node.append(el("span", "tag", panel.tag));
  if (panel.cites?.length) node.append(citeLink("cite", panel.cites));
  return node;
}

function renderPanel(panel) {
  if (panel.type === "stat") return renderStat(panel);
  const node = panelShell(panel);

  if (panel.art) {
    const img = el("img");
    img.src = ART_DIR + panel.art;
    img.alt = panel.alt || panel.scene;
    img.loading = "lazy";
    img.decoding = "async";
    node.append(img);
  } else {
    const scene = el("div", "scene");
    scene.setAttribute("role", "img");
    scene.setAttribute("aria-label", panel.alt || panel.scene);
    scene.append(el("b", "", panel.scene));
    node.append(scene);
  }

  if (panel.tag) node.append(el("span", "tag", panel.tag));

  for (const cap of panel.captions || []) {
    node.append(el("p", `caption ${cap.pos || "tl"}`, cap.text));
  }

  for (const line of panel.bubbles || []) {
    const bubble = el("p", `bubble ${line.pos || "left high"}${line.shout ? " shout" : ""}`);
    if (line.who) bubble.append(el("span", "who", line.who));
    bubble.append(document.createTextNode(line.text));
    node.append(bubble);
  }

  if (panel.sfx) node.append(el("span", "sfx", panel.sfx.text));
  if (panel.cites?.length) node.append(citeLink("cite", panel.cites));
  return node;
}

for (const page of PAGES) {
  const section = el("section", "page");
  if (page.chapter) {
    const head = el("h2", "chapter");
    if (page.label) head.append(el("span", "", page.label));
    head.append(document.createTextNode(page.chapter));
    section.append(head);
  }
  if (page.intro) section.append(el("p", "chapter-intro", page.intro));
  const grid = el("div", "grid");
  for (const panel of page.panels) grid.append(renderPanel(panel));
  section.append(grid);
  book.append(section);
}

if (BACK) {
  const head = document.getElementById("back-head");
  head.replaceChildren(el("span", "", BACK.label), document.createTextNode(BACK.title));
  if (BACK.intro) head.after(el("p", "chapter-intro", BACK.intro));
}

for (const plank of PLANKS) {
  const card = el("article", `plank ${plank.where}`);
  if (plank.status) card.append(el("span", `status ${plank.status.replace(/\s+/g, "-").toLowerCase()}`, plank.status));
  card.append(el("small", "", plank.who));
  card.append(el("h3", "", plank.title));
  card.append(el("p", "", plank.text));
  if (plank.cites) card.append(citeLink("plank-cite", plank.cites));
  planksHost.append(card);
}
if (!PLANKS.length) planksHost.closest(".book").remove();

for (const source of SOURCES) {
  const item = el("li");
  item.id = `src-${source.n}`;
  item.value = source.n;
  item.append(document.createTextNode(`${source.label} `));
  const link = el("a", "", source.url.replace(/^https?:\/\//, ""));
  link.href = source.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  item.append(link);
  sourcesHost.append(item);
}

// "More issues" shelf, skipping the one on screen.
const shelf = document.getElementById("issues");
if (shelf) {
  for (const issue of ISSUES) {
    if (issue.file === issueFile) continue;
    const card = el("a", `issue-card ${issue.where}`);
    card.href = here(issue.path);
    card.append(el("small", "", `Issue #${issue.n}`));
    card.append(el("strong", "", issue.title));
    card.append(el("span", "", issue.dek));
    shelf.append(card);
  }
}
