# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project purpose

PokeMachine is a touchscreen kiosk app for a Halloween trunk-or-treat event
(October 2026). Kids tap a Pokéball button on a touchscreen monitor and get a
randomly selected prize (Pokémon card pack, candy, or a custom prize pack).
Limited prizes have fixed stock quantities and are spread across the
expected guest count; once a prize runs out it can't be picked. It runs on-site as a static page
opened full-screen in a browser (e.g. `chrome --kiosk`) — no backend, no
build step, no installed runtime beyond a browser.

## Running it

No build/install step. Serve the directory statically and open `index.html`:

```bash
python3 -m http.server 8934
# then open http://localhost:8934/index.html
```

For the actual event, launch the browser in kiosk mode against that file/URL
so there's no address bar or way to navigate away.

There is no test suite, linter, or package.json — keep it that way unless a
real need for tooling shows up; the whole point is zero moving parts on event
day.

## Architecture

Three plain files, no framework, no bundler:

- `js/prizes.js` — the prize catalog (`PRIZES` array: id, name, category,
  quantity (`null` = unlimited), image path, emoji fallback), plus
  `EXPECTED_GUESTS` and `INVENTORY_SESSION`, currently 6 items (1 generic candy
  prize, 3 Pokémon TCG card packs, 1 surprise bag, 1 custom card pack). **This is
  the file to edit
  when changing stock or adding/removing prizes** — `js/app.js` should not need
  changes for day-to-day catalog updates. This same array also drives the
  idle-screen scrolling background (see below), so adding a prize here adds
  it to both places automatically.
- `js/app.js` — kiosk state machine: inventory-aware random pick
  (`pickPrize`/`awardPrize`, given-out counts saved to `localStorage`), the idle → spin → reveal → reset flow, confetti,
  image-load-with-emoji-fallback (`renderPrizeVisual`), and the scrolling
  background wall (`buildScrollBackground`/`createScrollLane`, generates
  several vertical lanes of shuffled, duplicated prize thumbnails that
  loop via CSS animation). Two screens (`#idle-screen`, `#reveal-screen`)
  are toggled via a `.hidden` class rather than routing. The reveal screen
  auto-returns to idle after `REVEAL_AUTO_RESET_MS` (10s) if nobody taps
  "Tap for Next Prize" — same `showIdleScreen()` path either way. Tapping the
  Pokéball plays `sounds/pokeball-open.wav`, and the reveal is timed to that
  sound's `ended` event (not a fixed delay) so the prize appears right as the
  sound finishes; `SPIN_FALLBACK_MS` (6s) is a safety net in case the sound
  can't play, so the kiosk never gets stuck spinning.
- `css/style.css` — all visuals: white background theme, the `.content-panel`
  frosted-glass card that holds the title/button/reveal content above the
  scrolling background, the Pokéball button/spin animation, confetti
  keyframes, and per-category placeholder tint colors used both by the
  reveal screen (`.reveal-placeholder.candy/cards/custom`) and the
  scrolling thumbnails (`.scroll-thumb.placeholder.candy/cards/custom`).

Staff inventory screen: press and hold the idle-screen title for 5s
(`ADMIN_HOLD_MS`) to open `#admin-screen`, which shows total taps, recent tap
rates (from the `tapTimes` timestamps saved with the inventory), and each
prize's given/left counts and current win chance (`prizeOdds`). It closes via
its button or after `ADMIN_AUTO_CLOSE_MS` (60s) so it isn't left up for kids.

Odds model: on each tap, a limited prize's chance = remaining quantity /
(`EXPECTED_GUESTS` - taps so far); unlimited prizes (candy) split the rest.
Sold-out prizes get zero chance. Taps and given-out counts persist in
`localStorage` under a key that includes `INVENTORY_SESSION` — change that
value to reset counts (e.g. after testing). See the comment block at the top
of `js/prizes.js` — that comment is the source of truth for how to add
prizes.

## Prize images

Real product photos go in `images/prizes/<category>/` (`cards/`, `candy/`,
`custom/`), at the exact filenames listed in `images/README.md`, referenced
by path from each prize's `image` field in `js/prizes.js`. If an image is
missing or fails to load, `app.js` falls back to a colored placeholder using
the prize's `emoji` field — the app is designed to keep working before/while
real photos are added.

Images must be the user's own photos of physical cards/candy — do not fetch
or embed official Pokémon TCG card scans or candy brand photography from the
web; that's Pokémon Company/brand-owned artwork, not something to source or
reproduce here.

## Sound

`sounds/pokeball-open.wav` plays when the Pokéball is tapped. Keep new sound
effects in `.wav` — a prior `.m4a` recording was served with an incorrect
Content-Type (`audio/mp4a-latm`) by Python's `http.server`, which Chrome
silently refuses to decode (the `<audio>` element just stalls at
`readyState 0` forever, no error event). `.wav` sidesteps this since its MIME
type (`audio/x-wav` / `audio/wav`) is unambiguous on every server.
