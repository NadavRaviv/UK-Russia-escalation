/* Shared top bar + statement footer for the UK–Russia site.
 * Timeline and Plot are the page links; the six angles live in the homepage hero.
 * Loaded after options-shared.js. Exposes window.UKRU_NAV.mount(opts). */
(function () {
  const { esc, t, initLang } = window.UKRU_UI;

  const PAGES = [
    ["timeline", "./uk-russia-merged-timeline.html", "timeline"],
    ["plot", "./uk-russia-plot.html", "plot"],
  ];

  const COPY = {
    en: { timeline: "Timeline", plot: "Plot", statement: "Read the record." },
    he: { timeline: "ציר הזמן", plot: "תרשים", statement: "קראו את התיעוד." },
  };

  function mount(opts) {
    const current = opts.current;
    const langOf = opts.lang;
    const here = (key) => key === current;

    const header = document.createElement("header");
    header.className = "pill";
    header.id = "top";
    header.innerHTML = `<div class="pill__bar">
      <a class="pill__brand" href="./uk-russia-plot.html#top" id="siteBrand"></a>
      <nav class="pill__links" id="siteLinks" aria-label="Pages"></nav>
      <div class="pill__tools">
        <button type="button" class="theme-toggle" id="themeToggle" aria-pressed="false">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 3v1.6M12 19.4V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.6M19.4 12H21M4.9 19.1 6 18M18 6l1.1-1.1"/></svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5z"/></svg>
        </button>
        <div class="lang" role="group" aria-label="Language">
          <button type="button" data-lang-btn="en" aria-pressed="true">EN</button>
          <button type="button" data-lang-btn="he" aria-pressed="false" lang="he">עברית</button>
        </div>
        <button type="button" class="pill__menu" id="siteMenuBtn" aria-expanded="false" aria-controls="siteSheet"></button>
      </div>
    </div>
    <div class="sheet" id="siteSheet" hidden>
      <nav id="siteSheetLinks" aria-label="Pages"></nav>
      <div class="sheet__foot">
        <button type="button" class="theme-toggle" aria-pressed="false">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 3v1.6M12 19.4V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.6M19.4 12H21M4.9 19.1 6 18M18 6l1.1-1.1"/></svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5z"/></svg>
        </button>
        <div class="lang" role="group" aria-label="Language">
          <button type="button" data-lang-btn="en" aria-pressed="true">EN</button>
          <button type="button" data-lang-btn="he" aria-pressed="false" lang="he">עברית</button>
        </div>
      </div>
    </div>`;

    const footer = document.createElement("footer");
    footer.className = "wrap statement";
    footer.id = "siteFooter";

    const skip = document.createElement("a");
    skip.className = "skip";
    skip.href = "#main";
    skip.textContent = "Skip to content";

    document.body.prepend(header);
    document.body.prepend(skip);
    document.body.append(footer);

    const $ = (id) => document.getElementById(id);
    const hrefFor = (key, base) => (here(key) ? "#top" : base);

    function paint() {
      const lang = langOf();
      const c = COPY[lang];
      $("siteBrand").textContent = lang === "he" ? "מיפוי הסלמת בריטניה–רוסיה" : "Mapping UK-Russia escalation";
      $("siteMenuBtn").textContent = t("menu");
      $("siteLinks").innerHTML = PAGES.map(
        ([key, base, label]) => `<a href="${hrefFor(key, base)}"${here(key) ? ' aria-current="page"' : ""}>${esc(c[label])}</a>`
      ).join("");
      $("siteSheetLinks").innerHTML = $("siteLinks").innerHTML;
      $("siteFooter").innerHTML = `<p class="statement__line">${esc(c.statement)}</p>
        <div class="statement__links">
          <a class="tlink" href="./uk-russia-plot.html">${esc(c.plot)}</a>
          <a class="tlink" href="./uk-russia-ladder.html">${esc(t("ladder"))}</a>
        </div>`;
      syncTheme();
    }

    function themeIsDark() {
      return document.documentElement.getAttribute("data-theme") === "dark";
    }

    function syncTheme() {
      const dark = themeIsDark();
      const he = document.documentElement.lang === "he";
      const label = dark
        ? (he ? "עבור למצב בהיר" : "Switch to light")
        : (he ? "עבור למצב כהה" : "Switch to dark");
      document.querySelectorAll(".theme-toggle").forEach((btn) => {
        btn.setAttribute("aria-label", label);
        btn.setAttribute("title", label);
        btn.setAttribute("aria-pressed", dark ? "true" : "false");
      });
    }

    function setTheme(dark) {
      const next = dark ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta) meta.setAttribute("content", next);
      try { localStorage.setItem("uk-ru-theme", next); } catch (e) {}
      syncTheme();
      try {
        const frame = document.getElementById("ladderFrame");
        if (frame && frame.contentWindow) frame.contentWindow.postMessage({ type: "uk-ru-theme", theme: next }, "*");
      } catch (e) {}
    }

    const btn = $("siteMenuBtn");
    const sheet = $("siteSheet");
    const close = () => { sheet.hidden = true; btn.setAttribute("aria-expanded", "false"); };
    btn.addEventListener("click", () => {
      const open = sheet.hidden;
      sheet.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    });
    sheet.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) { close(); btn.focus(); } });
    document.querySelectorAll(".theme-toggle").forEach((b) => {
      b.addEventListener("click", () => setTheme(!themeIsDark()));
    });
    if (!document.documentElement.getAttribute("data-theme")) {
      document.documentElement.setAttribute("data-theme", "light");
    }
    syncTheme();

    initLang((lang) => {
      paint();
      if (opts.onLang) opts.onLang(lang);
    });
  }

  window.UKRU_NAV = { mount };
})();
