import { PAGES, PLANKS, SOURCES } from "./panels.js?v=likeness6";

const ART_DIR = "../art/story/chibi/";
const ART_VER = "likeness6";
const book = document.getElementById("book");
const planksHost = document.getElementById("planks");
const sourcesHost = document.getElementById("sources");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderPanel(panel) {
  const size = panel.size && panel.size !== "wide" ? ` ${panel.size}` : "";
  const extra = `${panel.tall ? " tall" : ""}${panel.splash ? " splash" : ""}`;
  const node = el("figure", `panel ${panel.where}${size}${extra}`);
  node.id = panel.id;

  const frame = el("div", "frame");

  if (panel.art) {
    const img = el("img");
    img.src = ART_DIR + panel.art + "?v=" + ART_VER;
    img.alt = panel.alt || panel.scene;
    img.loading = "lazy";
    img.decoding = "async";
    frame.append(img);
  } else {
    const scene = el("div", "scene");
    scene.setAttribute("role", "img");
    scene.setAttribute("aria-label", panel.alt || panel.scene);
    scene.append(el("b", "", panel.scene));
    frame.append(scene);
  }

  if (panel.tag) frame.append(el("span", "tag", panel.tag));

  const dialogue = el("div", "dialogue");
  for (const line of panel.bubbles || []) {
    const bubble = el("blockquote", "dialogue-line");
    if (line.who) bubble.append(el("span", "who", line.who));
    bubble.append(document.createTextNode(line.text));
    dialogue.append(bubble);
  }

  if (panel.sfx) frame.append(el("span", "sfx", panel.sfx.text));

  if (panel.cites && panel.cites.length) {
    const cite = el("a", "cite", `src ${panel.cites.join(", ")}`);
    cite.href = `#src-${panel.cites[0]}`;
    cite.setAttribute("aria-label", `Sources ${panel.cites.join(", ")}`);
    frame.append(cite);
  }

  node.append(frame);
  const copy = el("div", "panel-copy");
  if (dialogue.childElementCount) copy.append(dialogue);

  const captions = panel.captions || [];
  if (captions.length) {
    const lettering = el("figcaption", "lettering");
    for (const cap of captions) {
      lettering.append(el("p", "caption", cap.text));
    }
    copy.append(lettering);
  }
  node.append(copy);

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
  const grid = el("div", "grid");
  for (const panel of page.panels) grid.append(renderPanel(panel));
  section.append(grid);
  book.append(section);
}

for (const plank of PLANKS) {
  const card = el("article", `plank ${plank.where}`);
  card.append(el("small", "", plank.who));
  card.append(el("h3", "", plank.title));
  card.append(el("p", "", plank.text));
  if (plank.cites) {
    const cite = el("a", "plank-cite", `src ${plank.cites.join(", ")}`);
    cite.href = `#src-${plank.cites[0]}`;
    card.append(cite);
  }
  planksHost.append(card);
}

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

