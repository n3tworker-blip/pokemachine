// Prize catalog for the PokeMachine kiosk.
//
// Add/remove/edit prizes here. Each prize needs:
//   id       - unique string, no spaces
//   name     - shown to kids on the reveal screen
//   category - "cards" | "candy" | "custom" (controls the accent color; add more in style.css if needed)
//   weight   - relative odds. Odds of winning = weight / (sum of all weights).
//              Candy's weight (5) matches the combined weight of the 3 card packs + surprise
//              bag (1 each = 4) plus a bit more, roughly preserving "candy is common" while
//              everything else stays uniform for testing. Swap these for real inventory-based
//              odds later - candy should get much higher weights than the sealed card
//              packs/surprise bags, which should be rare.
//   image    - path to the prize image. Drop matching files into images/prizes/<category>/
//              using the exact filenames below. If a file is missing, a colored placeholder
//              with the emoji below is shown instead so the app never breaks with a broken image.
//   emoji    - fallback glyph used until you add real product photos.
//
// This same list also feeds the scrolling background wall on the idle screen (see js/app.js).

const PRIZES = [
  // --- Candy --- (one generic prize covering all candy types, rather than naming each one)
  { id: "candy", name: "Candy", category: "candy", weight: 5, image: "images/prizes/candy/Candy.png", emoji: "🍬" },

  // --- Pokémon TCG: Mega Evolution series card packs ---
  { id: "cards-perfect-order", name: "Perfect Order Pack", category: "cards", weight: 1, image: "images/prizes/cards/PerfectOrder.png", emoji: "✨" },
  { id: "cards-chaos-rising", name: "Chaos Rising Pack", category: "cards", weight: 1, image: "images/prizes/cards/ChaosRising.png", emoji: "🌀" },
  { id: "cards-pitch-black", name: "Pitch Black Pack", category: "cards", weight: 1, image: "images/prizes/cards/PitchBlack.png", emoji: "⚫" },

  // --- Custom ---
  { id: "custom-prize-pack", name: "Surprise Bag", category: "custom", weight: 1, image: "images/prizes/custom/SurpriseBag.png", emoji: "🎁" },
];
