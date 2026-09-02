# UK–Russia escalation timeline, Feb–Sep 2026

An open-source-intelligence audit of 28 dated events on the British–Russian thread, presented as a single self-contained HTML page in English and Hebrew.

The page exists to test a hypothesis, not to assert it: that British military involvement in Ukraine — in particular concealed drone strikes on Russian territory — forms part of an undisclosed shift in defence posture. Everything below is written so a reader can check that hypothesis against the record and find it wanting if it deserves to be.

## Running it

Open `uk-russia-merged-timeline.html` in a browser. There is no build step and no dependency beyond Google Fonts, loaded from a CDN — so the page needs network access for its typefaces, and every visitor makes a request to Google. Self-host the fonts or swap in a system stack if that matters for your deployment.

## What is on the page

**28 events**, 1 February to 2 September 2026. 17 Russian, 9 British or western, 2 third-party (both American). 24 distinct source domains; 8 rows carry two sources; 1 row carries none.

Three encodings, deliberately kept separate:

| Encoding | Carries | Values |
|---|---|---|
| Flag in the marker | Who acted | Union flag, Russian tricolour, Stars and Stripes |
| Ring colour | Whether Britain is the named object | red (20 rows), green (8 rows) |
| Band card | How directly Britain is named | four levels, 10 / 9 / 6 / 3 rows |

Reading two of them as one thing is the main way to misread the page.

## The colour rule

**Red — direct link.** The event names Britain, or acts against British ships, staff, territory or equipment.

**Green — no direct link.** The documented driver lies elsewhere: Ukraine broadly, NATO, Washington, or a domestic British matter. Any British connection is inferred rather than stated.

This is a test about the *target* of a signal, not its *direction*. A Russian statement that de-escalates still codes red if it is about Britain — the 1 September row, where Moscow calls the ambassador's departure routine, is exactly that case. **The red count is not an escalation score.**

Two earlier timelines fed this one and graded on different definitions. The British-side set coded for a link to the escalation thesis; the Russian-side set coded for whether a signal named Britain. Those are different questions, and only the second can be checked against a source rather than against a hypothesis. The merged set applies the second rule throughout. No row changed grade under it.

## The bands

The one axis here that is a judgement rather than a fact on the record. The test is how explicitly Britain is the object of a signal — *not* how alarming the content is.

1. **Britain not named** (10 rows, 1 Feb – 25 Aug) — background, structural, or deliberately concealed.
2. **Britain named, routine** (9 rows, 30 Mar – 1 Sep) — diplomatic and naval friction inside ordinary statecraft.
3. **A consequence is stated** (6 rows, 15 Aug – 26 Aug) — Britain is warned it will pay, nothing specific named as at risk.
4. **A target is named** (3 rows, 25 Aug – 2 Sep) — the object that could be struck is specified, and it is on British soil.

The consequence of defining bands this way: an unannounced Russian nuclear exercise and an unannounced CIA trip to Moscow both sit in band 1, because neither names Britain, though both are more alarming than a diplomat expulsion in band 2. That is the rule working as intended, not a misfiling.

Note also that bands 2, 3 and 4 are entirely red and band 1 holds eight of the nine green rows. The band axis and the colour axis are measuring closely related things, so the bands add less independent information than four separate cards imply.

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

**Interval compression is partly an artefact of observation.** Mean gap between events is 11.5 days from February to 15 August and 1.8 days after. Some of that is real, but early rows are month-level estimates and structural events reported once, while late rows are discrete statements logged the day they were made. Attention rose after 15 August and the observation rate rose with it. Any timeline built from news crowds at its own end.

**Three rows carry approximate dates**, marked `~`. Intervals touching them are approximate too.

**Two rows are dated to disclosure rather than to the act.** The submarine operation ran over a month before 9 April and sits on the day Britain revealed it. The drone strikes run the other way — dated to February, with the August disclosure logged as a separate row. They cannot be compared without that in mind.

**One row rests on anonymous sourcing** from a single originating outlet (26 August, Kremlin sources via Bloomberg).

**Adjacency is not causation.** The gap badges measure elapsed time between logged events. They do not claim one caused the next.

**Absence is absence from the reporting.** The April drone package and the July jammer transfer drew no logged Russian response. That may mean no response occurred, or that none was captured.

**Live timestamps drift.** Relative times are computed from the visitor's browser clock, which suits a working document checked daily but not a fixed published artefact. Pin a reference date instead of `new Date()` if this is going up as a snapshot.

**The Union flag is simplified** at 18px — the diagonal counterchange is not rendered.

## Editing

Everything is in the one file. Events live in the `EVENTS` array; each row carries `date`, optional `approx`, `side` (`uk` / `ru` / `ot`), `rag` (`r` / `g`), `band` (1–4), a `sources` array, and `en` / `he` objects holding `label`, `short`, `title` and `why`.

Statistics in the summary panel — mean gaps, counts, side split, band totals — are **hard-coded strings**, not computed. Adding or removing a row means recomputing them by hand or they will quietly go wrong.

## Provenance

Built with Claude (Anthropic). The flag graphics are original SVG renderings of public-domain designs. Quotations from news sources are short fragments under fair-dealing; the substance of every row is paraphrased, and the links go to the originals.
