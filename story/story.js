import { renderBook } from "./render-book.js?v=prerender1";

// index.html normally ships the book prerendered (see prerender.mjs). Build it here only
// when it is missing, for example after editing panels.js without re-running the prerender.
const book = document.getElementById("book");
const sourcesHost = document.getElementById("sources");
if (!book.hasAttribute("data-prerendered")) renderBook(document, book, sourcesHost);
