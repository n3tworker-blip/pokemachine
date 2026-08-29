# Prize Images

Filenames here must match the `image` path in each prize entry in
`js/prizes.js` exactly (including case). If a file is missing or fails to
load, the kiosk automatically falls back to a colored placeholder with an
emoji, so the app keeps working while photos are still being gathered.

## `prizes/candy/`
- `Candy.png` — currently shared by all 5 candy prizes (Gummy Bears,
  Skittles, Bubble Gum, SweeTarts, Red Vines). Add a separate photo per
  candy type later by giving each its own file and updating the matching
  `image` path in `js/prizes.js`.

## `prizes/cards/`
- `PerfectOrder.png`
- `ChaosRising.png`
- `PitchBlack.png`

## `prizes/custom/`
- `SurpriseBag.png`

Square images around 500x500px on a plain/white background work best —
that's also what shows up in the scrolling background wall on the idle
screen.
