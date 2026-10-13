// Bakes the comic into story/index.html so captions, quotes and sources are in the HTML.
// Run after editing panels.js or the panel art:  node story/prerender.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderBook } from "./render-book.js";

const esc = (s, attr) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(attr ? /"/g : /$^/, "&quot;");
const VOID = new Set(["img"]);

class Text { constructor(text) { this.text = text; } html() { return esc(this.text); } }
class Element {
  constructor(tag) { this.tag = tag; this.attrs = []; this.children = []; }
  setAttribute(name, value) { this.attrs.push([name, value]); }
  append(...nodes) { this.children.push(...nodes); }
  html() {
    const attrs = this.attrs.map(([k, v]) => ` ${k}="${esc(v, true)}"`).join("");
    if (VOID.has(this.tag)) return `<${this.tag}${attrs}>`;
    return `<${this.tag}${attrs}>${this.children.map((c) => c.html()).join("")}</${this.tag}>`;
  }
}
const doc = { createElement: (tag) => new Element(tag), createTextNode: (text) => new Text(text) };

const book = new Element("main");
const sources = new Element("ol");
const planks = new Element("div");
renderBook(doc, book, sources, planks);

const file = fileURLToPath(new URL("./index.html", import.meta.url));
let html = readFileSync(file, "utf8");
const bookRe = /<main class="book" id="book"[^>]*>[\s\S]*?<\/main>/;
const sourcesRe = /<ol class="sources" id="sources"[^>]*>[\s\S]*?<\/ol>/;
const planksRe = /<div class="planks" id="planks"[^>]*>[\s\S]*?<\/div>/;
if (!bookRe.test(html) || !sourcesRe.test(html)) throw new Error("book or sources container not found in index.html");
html = html
  .replace(bookRe, () => `<main class="book" id="book" data-prerendered="1">${book.children.map((c) => c.html()).join("")}</main>`)
  .replace(sourcesRe, () => `<ol class="sources" id="sources">${sources.children.map((c) => c.html()).join("")}</ol>`)
  .replace(planksRe, () => `<div class="planks" id="planks">${planks.children.map((c) => c.html()).join("")}</div>`);
writeFileSync(file, html);
console.log(`prerendered ${book.children.length} pages and ${sources.children.length} sources into story/index.html`);
