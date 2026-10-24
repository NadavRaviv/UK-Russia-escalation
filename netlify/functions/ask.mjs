/**
 * Ask the tracker — Cognee search for the UK–Russia timeline.
 * The API key is read from the environment only. It is never sent to the browser.
 *
 * Date questions are answered from the shipped event rows. Graph search gets
 * those wrong, so a date in the question first runs CHUNKS_LEXICAL with the
 * date normalised as "29 SEP 2026", then the reply is taken from the matching rows.
 */
import events from "./_shared/events.json" with { type: "json" };

if (!Array.isArray(events) || events.length !== 40) {
  throw new Error("events.json must contain the 40 timeline rows");
}

export const EVENTS = events;
export const MAX_QUERY = 300;
export const TIMEOUT_MS = 15000;
export const RATE_LIMIT = 10;
export const RATE_WINDOW_MS = 60 * 1000;

const DEFAULTS = {
  COGNEE_TENANT_ID: "ba9f1350-42b5-4c28-8271-a5c3c0c558c8",
  COGNEE_BASE_URL: "https://tenant-ba9f1350-42b5-4c28-8271-a5c3c0c558c8.aws.cognee.ai",
  COGNEE_DATASET_ID: "273e953f-f5d6-5fb1-bebd-6a2f8fa16480",
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTH_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_HE = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

const buckets = new Map();

export function resetRateLimit() {
  buckets.clear();
}

export function readEnv(name) {
  let value = "";
  try {
    if (typeof Netlify !== "undefined" && Netlify.env && typeof Netlify.env.get === "function") {
      value = Netlify.env.get(name) || "";
    }
  } catch (e) {
    value = "";
  }
  if (!value && typeof process !== "undefined" && process.env && process.env[name]) {
    value = process.env[name];
  }
  if (!value && DEFAULTS[name]) value = DEFAULTS[name];
  return value;
}

export function clientIp(req, context) {
  if (context && typeof context.ip === "string" && context.ip.trim()) return context.ip.trim();
  const nf = req.headers && req.headers.get ? req.headers.get("x-nf-client-connection-ip") : "";
  if (nf && nf.trim()) return nf.trim();
  return "unknown";
}

export function checkRateLimit(ip, now = Date.now()) {
  const key = ip || "unknown";
  const start = now - RATE_WINDOW_MS;
  let stamps = (buckets.get(key) || []).filter((t) => t > start);
  if (stamps.length >= RATE_LIMIT) {
    buckets.set(key, stamps);
    const retryAfter = Math.max(1, Math.ceil((stamps[0] + RATE_WINDOW_MS - now) / 1000));
    return { ok: false, retryAfter };
  }
  stamps.push(now);
  buckets.set(key, stamps);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => t <= start)) buckets.delete(k);
    }
  }
  return { ok: true };
}

