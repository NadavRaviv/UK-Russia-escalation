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
    en: { timeline: "Timeline", plot: "Plot", statement: "Read the record, then ask it a question.", ask: "Ask the tracker" },
    he: { timeline: "ציר הזמן", plot: "תרשים", statement: "קראו את התיעוד, ואז שאלו אותו שאלה.", ask: "שאלו את המעקב" },
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
      <div class="lang" role="group" aria-label="Language">
        <button type="button" data-lang-btn="en" aria-pressed="true">EN</button>
        <button type="button" data-lang-btn="he" aria-pressed="false" lang="he">עברית</button>
      </div>
      <button type="button" class="pill__menu" id="siteMenuBtn" aria-expanded="false" aria-controls="siteSheet"></button>
    </div>
    <div class="sheet" id="siteSheet" hidden>
      <nav id="siteSheetLinks" aria-label="Pages"></nav>
      <div class="sheet__foot">
        <div class="lang" role="group" aria-label="Language">
          <button type="button" data-lang-btn="en" aria-pressed="true">EN</button>
          <button type="button" data-lang-btn="he" aria-pressed="false" lang="he">עברית</button>
        </div>
        <a id="siteSheetAsk" href="./uk-russia-merged-timeline.html#ask"></a>
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
      $("siteSheetAsk").textContent = c.ask + " →";
      $("siteLinks").innerHTML = PAGES.map(
        ([key, base, label]) => `<a href="${hrefFor(key, base)}"${here(key) ? ' aria-current="page"' : ""}>${esc(c[label])}</a>`
      ).join("");
      $("siteSheetLinks").innerHTML = $("siteLinks").innerHTML;
      $("siteFooter").innerHTML = `<p class="statement__line">${esc(c.statement)}</p>
        <div class="statement__links">
          <a class="tlink" href="./uk-russia-merged-timeline.html#ask">${esc(c.ask)} →</a>
          <a class="tlink" href="./uk-russia-plot.html">${esc(c.plot)}</a>
          <a class="tlink" href="./uk-russia-ladder.html">${esc(t("ladder"))}</a>
        </div>`;
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

    initLang((lang) => {
      paint();
      if (opts.onLang) opts.onLang(lang);
    });
  }

  window.UKRU_NAV = { mount };
})();
