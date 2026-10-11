import { PAGES, PLANKS, SOURCES } from "./panels.js?v=roads2";

const ART_DIR = "../art/story/chibi/";
const ART_VER = "roads2";
const book = document.getElementById("book");
const planksHost = document.getElementById("planks");
const sourcesHost = document.getElementById("sources");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderCites(panel) {
  if (!panel.cites || !panel.cites.length) return null;
  const cite = el("a", "cite", `src ${panel.cites.join(", ")}`);
  cite.href = `#src-${panel.cites[0]}`;
  cite.setAttribute("aria-label", `Sources ${panel.cites.join(", ")}`);
  return cite;
}

// Caption boxes are grouped by corner so several can stack in one spot.
function renderCaptions(panel) {
  const stacks = {};
  for (const cap of panel.captions || []) {
    const at = cap.at || "tl";
    if (!stacks[at]) stacks[at] = el("div", `caps ${at}`);
    stacks[at].append(el("p", `cap${cap.voice ? " voice" : ""}`, cap.text));
  }
  return Object.values(stacks);
}

// A bubble is placed by its center (x, y in percent of the art) and points its
// tail at the speaker: s, sw, se, n, w, e. Width is a percent of the art.
function renderBubble(line) {
  const bubble = el("blockquote", `bubble tail-${line.tail || "s"}${line.shout ? " shout" : ""}`);
  bubble.style.setProperty("--x", `${line.x ?? 50}%`);
  bubble.style.setProperty("--y", `${line.y ?? 20}%`);
  bubble.style.setProperty("--w", `${line.w ?? 30}%`);
  if (line.who) bubble.append(el("span", "who", line.who));
  bubble.append(el("span", "said", line.text));
  return bubble;
}

function renderPanel(panel) {
  if (panel.kind === "narration") {
    const node = el("figure", `panel narration ${panel.where || "both"}`);
    node.id = panel.id;
    if (panel.tag) node.append(el("span", "tag", panel.tag));
    const body = el("div", "narration-body");
    for (const cap of panel.captions || []) body.append(el("p", cap.big ? "big" : "", cap.text));
    node.append(body);
    const cite = renderCites(panel);
    if (cite) node.append(cite);
    return node;
  }

  const node = el("figure", `panel ${panel.where || "both"} ${panel.size || "wide"}`);
  node.id = panel.id;
  const frame = el("div", "frame");

  if (panel.art) {
    const img = el("img");
    img.src = ART_DIR + panel.art + "?v=" + ART_VER;
    img.alt = panel.alt || panel.scene || "";
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

  const lettering = el("div", "lettering");
  if (panel.tag) lettering.append(el("span", "tag", panel.tag));
  // On phones the lettering stacks in DOM order, so `bubblesFirst` puts the
  // spoken line ahead of the caption that answers it.
  const caps = renderCaptions(panel);
  const bubbles = (panel.bubbles || []).map(renderBubble);
  for (const node of panel.bubblesFirst ? [...bubbles, ...caps] : [...caps, ...bubbles]) lettering.append(node);
  if (panel.sfx) {
    const sfx = el("span", "sfx", panel.sfx.text);
    sfx.style.setProperty("--x", `${panel.sfx.x ?? 78}%`);
    sfx.style.setProperty("--y", `${panel.sfx.y ?? 60}%`);
    sfx.style.setProperty("--r", `${panel.sfx.rot ?? -8}deg`);
    lettering.append(sfx);
  }
  frame.append(lettering);
  const cite = renderCites(panel);
  if (cite) frame.append(cite);
  node.append(frame);
  return node;
}

for (const page of PAGES) {
  const section = el("section", "page");
  if (page.id) section.id = page.id;
  if (page.chapter) {
    const head = el("h2", "chapter");
    if (page.label) head.append(el("span", "label", page.label));
    head.append(el("span", "title", page.chapter));
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
