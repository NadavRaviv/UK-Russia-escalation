# UK–Russia escalation timeline, Feb–Sep 2026

An open-source-intelligence audit of 31 dated events on the British–Russian thread, presented as a single self-contained HTML page in English and Hebrew.

The page exists to test a hypothesis, not to assert it: that British military involvement in Ukraine — in particular concealed drone strikes on Russian territory — forms part of an undisclosed shift in defence posture. Everything below is written so a reader can check that hypothesis against the record and find it wanting if it deserves to be.

## Running it

Open `uk-russia-merged-timeline.html` in a browser. There is no build step and no dependency beyond Google Fonts, loaded from a CDN — so the page needs network access for its typefaces, and every visitor makes a request to Google. Self-host the fonts or swap in a system stack if that matters for your deployment.

## What is on the page

**31 events**, 1 February to 10 September 2026. 19 Russian, 10 British or western, 2 third-party (both American). 29 distinct source domains; 9 rows carry two sources; 2 rows carry three; 1 row carries none.

Three encodings, deliberately kept separate:

| Encoding | Carries | Values |
|---|---|---|
| Flag in the marker | Who acted | Union flag, Russian tricolour, Stars and Stripes |
| Ring style | Whether Britain is the named object | solid (22 rows), dashed (9 rows) |
| Band card | How directly Britain is named | four levels, 11 / 8 / 6 / 6 rows |
| Domain card | Kind of object in play | war infra / war zones / civil infra / civil zone |
| Danger plot | Alarm vs stakes | 1–10 each; UK blue, Russia red; slider keeps rows up to a date |

Reading two of them as one thing is the main way to misread the page.

On-page text is kept to short labels. The longer notes — how the marks are read, why the intervals compress, what each view is doing, and the method and caveats — sit behind the **Key**, **Tempo**, **About** and **Method** buttons, and each event's note behind its **Why** button.

## The ring rule

**Solid ring — direct link.** The event names Britain, or acts against British ships, staff, territory or equipment.

**Dashed ring — no direct link.** The documented driver lies elsewhere: Ukraine broadly, NATO, Washington, or a domestic British matter. Any British connection is inferred rather than stated.

This is a test about the *target* of a signal, not its *direction*. A Russian statement that de-escalates still takes a solid ring if it is about Britain — the 1 September row, where Moscow calls the ambassador's departure routine, is exactly that case. **The solid-ring count is not an escalation score.**

The grading deliberately carries no hue. Red was doing three jobs on this page — the direct-link grade, Russian dots on the Danger plot, and the compressed interval figure — and a reader will collapse three jobs into "red means Russia" or "red means bad". Red is now reserved for Russia. Grading moved to ring style, which is also legible without colour vision, and the interval scale moved to the gold accent that already carries dates and time everywhere else on the page.

Two earlier timelines fed this one and graded on different definitions. The British-side set coded for a link to the escalation thesis; the Russian-side set coded for whether a signal named Britain. Those are different questions, and only the second can be checked against a source rather than against a hypothesis. The merged set applies the second rule throughout. No row changed grade under it.

## The bands

The one axis here that is a judgement rather than a fact on the record. The test is how explicitly Britain is the object of a signal — *not* how alarming the content is. The top band adds a second cut: the named object sits under a strike threat or a concealed act.

1. **Britain not named** (11 rows, 1 Feb – 8 Sep) — background, structural, or deliberately concealed.
2. **Britain named, routine** (8 rows, 30 Mar – 1 Sep) — diplomatic and naval friction inside ordinary statecraft. Notified gunnery and diplomat rows stay here.
3. **A consequence is stated** (6 rows, 15 Aug – 26 Aug) — Britain is warned it will pay, nothing specific named as at risk.
4. **A specific object, hostile or concealed** (6 rows, 9 Apr – 10 Sep) — a particular British thing is named as the object (a factory, a military site, or a stretch of UK water) and the act is a strike threat or concealment. The 9 April submarine operation, the 6 September AIS handshake and the 10 September Swindon drone-plant case sit here with the late-August and 2 September strike-threat rows.

The consequence of defining bands this way: an unannounced Russian nuclear exercise and an unannounced CIA trip to Moscow both sit in band 1, because neither names Britain, though both are more alarming than a diplomat expulsion in band 2. That is the rule working as intended, not a misfiling.

Note also that bands 2, 3 and 4 are entirely solid-ring and band 1 holds eight of the nine dashed rows. The band axis and the grading axis are measuring closely related things, so the bands add less independent information than four separate cards imply.

A third grouping, on the **Domain** tab, cuts the same 31 rows by the kind of object in play rather than by how Britain is named:

1. **War infra** — army systems and the plants that make them.
2. **War zones** — a front, a base, or a stretch of naval water.
3. **Civil infra** — airports, courts, energy plants. The NATS outage and the Swindon court case sit here.
4. **Civil zone** — cities, capitals, diplomatic space. No strike on London buildings is in this set.

A fourth grouping, on the **Danger** tab, plots the same rows as a scatter: vertical is how alarming the act is (high at the top), horizontal is how large the stakes are if it lands (high to the right). Both axes are a 1–10 judgement, independent of the band test. Dots are blue for British or western acts, red for Russian, grey for the two American rows. A date slider — with a play control that runs it forward — keeps every row up to the date you stop on, so the cloud can be read as a path.

