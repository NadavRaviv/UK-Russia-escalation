/* A/B typography for redesign-options: default (current) vs calm (13-rule pass). */
(function () {
  const KEY = "uk-ru-typography";
  const VALID = new Set(["default", "calm"]);

  function readQuery() {
    try {
      const v = new URLSearchParams(location.search).get("typography");
      return VALID.has(v) ? v : null;
    } catch (e) {
      return null;
    }
  }

  function readSaved() {
    try {
      const v = localStorage.getItem(KEY);
      return VALID.has(v) ? v : null;
    } catch (e) {
      return null;
    }
  }

  function mode() {
    const q = readQuery();
    if (q) return q;
    const saved = readSaved();
    if (saved) return saved;
    /* Better Typography: calm is default; ?typography=default forces Current. */
    return "calm";
  }

  function apply(m) {
    const root = document.documentElement;
    if (m === "calm") root.setAttribute("data-typography", "calm");
    else root.removeAttribute("data-typography");
    document.querySelectorAll("[data-type-ab]").forEach((b) => {
      const on = b.dataset.typeAb === m;
      b.setAttribute("aria-pressed", String(on));
    });
  }

  function persist(m) {
    try {
      localStorage.setItem(KEY, m);
    } catch (e) {}
    const url = new URL(location.href);
    if (m === "calm") url.searchParams.set("typography", "calm");
    else url.searchParams.delete("typography");
    history.replaceState(null, "", url);
    apply(m);
  }

  apply(mode());

  function mountLab() {
    if (document.getElementById("type-lab")) return;
    const lab = document.createElement("div");
    lab.id = "type-lab";
    lab.className = "type-lab";
    lab.setAttribute("role", "group");
    lab.setAttribute("aria-label", "Typography comparison");
    lab.innerHTML =
      '<p class="type-lab__label">Type scale</p>' +
      '<button type="button" class="type-lab__btn" data-type-ab="default">Current</button>' +
      '<button type="button" class="type-lab__btn" data-type-ab="calm">Calm</button>';
    document.body.appendChild(lab);
    lab.querySelectorAll("[data-type-ab]").forEach((b) => {
      b.addEventListener("click", () => persist(b.dataset.typeAb));
    });
    apply(mode());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountLab);
  else mountLab();
})();