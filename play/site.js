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

const slot = document.getElementById("ad-slot");
if (slot && SITE.adsenseClient && SITE.adsenseSlot) {
  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(SITE.adsenseClient)}`;
  document.head.appendChild(script);

  const unit = document.createElement("ins");
  unit.className = "adsbygoogle";
  unit.style.display = "block";
  unit.setAttribute("data-ad-client", SITE.adsenseClient);
  unit.setAttribute("data-ad-slot", SITE.adsenseSlot);
  unit.setAttribute("data-ad-format", "horizontal");
  unit.setAttribute("data-full-width-responsive", "true");
  slot.appendChild(unit);
  slot.hidden = false;

  script.addEventListener("load", () => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  });
}
