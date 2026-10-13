// Builds the comic's pages, platform cards and source list from panels.js. Used by
// story.js in the browser and by prerender.mjs, which bakes the same markup into
// index.html so the text is readable before (and without) JavaScript. Only
// createElement, createTextNode, setAttribute and append are used, so a tiny DOM
// shim can run it.
//
// Lettering is set on the art: caption boxes grouped by corner, speech bubbles
// placed by center point with a tail toward the speaker, and SFX. On narrow
// screens comic.css moves the lettering under the art.
import { PAGES, PLANKS, SOURCES } from "./panels.js?v=aoc1";
import { ART_SIZES } from "./art-widths.js?v=aoc1";

const ART_DIR = "../art/story/chibi/";
const ART_VER = "aoc1";
// The book is at most 1120px wide; half panels take half of it. Phones are one column.
const SIZES_WIDE = "(max-width: 760px) calc(100vw - 40px), 1060px";
const SIZES_HALF = "(max-width: 760px) calc(100vw - 40px), 530px";

export function renderBook(doc, book, sourcesHost, planksHost) {
  function el(tag, className, text) {
    const node = doc.createElement(tag);
    if (className) node.setAttribute("class", className);
    if (text) node.append(doc.createTextNode(text));
    return node;
  }

  function renderCites(panel) {
    if (!panel.cites || !panel.cites.length) return null;
    const cite = el("a", "cite", `src ${panel.cites.join(", ")}`);
    cite.setAttribute("href", `#src-${panel.cites[0]}`);
    cite.setAttribute("aria-label", `Sources ${panel.cites.join(", ")}`);
    return cite;
  }

  function renderArt(panel) {
    const img = el("img");
    const info = ART_SIZES[panel.art];
    const url = (file) => ART_DIR + file + "?v=" + ART_VER;
    img.setAttribute("src", url(info?.variants["1400"] || panel.art));
    if (info) {
      const set = Object.entries(info.variants).map(([w, file]) => `${url(file)} ${w}w`);
      set.push(`${url(panel.art)} ${info.w}w`);
      img.setAttribute("srcset", set.join(", "));
      img.setAttribute("sizes", panel.size === "half" ? SIZES_HALF : SIZES_WIDE);
      img.setAttribute("width", String(info.w));
      img.setAttribute("height", String(info.h));
    }
    img.setAttribute("alt", panel.alt || panel.scene || "");
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
    return img;
  }

  // Caption boxes are grouped by corner so several can stack in one spot.
  function renderCaptions(panel) {
    const stacks = new Map();
    for (const cap of panel.captions || []) {
      const at = cap.at || "tl";
      if (!stacks.has(at)) stacks.set(at, el("div", `caps ${at}`));
      stacks.get(at).append(el("p", `cap${cap.voice ? " voice" : ""}`, cap.text));
    }
    return [...stacks.values()];
  }

  // A bubble is placed by its center (x, y in percent of the art) and points its
  // tail at the speaker: s, sw, se, n, nw, ne, w, e or none.
  function renderBubble(line) {
    const bubble = el("blockquote", `bubble tail-${line.tail || "s"}${line.shout ? " shout" : ""}`);
    bubble.setAttribute("style", `--x:${line.x ?? 50}%;--y:${line.y ?? 20}%;--w:${line.w ?? 30}%`);
    if (line.who) bubble.append(el("span", "who", line.who));
    bubble.append(el("span", "said", line.text));
    return bubble;
  }

  function renderPanel(panel) {
    if (panel.kind === "person") {
      const node = el("div", `person ${panel.where || "both"}`);
      node.setAttribute("id", panel.id);
      node.append(el("span", "person-name", panel.name));
      if (panel.line) node.append(el("span", "person-line", panel.line));
      return node;
    }

    if (panel.kind === "narration") {
      const node = el("figure", `panel narration ${panel.where || "both"}`);
      node.setAttribute("id", panel.id);
      if (panel.tag) node.append(el("span", "tag", panel.tag));
      const body = el("div", "narration-body");
      for (const cap of panel.captions || []) body.append(el("p", cap.big ? "big" : "", cap.text));
      node.append(body);
      const cite = renderCites(panel);
      if (cite) node.append(cite);
      return node;
    }

    const node = el("figure", `panel ${panel.where || "both"} ${panel.size || "wide"}`);
    node.setAttribute("id", panel.id);
    const frame = el("div", "frame");
    if (panel.art) {
      frame.append(renderArt(panel));
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
    for (const node2 of panel.bubblesFirst ? [...bubbles, ...caps] : [...caps, ...bubbles]) lettering.append(node2);
    if (panel.sfx) {
      const sfx = el("span", "sfx", panel.sfx.text);
      sfx.setAttribute("style", `--x:${panel.sfx.x ?? 78}%;--y:${panel.sfx.y ?? 60}%;--r:${panel.sfx.rot ?? -8}deg`);
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
    if (page.id) section.setAttribute("id", page.id);
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

  if (planksHost) {
    for (const plank of PLANKS) {
      const card = el("article", `plank ${plank.where}`);
      card.append(el("small", "", plank.who));
      card.append(el("h3", "", plank.title));
      card.append(el("p", "", plank.text));
      if (plank.cites) {
        const cite = el("a", "plank-cite", `src ${plank.cites.join(", ")}`);
        cite.setAttribute("href", `#src-${plank.cites[0]}`);
        card.append(cite);
      }
      planksHost.append(card);
    }
  }

  for (const source of SOURCES) {
    const item = el("li");
    item.setAttribute("id", `src-${source.n}`);
    item.setAttribute("value", String(source.n));
    item.append(doc.createTextNode(`${source.label} `));
    const link = el("a", "", source.url.replace(/^https?:\/\//, ""));
    link.setAttribute("href", source.url);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    item.append(link);
    sourcesHost.append(item);
  }
}
