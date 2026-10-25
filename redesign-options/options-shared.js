/* Shared helpers for the four redesign options. Reads window.UKRU from options-data.js. */
(function () {
  const U = window.UKRU;
  const CDN = "https://images.unsplash.com/photo-";

  const PHOTOS = {
    drone: { id: "1473968512647-3e447244af8f", page: "XYrjl3j7smo", by: "Jason Mavrommatis", alt: "A white quadcopter drone hovering above a forest" },
    carrier: { id: "1508530786855-dfea35260b8d", page: "BQgAYwERXhs", by: "Michael Afonso", alt: "A grey aircraft carrier on calm water" },
    tanker: { id: "1518527989017-5baca7a58d3c", pos: "50% 50%", page: "-subrrYxv8A", by: "Shaah Shahidh", alt: "Aerial view of a red tanker ship on dark blue sea" },
    basil: { id: "1520106212299-d99c443e4568", pos: "50% 30%", page: "lvJZhHOIJJ4", by: "Nikita Karimov", alt: "St Basil’s Cathedral lit at night with a crowd in the square" },
    jets: { id: "1583133269464-b721db5345f4", pos: "50% 40%", page: "DTZaI8lolUk", by: "Leo_Visions", alt: "Four jets trailing smoke in a grey sky, in monochrome" },
    kremlin: { id: "1652342532673-59a848be8a0a", pos: "50% 45%", page: "iRLZWPATf-w", by: "Viktor Solomonik", alt: "The Kremlin walls and towers beyond the Moskva river" },
    wind: { id: "1654083198752-56ff209c8129", page: "-IaTiYqRTL8", by: "Jesse De Meulenaere", alt: "Offshore wind turbines standing in a flat North Sea" },
    f35: { id: "1663011674120-bae80b78377c", page: "g7WUOP7bkTw", by: "Rama Laksono", alt: "A stealth fighter banking through a bank of cloud" },
    cooling: { id: "1689456852106-f9531a517c8b", pos: "50% 40%", page: "8rtotUvnp8U", by: "Andry Sagatelov", alt: "Cooling towers rising into mist" },
    cooling2: { id: "1772376920794-326f1bc87be6", page: "cEu42Y4E6SI", by: "Energie-portal.sk", alt: "Cooling towers releasing steam over a ploughed field" },
    destroyer: { id: "1719553946838-1190abdeee92", page: "8dJM0LwzsfU", by: "Abdullah Al Hasan", alt: "A grey destroyer on open sea under a hazy sky" },
    refinery: { id: "1722246128616-76c934278e0a", pos: "50% 28%", view: "inset(0 0 36% 0)", page: "3svqKKUUDRY", by: "Buddy AN", alt: "Refinery silhouettes against a dusk sky" },
    atc: { id: "1723059518530-1feec72f2771", pos: "50% 40%", page: "XmLULwMRxcU", by: "Johannes Heel", alt: "An air traffic control tower at dusk with an aircraft on approach" },
    westminster: { id: "1750872310330-80191a871b36", pos: "50% 40%", page: "xnqYSIK6UA0", by: "Martine Mussies", alt: "The Palace of Westminster under a cloudy sky" },
    bigben: { id: "1760308379607-5b08da6a80b5", pos: "50% 36%", page: "p_Aj0pSguPE", by: "Emre ÇOBAN", alt: "Elizabeth Tower and the Houses of Parliament at dusk" },
    thames: { id: "1766775835279-0a94d7b45ddb", pos: "50% 35%", page: "pfOAVqVTPUs", by: "Miguel Joya", alt: "The Houses of Parliament across the Thames under a pale sky" },
  };

  const OVERRIDE = {
    "Drone strikes begin": "refinery",
    "Campaign disclosed": "refinery",
    "NATS system fault": "atc",
    "Swindon drone plants": "bigben",
    "Tanker near wind farms": "wind",
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function photoFor(e) {
    const o = OVERRIDE[e.en.short];
    if (o) return o;
    switch (e.domain) {
      case 1: return e.side === "uk" ? "drone" : e.side === "ru" ? "cooling" : "cooling2";
      case 2: return e.side === "uk" ? "carrier" : e.side === "ru" ? (e.id % 2 ? "jets" : "destroyer") : "f35";
      case 3: return "refinery";
      case 4: return e.side === "ru" ? (e.id % 2 ? "basil" : "kremlin") : (e.id % 2 ? "thames" : "westminster");
      case 5: return "tanker";
      default: return "thames";
    }
  }

  const DOMAIN_PHOTO = { 1: "drone", 2: "carrier", 3: "atc", 4: "westminster", 5: "tanker" };

  const url = (key, w) => `${CDN}${PHOTOS[key].id}?auto=format&q=70&w=${w}`;

  function img(key, { w = 800, ratio = 1.5, sizes = "100vw", eager = false, cls = "", alt } = {}) {
    const widths = [480, 800, 1280, 1920].filter((x) => x <= Math.max(w * 2, 800));
    const srcset = widths.map((x) => `${url(key, x)} ${x}w`).join(", ");
    const h = Math.round(w / ratio);
    return `<img class="${cls}" src="${url(key, w)}" srcset="${srcset}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt ?? PHOTOS[key].alt)}" style="object-position:${PHOTOS[key].pos || "50% 50%"}${PHOTOS[key].view ? `;object-view-box:${PHOTOS[key].view}` : ""}" ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>`;
  }

  const creditInner = (key, lang) =>
    `${lang === "he" ? "צילום" : "Photo"}: <a href="https://unsplash.com/photos/${PHOTOS[key].page}" rel="noopener">${esc(PHOTOS[key].by)}</a> / <a href="https://unsplash.com/" rel="noopener">Unsplash</a>`;
  const credit = (key, lang) => `<span class="credit">${creditInner(key, lang)}</span>`;

  const PHASES = [
    { id: "p1", from: "2026-01-01", to: "2026-08-14", photo: "refinery", range: [[0, 1], [7, 14]] },
    { id: "p2", from: "2026-08-15", to: "2026-08-27", photo: "kremlin", range: [[7, 15], [7, 27]] },
    { id: "p3", from: "2026-09-01", to: "2026-09-30", photo: "destroyer", range: [[8, 1], [8, 30]] },
    { id: "p4", from: "2026-10-01", to: "2026-10-31", photo: "wind", range: [[9, 1], [9, 22]] },
  ];

  function phaseRows(p) {
    return U.events.filter((e) => e.date >= p.from && e.date <= p.to);
  }

  function phaseLabel(p, lang) {
    const m = U.ui[lang].months;
    const fmt = ([mi, d]) => (lang === "he" ? `${d} ${m[mi]}` : `${d} ${m[mi][0] + m[mi].slice(1).toLowerCase()}`);
    return `${fmt(p.range[0])} – ${fmt(p.range[1])}`;
  }

  function mean(rows, key) {
    return rows.length ? rows.reduce((s, e) => s + e[key], 0) / rows.length : 0;
  }

  const WORDS = {
    en: { events: "events", event: "event", all: "All", search: "Search", open: "Open", close: "Close", menu: "Menu", ask: "Ask the tracker", method: "Method", fullTracker: "Open the full tracker", direct: "Direct", indirect: "Indirect", danger: "Danger", impact: "Impact", sources: "Sources", seeAll: "See all", source: "Source", illustrative: "Illustrative photograph, not from the events listed.", live: "Live tracker", ladder: "Levels up/down", timeline: "Timeline", tempo: "Tempo", plot: "Plot", filterSide: "Filter by side", noRows: "No events match this filter in this period." },
    he: { events: "אירועים", event: "אירוע", all: "הכול", search: "חיפוש", open: "פתיחה", close: "סגירה", menu: "תפריט", ask: "שאלו את המעקב", method: "שיטה", fullTracker: "למעקב המלא", direct: "ישיר", indirect: "עקיף", danger: "סכנה", impact: "השפעה", sources: "מקורות", seeAll: "הצג הכול", source: "מקור", illustrative: "צילום להמחשה בלבד, לא מהאירועים ברשימה.", live: "המעקב החי", ladder: "רמות למעלה/למטה", timeline: "ציר הזמן", tempo: "קצב", plot: "תרשים", filterSide: "סינון לפי צד", noRows: "אין אירועים תואמים בתקופה זו." },
  };

  let lang = "en";
  try {
    const saved = localStorage.getItem("uk-ru-lang");
    if (saved === "he" || saved === "en") lang = saved;
  } catch (e) {}

  const listeners = [];

  function apply() {
    document.documentElement.lang = lang;
    document.documentElement.dir = "ltr";
    if (document.body) document.body.dir = "ltr";
    document.querySelectorAll("[data-lang-btn]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.langBtn === lang)));
    listeners.forEach((fn) => fn(lang));
  }

  function initLang(onChange) {
    listeners.push(onChange);
    document.querySelectorAll("[data-lang-btn]").forEach((b) =>
      b.addEventListener("click", () => {
        lang = b.dataset.langBtn;
        try { localStorage.setItem("uk-ru-lang", lang); } catch (e) {}
        apply();
      })
    );
    apply();
  }

  const t = (k) => WORDS[lang][k] ?? WORDS.en[k] ?? k;
  const ev = (e) => e[lang] ?? e.en;
  const count = (n) => `${n} ${n === 1 ? t("event") : t("events")}`;
  const sideCode = (e) => U.ui[lang].sides[e.side];
  const sideTag = (e) => `<span class="side side--${e.side}">${esc(sideCode(e))}</span>`;
  const ringMark = (e) => `<span class="ring${e.direct ? "" : " ring--indirect"}" role="img" aria-label="${esc(e.direct ? t("direct") : t("indirect"))}" title="${esc(e.direct ? t("direct") : t("indirect"))}"></span>`;
  const sourcesHtml = (e) =>
    e.sources.length
      ? `<p class="mono muted">${esc(t("sources"))}</p><p>${e.sources.map((s) => `<a href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a>`).join(" · ")}</p>`
      : "";
  const whyHtml = (e, label) =>
    `<details class="why"><summary>${esc(label ?? U.ui[lang].whyBtn)}</summary><div class="why__body"><p>${esc(ev(e).why)}</p>${sourcesHtml(e)}</div></details>`;

  window.UKRU_UI = {
    U, PHOTOS, photoFor, DOMAIN_PHOTO, img, url, credit, creditInner, PHASES, phaseRows, phaseLabel, mean, esc,
    initLang, t, ev, count, sideTag, ringMark, whyHtml, sourcesHtml,
    get lang() { return lang; },
  };
})();