Hovering a point gives its actor, date and short title; clicking one pins a card under the plot with the danger and impact scores, the band, and a Why button for the full note. A circle marks the newest row on screen and a square the pinned one, and both are named in the key.

The Danger tab is the page's lead view, because the question most readers arrive with is whether the signal is hardening. Four figures sit above the plot: mean danger and mean impact across the rows on screen, the count, and **drift** — the combined danger-plus-impact mean of the five most recent rows minus that of the five before them. Positive drift, shown in red, means the recent cluster sits higher and further right than the one before it. A yellow cross marks the centre of those five most recent rows and a faint line traces where that centre has been; the tinted corner is danger 7+ against impact 7+.

A **View** dropdown above the plot reads the same rows from one army's point of view. A British or western act is danger to Russia; a Russian act is danger to Britain:

| View | Shows | Rows |
|---|---|---|
| All events | every row | 31 |
| Danger to UK | Russian acts and statements | 19 |
| Danger to Russia | British or western acts | 10 |

The two American rows sit outside both points of view and appear only under *All events*. Filtering recomputes the four readouts, the marker and the trail against that side alone, and narrows the drift window from five rows to three — a single side holds a third of the set, so a five-row window would not resolve until the end of the period. The date axis stays fixed across views so switching does not move the slider.

This is where the merged set earns its keep. Over the full window, drift across all 31 rows is mildly *negative*, but drift on the Russian rows alone is strongly positive: the two sides are moving differently, and the combined figure hides it.

Both the drift window and the tinted corner are arbitrary cuts chosen to make a turn visible, not thresholds with any external meaning. The point-of-view split is a judgement about who an act endangers, not a claim about intent.

## Sourcing standard

- **Verifiability over completeness.** Claims that could not be confirmed were dropped rather than kept with a caveat.
- **Primary over syndicated** where both exist. Several rows carry two sources because a better original was found later.
- **State media is labelled as such** (TASS).
- **Second-hand reporting is labelled as such** (FITSNews).
- **One row has no source.** The 6 August UK–Ukraine defence talks are marked as unsourced rather than attached to something adjacent.

### Dropped candidates

- A reported North Korean missile strike on Kyiv, 19–20 August 2026 — single outlet, second hand.
- A GRU-signature explosive drone found near a Ukrainian cargo aircraft in Germany, 27 August 2026 — single outlet, second hand.
- A Telegraph report of 8 August 2026 — could not be confirmed.
- A Russian munition detonating on Polish territory, 29 July 2026 — removed as not relevant to the British thread. Its removal cost the set one of its stronger green examples, which is worth knowing when reading how thin the green side now looks.

### Unresolved date conflicts

Kept visible rather than silently resolved:

- Fedorov's remark on British factories: CBS dates it 25 August, the Independent to around the 24th. On the earlier dating it falls the same day as the Kyiv announcement rather than after it, which weakens any sequential reading.
- The CIA trip to Moscow: the Guardian says Tuesday, other outlets Wednesday.
- The embassy warning: logged 17 August, carried by Reuters on the 18th.
- The Sarmat launch: Defense News 12 May, GlobalSecurity 13 May.

## Known limits

**Interval compression is partly an artefact of observation.** Mean gap between events is 11.5 days from February to 15 August and 2.0 days after. Some of that is real, but early rows are month-level estimates and structural events reported once, while late rows are discrete statements logged the day they were made. Attention rose after 15 August and the observation rate rose with it. Any timeline built from news crowds at its own end.

**Three rows carry approximate dates**, marked `~`. Intervals touching them are approximate too.

**Two rows are dated to disclosure rather than to the act.** The submarine operation ran over a month before 9 April and sits on the day Britain revealed it. The drone strikes run the other way — dated to February, with the August disclosure logged as a separate row. They cannot be compared without that in mind.

**One row rests on anonymous sourcing** from a single originating outlet (26 August, Kremlin sources via Bloomberg).

**Adjacency is not causation.** The gap badges measure elapsed time between logged events. They do not claim one caused the next.

**Absence is absence from the reporting.** The April drone package and the July jammer transfer drew no logged Russian response. That may mean no response occurred, or that none was captured.

**Live timestamps drift.** Relative times are computed from the visitor's browser clock, which suits a working document checked daily but not a fixed published artefact. Pin a reference date instead of `new Date()` if this is going up as a snapshot.

**The Union flag is simplified** at 18px — the diagonal counterchange is not rendered.

## Editing

Everything is in the one file. Events live in the `EVENTS` array; each row carries `date`, optional `approx`, `side` (`uk` / `ru` / `ot`), `rag` (`r` / `g`), `band` (1–4), `domain` (1 war infra / 2 war zones / 3 civil infra / 4 civil zone), `danger` and `impact` (1–10), a `sources` array, and `en` / `he` objects holding `label`, `short`, `title` and `why`.

Statistics in the strip under the header — mean gaps, longest-to-shortest, side split — and the counts in the legend chips are **hard-coded strings**, not computed. Adding or removing a row means recomputing them by hand or they will quietly go wrong. The Danger readouts and the band totals *are* computed from `EVENTS`.

## Provenance

Built with Claude (Anthropic). The flag graphics are original SVG renderings of public-domain designs. Quotations from news sources are short fragments under fair-dealing; the substance of every row is paraphrased, and the links go to the originals.
