/* Shared top bar + statement footer for the UK–Russia site.
 * Page links, then the six angles: inline on a wide screen, “Choose your angle” on a narrow one.
 * Language changes the words only; the bar stays left to right.
 * Loaded after options-shared.js. Exposes window.UKRU_NAV.mount(opts). */
(function () {
  const { esc, t, initLang } = window.UKRU_UI;

  // A new screen opens at the top. Smooth scrolling would leave the previous position in view.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  function scrollPageTop() {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
  }

  const PAGES = [
    ["timeline", "./uk-russia-merged-timeline.html", "timeline"],
    ["plot", "./uk-russia-plot.html", "plot"],
  ];

  const ANGLES = [
    ["danger", "Dangers", "סכנה"],
    ["outline", "List", "רשימה"],
    ["kanban", "Bands", "רמות"],
    ["domain", "Domain", "תחום"],
    ["munger", "Surface Bias", "חשיפת הטיות"],
    ["ladder", "Levels", "רמות מעלה/מטה"],
  ];

  const LOCK = `<svg class="lock" viewBox="0 0 24 24" fill="currentColor" role="img"><path d="M17 8V7a5 5 0 0 0-10 0v1H5v14h14V8h-2zm-8 0V7a3 3 0 0 1 6 0v1H9z"/></svg>`;

  const COPY = {
    en: { timeline: "Timeline", plot: "Plot", statement: "Read the record.", angle: "Choose your angle", locked: "Locked" },
    he: { timeline: "ציר הזמן", plot: "תרשים", statement: "קראו את התיעוד.", angle: "בחרו זווית", locked: "נעול" },
  };

  const FLAG = {
    en: `<svg class="flag" viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="60" height="30" fill="#012169"/><path d="M0 0 60 30M60 0 0 30" stroke="#fff" stroke-width="7"/><path d="M0 0 60 30M60 0 0 30" stroke="#C8102E" stroke-width="3.5"/><path d="M30 0V30M0 15H60" stroke="#fff" stroke-width="11"/><path d="M30 0V30M0 15H60" stroke="#C8102E" stroke-width="6.5"/></svg>`,
    he: `<svg class="flag" viewBox="0 0 22 16" aria-hidden="true"><rect width="22" height="16" fill="#fff"/><rect y="1.2" width="22" height="2.4" fill="#0038b8"/><rect y="12.4" width="22" height="2.4" fill="#0038b8"/><path d="M11 3.4 14.1 8.7H7.9Z" fill="none" stroke="#0038b8" stroke-width="0.7"/><path d="M11 12.2 7.9 6.9h6.2Z" fill="none" stroke="#0038b8" stroke-width="0.7"/></svg>`,
  };

  const langButtons = `<button type="button" data-lang-btn="en" aria-pressed="true" aria-label="English" title="English">${FLAG.en}</button><button type="button" data-lang-btn="he" aria-pressed="false" aria-label="עברית" title="עברית" lang="he">${FLAG.he}</button>`;

  function mount(opts) {
    const current = opts.current;
    const langOf = opts.lang;
    const here = (key) => key === current;

    const header = document.createElement("header");
    header.className = "pill";
    header.id = "top";
    header.innerHTML = `<div class="pill__bar">
      <a class="pill__brand" href="./uk-russia-plot.html#top" id="siteBrand"></a>
      <div class="pill__group">
        <nav class="pill__links" id="siteLinks" aria-label="Pages"></nav>
        <nav class="pill__views" id="angleBar" aria-label="Angles"></nav>
      </div>
      <details class="dd" id="angleDd">
        <summary><span id="angleLabel"></span></summary>
        <div class="dd__menu" id="angleMenu"></div>
      </details>
      <div class="pill__tools">
        <button type="button" class="theme-toggle" id="themeToggle" aria-pressed="false">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 3v1.6M12 19.4V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.6M19.4 12H21M4.9 19.1 6 18M18 6l1.1-1.1"/></svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5z"/></svg>
        </button>
        <div class="lang" role="group" aria-label="Language">${langButtons}</div>
        <button type="button" class="pill__menu" id="siteMenuBtn" aria-expanded="false" aria-controls="siteSheet"></button>
      </div>
    </div>
    <div class="sheet" id="siteSheet" hidden>
      <nav id="siteSheetLinks" aria-label="Pages"></nav>
      <nav id="siteSheetAngles" aria-label="Angles"></nav>
      <div class="sheet__foot">
        <button type="button" class="theme-toggle" aria-pressed="false">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 3v1.6M12 19.4V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.6M19.4 12H21M4.9 19.1 6 18M18 6l1.1-1.1"/></svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5z"/></svg>
        </button>
        <div class="lang" role="group" aria-label="Language">${langButtons}</div>
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
      $("angleLabel").textContent = c.angle;
      const he = lang === "he";
      const active = (/^#view=([a-z]+)$/.exec(location.hash) || [])[1] || (here("timeline") ? "danger" : "");
      const angleLinks = ANGLES.map(([view, en, heLabel]) => {
        const label = he ? heLabel : en;
        const locked = view === "munger";
        const lock = locked
          ? LOCK.replace("<svg ", `<svg aria-label="${esc(c.locked)}" `)
          : "";
        const current = view === active ? ' aria-current="page"' : "";
        return `<a href="./uk-russia-merged-timeline.html#view=${view}"${current}${locked ? ` title="${esc(c.locked)}"` : ""}>${esc(label)}${lock}</a>`;
      }).join("");
      $("angleBar").innerHTML = angleLinks;
      $("angleMenu").innerHTML = angleLinks;
      $("siteSheetAngles").innerHTML = angleLinks;
      $("siteFooter").innerHTML = `<p class="statement__line">${esc(c.statement)}</p>
        <p class="statement__fine">Made by Grok Bot &amp; Cursor. Chef: <a href="https://www.nadav.agency" rel="noopener">Nadav Raviv</a></p>`;
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
    const angleDd = $("angleDd");
    angleDd.addEventListener("click", (e) => {
      if (e.target.closest("a")) angleDd.open = false;
    });
    document.addEventListener("click", (e) => {
      if (angleDd.open && !angleDd.contains(e.target)) angleDd.open = false;
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (angleDd.open) { angleDd.open = false; angleDd.querySelector("summary").focus(); }
      if (!sheet.hidden) { close(); btn.focus(); }
    });
    document.querySelectorAll(".theme-toggle").forEach((b) => {
      b.addEventListener("click", () => setTheme(!themeIsDark()));
    });
    if (!document.documentElement.getAttribute("data-theme")) {
      document.documentElement.setAttribute("data-theme", "light");
    }
    syncTheme();

    function measureNav() {
      const bottom = header.getBoundingClientRect().bottom;
      const clearance = Math.ceil(bottom + 16);
      document.documentElement.style.setProperty("--nav-clearance", clearance + "px");
    }

    initLang((lang) => {
      if (opts.onLang) opts.onLang(lang);
      paint();
      measureNav();
    });

    measureNav();
    header.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a) return;
      let url;
      try { url = new URL(a.getAttribute("href"), location.href); }
      catch (err) { return; }
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;
      scrollPageTop();
      requestAnimationFrame(scrollPageTop);
    });
    window.addEventListener("hashchange", () => {
      paint();
      measureNav();
      const hash = location.hash || "";
      if (hash === "#top" || /^#view=[a-z]+$/.test(hash)) {
        scrollPageTop();
        requestAnimationFrame(scrollPageTop);
      }
    });
    window.addEventListener("resize", measureNav);
    if (window.ResizeObserver) new ResizeObserver(measureNav).observe(header);
  }

  window.UKRU_NAV = { mount, angles: ANGLES };
})();
