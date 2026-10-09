import { SITE } from "./site-config.js";

const patreonLinks = document.querySelectorAll("[data-patreon]");
for (const link of patreonLinks) {
  if (!SITE.patreonUrl) {
    link.hidden = true;
    continue;
  }
  link.href = SITE.patreonUrl;
  link.hidden = false;
}
