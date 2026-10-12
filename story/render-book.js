// Builds the comic's pages and source list from panels.js. Used by story.js in the
// browser and by prerender.mjs, which bakes the same markup into index.html so the
// text is readable before (and without) JavaScript. Only createElement,
// createTextNode, setAttribute and append are used, so a tiny DOM shim can run it.
import { PAGES, SOURCES } from "./panels.js?v=readable1";
import { ART_SIZES } from "./art-widths.js?v=1";

const ART_DIR = "../art/story/chibi/";
const ART_VER = "noglasses1";
// The book is at most 1040px wide with 24px padding; on phones it is the viewport minus 52px.
const SIZES = "(max-width: 760px) calc(100vw - 52px), 990px";

export function renderBook(doc, book, sourcesHost) {
  function el(tag, className, text) {
    const node = doc.createElement(tag);
    if (className) node.setAttribute("class", className);
    if (text) node.append(doc.createTextNode(text));
    return node;
  }

  function renderLettering(panel) {
    const lettering = el("figcaption", "lettering");
    for (const cap of panel.captions || []) {
      if (cap.quote) {
        const quote = el("blockquote", "story-quote");
        quote.append(el("p", "quote-text", `“${cap.text}”`));
        quote.append(el("footer", "quote-speaker", cap.who));
        lettering.append(quote);
      } else {
        lettering.append(el("p", "caption", cap.text));
      }
    }
    return lettering;
  }

  function renderCites(panel, className) {
    if (!panel.cites || !panel.cites.length) return null;
    const cite = el("a", className, `src ${panel.cites.join(", ")}`);
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
      img.setAttribute("sizes", SIZES);
      img.setAttribute("width", String(info.w));
      img.setAttribute("height", String(info.h));
    }
    img.setAttribute("alt", panel.alt || panel.scene);
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
    return img;
  }

  function renderPanel(panel) {
    if (panel.kind === "narration") {
      const node = el("figure", `panel narration ${panel.where || "both"}`);
      node.setAttribute("id", panel.id);
      if (panel.tag) node.append(el("span", "tag", panel.tag));
      node.append(renderLettering(panel));
      const cite = renderCites(panel, "cite");
      if (cite) node.append(cite);
      return node;
    }

    const size = panel.size && panel.size !== "wide" ? ` ${panel.size}` : "";
    const extra = `${panel.tall ? " tall" : ""}${panel.splash ? " splash" : ""}`;
    const node = el("figure", `panel ${panel.where}${size}${extra}`);
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

    if (panel.tag) frame.append(el("span", "tag", panel.tag));

    if (panel.sfx) frame.append(el("span", "sfx", panel.sfx.text));

    const cite = renderCites(panel, "cite");
    if (cite) frame.append(cite);

    node.append(frame);
    const copy = el("div", "panel-copy");
    if (panel.captions && panel.captions.length) {
      copy.append(renderLettering(panel));
    }
    node.append(copy);

    return node;
  }

  for (const page of PAGES) {
    const section = el("section", "page");
    if (page.id) section.setAttribute("id", page.id);
    if (page.chapter) {
      const head = el("h2", "chapter");
      if (page.label) head.append(el("span", "", page.label));
      head.append(doc.createTextNode(page.chapter));
      section.append(head);
    }
    if (page.id === "planks") {
      section.append(el("p", "plank-note", "These summaries describe campaign proposals, not a list of completed programs. Each panel links to its sources. Actions taken in office are described separately in the biographies above."));
    }
    const grid = el("div", "grid");
    for (const panel of page.panels) grid.append(renderPanel(panel));
    section.append(grid);
    book.append(section);
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