function monthAlt(names) {
  return names
    .slice()
    .sort((a, b) => b[0].length - a[0].length)
    .map(([name]) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
}

const EN_MONTHS = [
  ["september", 8], ["sept", 8], ["sep", 8],
  ["january", 0], ["jan", 0],
  ["february", 1], ["feb", 1],
  ["october", 9], ["oct", 9],
  ["november", 10], ["nov", 10],
  ["december", 11], ["dec", 11],
  ["august", 7], ["aug", 7],
  ["march", 2], ["mar", 2],
  ["april", 3], ["apr", 3],
  ["june", 5], ["jun", 5],
  ["july", 6], ["jul", 6],
  ["may", 4],
];

const EN_INDEX = new Map(EN_MONTHS.map(([name, index]) => [name, index]));
const EN_BARE = ["january", "february", "march", "april", "june", "july", "august", "september", "october", "november", "december"];

const HE_MONTHS = [
  ["בספטמבר", 8], ["ספטמבר", 8], ["ספט׳", 8], ["ספט'", 8],
  ["באוקטובר", 9], ["אוקטובר", 9], ["אוק׳", 9], ["אוק'", 9],
  ["בנובמבר", 10], ["נובמבר", 10], ["נוב׳", 10], ["נוב'", 10],
  ["בדצמבר", 11], ["דצמבר", 11], ["דצמ׳", 11], ["דצמ'", 11],
  ["באוגוסט", 7], ["אוגוסט", 7], ["אוג׳", 7], ["אוג'", 7],
  ["בפברואר", 1], ["פברואר", 1], ["פבר׳", 1], ["פבר'", 1],
  ["בינואר", 0], ["ינואר", 0], ["ינו׳", 0], ["ינו'", 0],
  ["באפריל", 3], ["אפריל", 3], ["אפר׳", 3], ["אפר'", 3],
  ["ביולי", 6], ["יולי", 6],
  ["ביוני", 5], ["יוני", 5],
  ["במרץ", 2], ["מרץ", 2],
  ["במאי", 4], ["מאי", 4],
];

const HE_INDEX = new Map(HE_MONTHS.map(([name, index]) => [name, index]));
const HE_SHORT = new Set(
  HE_MONTHS.filter(([name]) => name.includes("׳") || name.includes("'")).map(([name]) => name)
);

function validDay(year, month, day) {
  if (month < 0 || month > 11 || day < 1 || day > 31) return false;
  const dt = new Date(Date.UTC(year, month, day));
  return dt.getUTCFullYear() === year && dt.getUTCMonth() === month && dt.getUTCDate() === day;
}

function dayRecord(day, month, year) {
  return {
    kind: "day",
    year,
    month,
    day,
    iso: year + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0"),
    lexical: String(day).padStart(2, "0") + " " + MONTHS[month] + " " + year,
  };
}

function monthRecord(month, year) {
  return {
    kind: "month",
    year,
    month,
    iso: year + "-" + String(month + 1).padStart(2, "0"),
    lexical: MONTHS[month] + " " + year,
  };
}

function pushDate(found, taken, start, end, record) {
  if (taken.some(([s, e]) => start < e && end > s)) return;
  taken.push([start, end]);
  found.push(record);
}

/**
 * Pull dates out of a question. A missing year defaults to 2026.
 * "may" and short abbreviations count only beside a day or a year,
 * so ordinary words are not treated as months.
 */
export function findDates(text) {
  const src = String(text || "");
  const found = [];
  const taken = [];
  const enAlt = monthAlt(EN_MONTHS);
  const heAlt = monthAlt(HE_MONTHS);

  const isoRe = /(?<![0-9])(20\d{2})[-/.](0?[1-9]|1[0-2])[-/.](0?[1-9]|[12]\d|3[01])\b/g;
  for (const match of src.matchAll(isoRe)) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const span = [match.index, match.index + match[0].length];
    if (!validDay(year, month, day)) {
      taken.push(span);
      continue;
    }
    pushDate(found, taken, span[0], span[1], dayRecord(day, month, year));
  }

  const dmyRe = /(?<![0-9])(0?[1-9]|[12]\d|3[01])[./-](0?[1-9]|1[0-2])[./-](20\d{2})\b/g;
  for (const match of src.matchAll(dmyRe)) {
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const span = [match.index, match.index + match[0].length];
    if (!validDay(year, month, day)) {
      taken.push(span);
      continue;
    }
    pushDate(found, taken, span[0], span[1], dayRecord(day, month, year));
  }

  const dayMonthRe = new RegExp(
    `(?<![A-Za-z0-9])(\\d{1,2})(?:st|nd|rd|th)?(?:\\s+of)?\\s+(${enAlt})\\.?(?:\\s+(20\\d{2}))?(?![A-Za-z])`,
    "gi"
  );
  for (const match of src.matchAll(dayMonthRe)) {
    const day = Number(match[1]);
    const month = EN_INDEX.get(match[2].toLowerCase());
    const year = match[3] ? Number(match[3]) : 2026;
    if (month == null || !validDay(year, month, day)) continue;
    pushDate(found, taken, match.index, match.index + match[0].length, dayRecord(day, month, year));
  }

  const monthDayRe = new RegExp(
    `(?<![A-Za-z0-9])(${enAlt})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,)?(?:\\s+(20\\d{2}))?(?![A-Za-z0-9])`,
    "gi"
  );
  for (const match of src.matchAll(monthDayRe)) {
    const month = EN_INDEX.get(match[1].toLowerCase());
    const day = Number(match[2]);
    const year = match[3] ? Number(match[3]) : 2026;
    if (month == null || !validDay(year, month, day)) continue;
    pushDate(found, taken, match.index, match.index + match[0].length, dayRecord(day, month, year));
  }

  const heDayRe = new RegExp(
    `(?<![\\p{L}\\p{N}])(\\d{1,2})(?:\\s+ב)?\\s+(${heAlt})(?:\\s+(20\\d{2}))?(?![\\p{L}\\p{N}])`,
    "gu"
  );
  for (const match of src.matchAll(heDayRe)) {
    const day = Number(match[1]);
    const token = match[2];
    const month = HE_INDEX.get(token);
    const year = match[3] ? Number(match[3]) : 2026;
    if (month == null || !validDay(year, month, day)) continue;
    pushDate(found, taken, match.index, match.index + match[0].length, dayRecord(day, month, year));
  }

  const monthYearRe = new RegExp(
    `(?<![A-Za-z0-9])(${enAlt})\\.?(?:\\s+(20\\d{2}))(?![A-Za-z0-9])`,
    "gi"
  );
  for (const match of src.matchAll(monthYearRe)) {
    const name = match[1].toLowerCase();
    const month = EN_INDEX.get(name);
    const year = Number(match[2]);
    if (month == null) continue;
    pushDate(found, taken, match.index, match.index + match[0].length, monthRecord(month, year));
  }

  const heMonthYearRe = new RegExp(
    `(?<![\\p{L}\\p{N}])(${heAlt})(?:\\s+(20\\d{2}))(?![\\p{L}\\p{N}])`,
    "gu"
  );
  for (const match of src.matchAll(heMonthYearRe)) {
    const month = HE_INDEX.get(match[1]);
    const year = Number(match[2]);
    if (month == null) continue;
    pushDate(found, taken, match.index, match.index + match[0].length, monthRecord(month, year));
  }

  const bareRe = new RegExp(
    `(?<![A-Za-z0-9])(${EN_BARE.join("|")})(?![A-Za-z])`,
    "gi"
  );
  for (const match of src.matchAll(bareRe)) {
    const month = EN_INDEX.get(match[1].toLowerCase());
    if (month == null) continue;
    pushDate(found, taken, match.index, match.index + match[0].length, monthRecord(month, 2026));
  }

  const heBare = HE_MONTHS.filter(([name]) => !HE_SHORT.has(name) && name.length > 3);
  const heBareRe = new RegExp(
    `(?<![\\p{L}\\p{N}])(${monthAlt(heBare)})(?![\\p{L}\\p{N}])`,
    "gu"
  );
  for (const match of src.matchAll(heBareRe)) {
    const month = HE_INDEX.get(match[1]);
    if (month == null) continue;
    pushDate(found, taken, match.index, match.index + match[0].length, monthRecord(month, 2026));
  }

  const days = found.filter((item) => item.kind === "day");
  const kept = found.filter((item) => {
    if (item.kind !== "month") return true;
    return !days.some((day) => day.year === item.year && day.month === item.month);
  });

  const seen = new Set();
  const unique = [];
  for (const item of kept) {
    const key = item.kind + ":" + item.iso;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  return unique;
}

export function matchEvents(dates) {
  const out = [];
  const seen = new Set();
  for (const date of dates) {
    for (const event of EVENTS) {
      if (seen.has(event.n)) continue;
      const sameDay = date.kind === "day" && event.date === date.iso;
      const sameMonth = date.kind === "month" && event.date.slice(0, 7) === date.iso;
      if (sameDay || sameMonth) {
        seen.add(event.n);
        out.push(event);
      }
    }
  }
  return out;
}

export function extractSearchText(payload) {
  const out = [];
  const walk = (node) => {
    if (node == null) return;
    if (typeof node === "string") {
      const text = node.trim();
      if (text) out.push(text);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node === "object") {
      if ("search_result" in node) walk(node.search_result);
      else if (typeof node.text === "string") walk(node.text);
      else if (typeof node.content === "string") walk(node.content);
      else if (typeof node.answer === "string") walk(node.answer);
    }
  };
  walk(payload);
  return out;
}

function formatDay(date, lang) {
  if (lang === "he") return date.day + " ב" + MONTH_HE[date.month] + " " + date.year;
  return date.day + " " + MONTH_EN[date.month] + " " + date.year;
}

function formatMonth(date, lang) {
  if (lang === "he") return MONTH_HE[date.month] + " " + date.year;
  return MONTH_EN[date.month] + " " + date.year;
}

function describeWhen(dates, lang) {
  const joiner = lang === "he" ? " וגם " : " and ";
  return dates.map((date) => (date.kind === "day" ? formatDay(date, lang) : formatMonth(date, lang))).join(joiner);
}

export function formatEventsAnswer(matched, dates, lang) {
  const when = describeWhen(dates, lang);
  const onlyMonths = dates.every((date) => date.kind === "month");
  const count = matched.length;
  let lead;
  if (lang === "he") {
    const rows = count === 1 ? "שורה אחת" : count + " שורות";
    lead = onlyMonths
      ? "ב" + when + " יש במעקב " + rows + "."
      : "בתאריך " + when + " יש במעקב " + rows + ".";
  } else if (onlyMonths) {
    lead = when + " — " + count + (count === 1 ? " row" : " rows") + " in the tracker.";
  } else {
    lead = "On " + when + " the tracker has " + (count === 1 ? "one row" : count + " rows") + ".";
  }
  const blocks = matched.map((event) => {
    const copy = event[lang] || event.en;
    const head = (lang === "he" ? "אירוע " : "Event ") + event.n + " — " + copy.title;
    const approx = event.approx
      ? (lang === "he" ? "\nהתאריך בשורה זו משוער." : "\nThe date on this row is approximate.")
      : "";
    return head + "\n" + copy.why + approx;
  });
  return lead + "\n\n" + blocks.join("\n\n");
}

function formatNone(dates, lang) {
  const when = describeWhen(dates, lang);
  if (lang === "he") return "אין במעקב שורה בתאריך " + when + ".";
  return "The tracker has no row on " + when + ".";
}

function publicEvents(list, lang) {
  return list.map((event) => {
    const copy = event[lang] || event.en;
    return {
      n: event.n,
      date: event.date,
      approx: !!event.approx,
      label: copy.label,
      title: copy.title,
    };
  });
}

export async function cogneeSearch(query, searchType, options = {}) {
  const env = options.env || readEnv;
  const key = env("COGNEE_API_KEY");
  if (!key) {
    const err = new Error("COGNEE_API_KEY is not set");
    err.code = "unconfigured";
    throw err;
  }
  const base = String(env("COGNEE_BASE_URL") || DEFAULTS.COGNEE_BASE_URL).replace(/\/+$/, "");
  const tenant = env("COGNEE_TENANT_ID") || DEFAULTS.COGNEE_TENANT_ID;
  const dataset = env("COGNEE_DATASET_ID") || DEFAULTS.COGNEE_DATASET_ID;
  const timeoutMs = options.timeoutMs ?? TIMEOUT_MS;
  let res;
  try {
    res = await fetch(base + "/api/v1/search", {
      method: "POST",
      headers: {
        "X-Api-Key": key,
        "X-Tenant-Id": tenant,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        searchType,
        datasetIds: [dataset],
        topK: 10,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    if (err && (err.name === "TimeoutError" || err.name === "AbortError")) {
      const timeout = new Error("Cognee timed out");
      timeout.code = "timeout";
      timeout.name = "TimeoutError";
      throw timeout;
    }
    const failed = new Error("Cognee request failed");
    failed.code = "upstream";
    throw failed;
  }
  const raw = await res.text();
  if (!res.ok) {
    const err = new Error("Cognee returned " + res.status);
    err.code = "upstream";
    throw err;
  }
  let parsed;
  try {
    parsed = raw ? JSON.parse(raw) : [];
  } catch (e) {
    const err = new Error("Cognee returned unreadable JSON");
    err.code = "upstream";
    throw err;
  }
  return extractSearchText(parsed);
}

async function answerFromDates(dates, lang) {
  const lexical = [...new Set(dates.map((date) => date.lexical))].join(" ");
  let chunks = [];
  let cognee = "ok";
  try {
    chunks = await cogneeSearch(lexical, "CHUNKS_LEXICAL");
  } catch (err) {
    cognee = err && err.code ? err.code : "upstream";
  }
  const matched = matchEvents(dates);
  if (matched.length) {
    return {
      answer: formatEventsAnswer(matched, dates, lang),
      events: publicEvents(matched, lang),
      mode: "date",
      cognee,
    };
  }
  if (chunks.length) {
    return {
      answer: chunks.join("\n\n").slice(0, 4000),
      events: [],
      mode: "chunks",
      cognee: "ok",
    };
  }
  if (cognee !== "ok") {
    const err = new Error(cognee);
    err.code = cognee;
    if (cognee === "timeout") err.name = "TimeoutError";
    throw err;
  }
  return {
    answer: formatNone(dates, lang),
    events: [],
    mode: "date",
    cognee,
  };
}

async function answerFromGraph(query, lang) {
  const chunks = await cogneeSearch(query, "GRAPH_COMPLETION");
  const answer = chunks.join("\n\n").slice(0, 4000);
  const dates = findDates(query + "\n" + answer).filter((date) => date.kind === "day");
  const matched = matchEvents(dates);
  const text = answer || (lang === "he"
    ? "קוגני לא החזיר תשובה לשאלה הזו."
    : "Cognee returned no answer for that question.");
  return {
    answer: text,
    events: publicEvents(matched, lang),
    mode: "graph",
    cognee: "ok",
  };
}

function json(status, body, extra) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...(extra || {}),
    },
  });
}

