# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project purpose

PokeMachine is a touchscreen kiosk app for a Halloween trunk-or-treat event
(October 2026). Kids tap a Pokéball button on a touchscreen monitor and get a
randomly selected prize (Pokémon card pack, candy, or a custom prize pack),
with weighted odds so rare prizes stay rare. It runs on-site as a static page
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
  weight, image path, emoji fallback), currently 9 items (5 candy, 3 Pokémon
  TCG Mega Evolution card packs, 1 custom pack). **This is the file to edit
  when tuning odds or adding/removing prizes** — `js/app.js` should not need
  changes for day-to-day catalog updates. This same array also drives the
  idle-screen scrolling background (see below), so adding a prize here adds
  it to both places automatically.
- `js/app.js` — kiosk state machine: weighted random pick
  (`pickWeightedPrize`), the idle → spin → reveal → reset flow, confetti,
  image-load-with-emoji-fallback (`renderPrizeVisual`), and the scrolling
  background wall (`buildScrollBackground`/`createScrollLane`, generates
  several vertical lanes of shuffled, duplicated prize thumbnails that
  loop via CSS animation). Two screens (`#idle-screen`, `#reveal-screen`)
  are toggled via a `.hidden` class rather than routing.
- `css/style.css` — all visuals: white background theme, the `.content-panel`
  frosted-glass card that holds the title/button/reveal content above the
  scrolling background, the Pokéball button/spin animation, confetti
  keyframes, and per-category placeholder tint colors used both by the
  reveal screen (`.reveal-placeholder.candy/cards/custom`) and the
  scrolling thumbnails (`.scroll-thumb.placeholder.candy/cards/custom`).

Odds model: each prize has a `weight`; win probability = `weight / sum(all
weights)`. See the comment block at the top of `js/prizes.js` for the exact
mechanics — that comment is the source of truth for how to add prizes.

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
