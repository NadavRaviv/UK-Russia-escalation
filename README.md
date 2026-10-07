# UK–Russia escalation timeline, Feb–Oct 2026

An open-source-intelligence audit of 39 dated events on the British–Russian thread, presented as a single self-contained HTML page in English and Hebrew.

The page exists to test a hypothesis, not to assert it: that British military involvement in Ukraine — in particular concealed drone strikes on Russian territory — forms part of an undisclosed shift in defence posture. Everything below is written so a reader can check that hypothesis against the record and find it wanting if it deserves to be.

## Design skills (Hallmark + motion)

**[Hallmark](https://github.com/Nutlope/hallmark)** is the default design skill for this repo (layout, typography, anti-slop UI). Cursor loads it via `.cursor/rules/hallmark-design.mdc`. UK–Russia pages share tokens in `uk-russia-tokens.css`.

Install or refresh Hallmark:

```bash
npx skills add nutlope/hallmark
```

Use the same command in **other repositories** where you want Hallmark; copy `.cursor/rules/hallmark-design.mdc` (or adapt it) so agents always read `.agents/skills/hallmark/SKILL.md` before UI work.

This repo also includes [Emil Kowalski’s agent skills](https://github.com/emilkowalski/skills) under `.agents/skills/` (design engineering, `animate`, animation review). Refresh them with:

```bash
npx skills@latest add emilkowalski/skills
```

## Running it

Open `uk-russia-merged-timeline.html` in a browser. There is no build step and no dependency beyond Google Fonts, loaded from a CDN — so the page needs network access for its typefaces, and every visitor makes a request to Google. Self-host the fonts or swap in a system stack if that matters for your deployment.

## Netlify deploy

`netlify.toml` publishes the repo root (static HTML, no build). Link once, then deploy:

```bash
npx netlify login
npx netlify link --git-remote-url https://github.com/NadavRaviv/UK-Russia-escalation
npx netlify deploy --prod
```

**GitHub Actions:** add repository secrets `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`, then pushes to `main` run `.github/workflows/netlify.yml` (same static publish as `netlify.toml`).

If the site is connected to Git in the Netlify dashboard, pushes to `main` can also trigger automatic production deploys without the workflow.

## GitHub Pages deploy

Pushes to `main` run `.github/workflows/pages.yml` and publish the static site (includes `uk-russia-tokens.css`).

**One-time setup (repo owner):** GitHub → **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Live URL after the first successful run: **https://nadavraviv.github.io/UK-Russia-escalation/**

If the workflow fails with a Pages permission error, re-enable Pages in Settings and ensure Actions is allowed to deploy to the `github-pages` environment.

## What is on the page

**39 events**, 1 February to 1 October 2026. 24 Russian, 13 British or western, 2 third-party (both American). 35 distinct source domains; 14 rows carry two sources; 2 rows carry three; 1 row carries four; 1 row carries none.

Three encodings, deliberately kept separate:

| Encoding | Carries | Values |
|---|---|---|
| Flag in the marker | Who acted | Union flag, Russian tricolour, Stars and Stripes |
| Ring colour | Whether Britain is the named object | red (30 rows), green (9 rows) |
| Band card | How directly Britain is named | four levels, 13 / 12 / 7 / 7 rows |

Reading two of them as one thing is the main way to misread the page.

## The colour rule

**Red — direct link.** The event names Britain, or acts against British ships, staff, territory or equipment.

**Green — no direct link.** The documented driver lies elsewhere: Ukraine broadly, NATO, Washington, or a domestic British matter. Any British connection is inferred rather than stated.

This is a test about the *target* of a signal, not its *direction*. A Russian statement that de-escalates still codes red if it is about Britain — the 1 September row, where Moscow calls the ambassador's departure routine, is exactly that case. **The red count is not an escalation score.**

Two earlier timelines fed this one and graded on different definitions. The British-side set coded for a link to the escalation thesis; the Russian-side set coded for whether a signal named Britain. Those are different questions, and only the second can be checked against a source rather than against a hypothesis. The merged set applies the second rule throughout. No row changed grade under it.

## The bands

The one axis here that is a judgement rather than a fact on the record. The test is how explicitly Britain is the object of a signal — *not* how alarming the content is. The top band adds a second cut: the named object sits under a strike threat or a concealed act.

1. **Britain not named** (13 rows, 1 Feb – 28 Sep) — background, structural, or deliberately concealed. The 27 July decree (No. 526, in force 1 August) and the 28 September decree sit here: each raises an authorised ceiling on the Russian armed forces, and neither names Britain.
2. **Britain named, routine** (12 rows, 30 Mar – 1 Oct) — diplomatic and naval friction inside ordinary statecraft. Notified gunnery and diplomat rows stay here. So do the two 16 September British military-leadership statements, and the 26 September report of drone sightings over nuclear sites. That row names Britain and treats the sightings as surveillance friction: no strike target is declared, and the Russia link is an expert's view, not an official attribution. The 1 October sanctions package sits here as well: it names Russia, and the act is a legal measure rather than a strike threat.
3. **A consequence is stated** (7 rows, 15 Aug – 29 Sep) — Britain is warned it will pay, nothing specific named as at risk. The 29 September post from the London embassy sits here: any British or NATO military action against Russian territory would be met with "all means... including nuclear weapons," and no British object is named.
4. **A specific object, hostile or concealed** (7 rows, 9 Apr – 13 Sep) — a particular British thing is named as the object (a factory, a military site, a stretch of UK water, or a named person) and the act is a strike threat or concealment. The set is the 9 April submarine operation, the 25 August factory remark, the 27 August military-targets warning, Putin's 2 September refusal to rule British sites out, the 6 September AIS handshake, the 10 September Swindon sabotage charge, and the 13 September strike that Johnson's diplomatic train had just left.

The consequence of defining bands this way: an unannounced Russian nuclear exercise and an unannounced CIA trip to Moscow both sit in band 1, because neither names Britain, though both are more alarming than a diplomat expulsion in band 2. That is the rule working as intended, not a misfiling.

Note also that bands 2, 3 and 4 are entirely red and band 1 holds all nine green rows, plus four red ones. The band axis and the colour axis are measuring closely related things, so the bands add less independent information than four separate cards imply.

## The domains

A separate judgement from the bands: what kind of object is in play. Five cards. The test is the main subject of the row. A price tag on a weapons transfer, or a sanctions motive attached to an act at sea, stays on the card for that act.

1. **War infra** (11 rows, 5 Feb – 16 Sep) — army systems and the plants that make them. 5 Russian, 5 British, 1 American.
2. **War zones** (14 rows, 17 Feb – 28 Sep) — military geography: a front, a base, a stretch of water. 11 Russian, 2 British, 1 American. The 6 September AIS handshake stays here: the logged act is the identity swap off the British Isles.
3. **Civil infra** (4 rows, ~1 Feb – 10 Sep) — airports, courts, energy plants. 1 Russian, 3 British. The February refinery strikes, the NATS outage and the Swindon court case sit here.
4. **Civil zone** (9 rows, 30 Mar – 29 Sep) — cities and diplomatic space. 7 Russian, 2 British. No strike on London buildings is in this set.
5. **Money & sanctions** (1 row, 1 Oct) — sanctions packages, asset freezes, designations, enforcement, and other financial measures between Britain and Russia. The only row is the Foreign Office package of 31 measures. 1 British.

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

**Interval compression is partly an artefact of observation.** Mean gap between events is 10.8 days from February to 15 August and 2.4 days after. Some of that is real, but early rows are month-level estimates and structural events reported once, while late rows are discrete statements logged the day they were made. Attention rose after 15 August and the observation rate rose with it. Any timeline built from news crowds at its own end.

**Three rows carry approximate dates**, marked `~`. Intervals touching them are approximate too.

**Two rows are dated to disclosure rather than to the act.** The submarine operation ran over a month before 9 April and sits on the day Britain revealed it. The drone strikes run the other way — dated to February, with the August disclosure logged as a separate row. They cannot be compared without that in mind.

**One row rests on anonymous sourcing** from a single originating outlet (26 August, Kremlin sources via Bloomberg).

**Adjacency is not causation.** The gap badges measure elapsed time between logged events. They do not claim one caused the next.

**Absence is absence from the reporting.** The April drone package and the July jammer transfer drew no logged Russian response. That may mean no response occurred, or that none was captured.

**Live timestamps drift.** Relative times are computed from the visitor's browser clock, which suits a working document checked daily but not a fixed published artefact. Pin a reference date instead of `new Date()` if this is going up as a snapshot.

**The Union flag is simplified** at 18px — the diagonal counterchange is not rendered.

## Editing

Everything is in the one file. Events live in the `EVENTS` array; each row carries `date`, optional `approx`, `side` (`uk` / `ru` / `ot`), `rag` (`r` / `g`), `band` (1–4), `domain` (1–5), a `sources` array, and `en` / `he` objects holding `label`, `short`, `title` and `why`.

Statistics in the summary panel — mean gaps, counts, side split, band totals — are **hard-coded strings**, not computed. Adding or removing a row means recomputing them by hand or they will quietly go wrong.

## Provenance

Built with Claude (Anthropic). The flag graphics are original SVG renderings of public-domain designs. Quotations from news sources are short fragments under fair-dealing; the substance of every row is paraphrased, and the links go to the originals.