const MESSAGES = {
  method: "Send a POST request with a JSON question.",
  bad_json: "The request body must be JSON.",
  empty: "The question is empty. Type a question about the timeline.",
  too_long: "That question is longer than 300 characters. Shorten it and ask again.",
  rate: "Too many questions from this connection. Wait a minute and try again.",
  timeout: "Cognee did not answer within 15 seconds. Try again.",
  unconfigured: "Ask the tracker is not configured on this deploy yet.",
  upstream: "Cognee did not return an answer. Try again in a moment.",
};

export default async function handler(req, context = {}) {
  if (!req || req.method !== "POST") {
    return json(405, { error: "method", message: MESSAGES.method });
  }
  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > 8000) {
    return json(413, { error: "too_long", message: MESSAGES.too_long });
  }
  let payload;
  try {
    payload = await req.json();
  } catch (e) {
    return json(400, { error: "bad_json", message: MESSAGES.bad_json });
  }
  const limit = checkRateLimit(clientIp(req, context));
  if (!limit.ok) {
    return json(429, { error: "rate", message: MESSAGES.rate }, { "Retry-After": String(limit.retryAfter) });
  }
  const raw = payload && typeof payload.query === "string" ? payload.query : "";
  const query = raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
  const lang = payload && payload.lang === "he" ? "he" : "en";
  if (!query) return json(400, { error: "empty", message: MESSAGES.empty });
  if ([...query].length > MAX_QUERY || query.length > MAX_QUERY) {
    return json(400, { error: "too_long", message: MESSAGES.too_long });
  }
  try {
    const dates = findDates(query);
    const body = dates.length ? await answerFromDates(dates, lang) : await answerFromGraph(query, lang);
    return json(200, body);
  } catch (err) {
    const code = err && err.code === "unconfigured"
      ? "unconfigured"
      : err && (err.code === "timeout" || err.name === "TimeoutError" || err.name === "AbortError")
        ? "timeout"
        : "upstream";
    const status = code === "unconfigured" ? 503 : code === "timeout" ? 504 : 502;
    return json(status, { error: code, message: MESSAGES[code] });
  }
}

export const config = {
  path: ["/.netlify/functions/ask", "/api/ask"],
};
