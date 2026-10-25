import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  EVENTS,
  isOnTopic,
  MAX_QUERY,
  TIMEOUT_MS,
  RATE_LIMIT,
  findDates,
  matchEvents,
  extractSearchText,
  formatEventsAnswer,
  resetRateLimit,
  cogneeSearch,
  default as handler,
} from "../netlify/functions/ask.mjs";

function post(body, ip = "203.0.113.10") {
  return handler(
    new Request("http://local/.netlify/functions/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    { ip }
  );
}

test("the shipped index is the 40 timeline rows, in order", () => {
  const html = fs.readFileSync("uk-russia-merged-timeline.html", "utf8");
  const start = html.indexOf("const EVENTS = ");
  const end = html.indexOf("\n];\n", start);
  const pageEvents = Function(html.slice(start, end + 3) + "\nreturn EVENTS;")();
  assert.equal(pageEvents.length, 40);
  assert.equal(EVENTS.length, 40);
  assert.deepEqual(EVENTS.map((event) => event.date), pageEvents.map((event) => event.date));
  assert.equal(EVENTS.filter((event) => event.date === "2026-09-29").length, 1);
  assert.ok(EVENTS.some((event) => event.date === "2026-09-29" && /nuclear/i.test(event.en.title)));
});

test("the page keeps six view tabs and the Hebrew standfirst", () => {
  const html = fs.readFileSync("uk-russia-merged-timeline.html", "utf8");
  for (const id of ["btn-danger", "btn-kanban", "btn-domain", "btn-outline", "btn-munger", "btn-ladder"]) {
    assert.equal(html.includes('id="' + id + '"'), true, id);
  }
  assert.match(html, /קצב האירועים גדל פי 3\.4/);
  assert.equal((html.match(/date:"2026-/g) || []).length, 40);
  assert.equal(html.includes("COGNEE_API_KEY"), false);
});

test("dates normalise to DD MON YYYY and default the year to 2026", () => {
  assert.deepEqual(
    findDates("What happened on 29 September?").map((date) => date.lexical),
    ["29 SEP 2026"]
  );
  assert.deepEqual(findDates("2026-09-29").map((date) => date.iso), ["2026-09-29"]);
  assert.deepEqual(findDates("29/09/2026").map((date) => date.iso), ["2026-09-29"]);
  assert.deepEqual(findDates("September 29, 2026").map((date) => date.lexical), ["29 SEP 2026"]);
  assert.deepEqual(findDates("1 October").map((date) => date.lexical), ["01 OCT 2026"]);
  assert.deepEqual(findDates("29th of September 2026").map((date) => date.lexical), ["29 SEP 2026"]);
  assert.deepEqual(
    findDates("מה קרה ב-29 בספטמבר?").map((date) => date.lexical),
    ["29 SEP 2026"]
  );
});

test("a bare may is not a date, and a real May day is", () => {
  assert.deepEqual(findDates("what may Britain do next"), []);
  assert.deepEqual(findDates("12 May 2026").map((date) => date.lexical), ["12 MAY 2026"]);
  assert.equal(findDates("during September").length, 1);
  assert.equal(findDates("during September")[0].kind, "month");
});

test("29 September matches the embassy row and keeps same-day siblings", () => {
  const dates = findDates("29 September");
  const rows = matchEvents(dates);
  assert.equal(rows.length, 1);
  assert.match(rows[0].en.title, /nuclear|embassy/i);
  const sameDay = matchEvents(findDates("16 September 2026"));
  assert.ok(sameDay.length >= 2);
  const answer = formatEventsAnswer(rows, dates, "en");
  assert.match(answer, new RegExp("Event " + rows[0].n));
  assert.match(answer, /29 September 2026/);
});

test("search text is read from the Cognee search_result shape", () => {
  assert.deepEqual(extractSearchText([{ search_result: ["answer"] }]), ["answer"]);
  assert.deepEqual(extractSearchText([{ search_result: "one" }, { search_result: ["two"] }]), ["one", "two"]);
});

test("a date question calls CHUNKS_LEXICAL then answers from the row", async () => {
  resetRateLimit();
  process.env.COGNEE_API_KEY = "test-key";
  let seen;
  const original = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    seen = { url, headers: init.headers, body: JSON.parse(init.body) };
    return new Response(JSON.stringify([{ search_result: ["this chunk has the wrong day"] }]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  try {
    const res = await post({ query: "What happened on 29 September?", lang: "en" }, "203.0.113.21");
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.mode, "date");
    assert.equal(seen.body.searchType, "CHUNKS_LEXICAL");
    assert.equal(seen.body.query, "29 SEP 2026");
    assert.deepEqual(seen.body.datasetIds, ["273e953f-f5d6-5fb1-bebd-6a2f8fa16480"]);
    assert.equal(seen.body.topK, 10);
    assert.equal(seen.headers["X-Api-Key"], "test-key");
    assert.equal(seen.headers["X-Tenant-Id"], "ba9f1350-42b5-4c28-8271-a5c3c0c558c8");
    assert.equal(seen.headers["Content-Type"], "application/json");
    assert.match(String(seen.url), /\/api\/v1\/search$/);
    assert.match(body.answer, /29 September 2026/);
    assert.doesNotMatch(body.answer, /wrong day/);
    assert.equal(body.events.length, 1);
    assert.equal(body.events[0].date, "2026-09-29");
  } finally {
    globalThis.fetch = original;
    delete process.env.COGNEE_API_KEY;
  }
});

test("a question without a date uses GRAPH_COMPLETION and the original wording", async () => {
  resetRateLimit();
  process.env.COGNEE_API_KEY = "test-key";
  const original = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    const body = JSON.parse(init.body);
    assert.equal(body.searchType, "GRAPH_COMPLETION");
    assert.match(body.query, /^Who expelled the British diplomat\?\n/);
    assert.match(body.query, /only from the UK–Russia escalation timeline/);
    return new Response(JSON.stringify([{ search_result: ["Russia expelled a British diplomat on 30 March."] }]), {
      status: 200,
    });
  };
  try {
    const res = await post({ query: "Who expelled the British diplomat?" }, "203.0.113.22");
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.mode, "graph");
    assert.match(body.answer, /30 March/);
    assert.ok(body.events.some((event) => event.date === "2026-03-30"));
  } finally {
    globalThis.fetch = original;
    delete process.env.COGNEE_API_KEY;
  }
});

test("limits: 300 characters, per-IP rate, 15 second timeout, missing key", async () => {
  assert.equal(MAX_QUERY, 300);
  assert.equal(TIMEOUT_MS, 15000);
  resetRateLimit();
  process.env.COGNEE_API_KEY = "test-key";
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify([{ search_result: ["ok"] }]), { status: 200 });
  try {
    const long = await post({ query: "a".repeat(301) }, "203.0.113.30");
    assert.equal(long.status, 400);
    assert.equal((await long.json()).error, "too_long");

    const empty = await post({ query: "   " }, "203.0.113.31");
    assert.equal(empty.status, 400);

    const ip = "203.0.113.32";
    for (let i = 0; i < RATE_LIMIT; i += 1) {
      const res = await post({ query: "Who acted?" }, ip);
      assert.equal(res.status, 200);
    }
    const blocked = await post({ query: "Who acted?" }, ip);
    assert.equal(blocked.status, 429);
    assert.ok(blocked.headers.get("Retry-After"));
  } finally {
    globalThis.fetch = original;
    delete process.env.COGNEE_API_KEY;
  }

  resetRateLimit();
  delete process.env.COGNEE_API_KEY;
  const missing = await post({ query: "Who acted?" }, "203.0.113.33");
  assert.equal(missing.status, 503);
  assert.equal((await missing.json()).error, "unconfigured");
});

test("Cognee calls stop at 15 seconds", async () => {
  process.env.COGNEE_API_KEY = "test-key";
  const original = globalThis.fetch;
  let aborted = false;
  globalThis.fetch = (url, init) => new Promise((resolve, reject) => {
    const giveUp = setTimeout(() => reject(new Error("signal did not abort")), 500);
    init.signal.addEventListener("abort", () => {
      aborted = true;
      clearTimeout(giveUp);
      const err = new Error("timed out");
      err.name = "TimeoutError";
      reject(err);
    });
  });
  try {
    await cogneeSearch("Who acted?", "GRAPH_COMPLETION", { timeoutMs: 30 });
    assert.fail("expected a timeout");
  } catch (err) {
    assert.equal(err.code, "timeout");
    assert.equal(aborted, true);
  } finally {
    globalThis.fetch = original;
    delete process.env.COGNEE_API_KEY;
  }
});

test("a date question still answers from the rows when Cognee is not configured", async () => {
  resetRateLimit();
  delete process.env.COGNEE_API_KEY;
  const res = await post({ query: "2026-10-01", lang: "he" }, "203.0.113.40");
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.mode, "date");
  assert.equal(body.cognee, "unconfigured");
  assert.equal(body.events[0].date, "2026-10-01");
  assert.match(body.answer, /אירוע/);
  assert.match(body.answer, /סנקצי/);
});

test("off-topic questions are refused locally, on-topic ones reach Cognee", async () => {
  for (const q of [
    "What is the capital of Peru?",
    "Give me a recipe for pancakes",
    "Write a poem about cats",
    "Who won the football?",
    "מתכון לפנקייק",
    "איך מכינים עוגת גבינה?",
  ]) assert.equal(isOnTopic(q), false, q);
  for (const q of [
    "Which events involve drones?",
    "Who expelled the British diplomat?",
    "What did Putin say about British sites?",
    "What happened most recently?",
    "How dangerous is the latest row?",
    "Which side has more events?",
    "אילו אירועים קשורים לסנקציות?",
    "מה אמר פוטין על אתרים בריטיים?",
    "מה האירוע האחרון?",
  ]) assert.equal(isOnTopic(q), true, q);

  resetRateLimit();
  process.env.COGNEE_API_KEY = "test-key";
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return new Response(JSON.stringify([{ search_result: ["OFF_TOPIC"] }]), { status: 200 });
  };
  try {
    const res = await post({ query: "Give me a recipe for pancakes" }, "203.0.113.40");
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.mode, "offtopic");
    assert.equal(calls, 0);
    assert.match(body.answer, /UK–Russia escalation record only/);

    const he = await (await post({ query: "מתכון לפנקייק", lang: "he" }, "203.0.113.41")).json();
    assert.equal(he.mode, "offtopic");
    assert.match(he.answer, /בריטניה לרוסיה/);

    const viaCognee = await (await post({ query: "Which events involve drones?" }, "203.0.113.42")).json();
    assert.equal(calls, 1);
    assert.equal(viaCognee.mode, "offtopic");
  } finally {
    globalThis.fetch = original;
    delete process.env.COGNEE_API_KEY;
  }
});
