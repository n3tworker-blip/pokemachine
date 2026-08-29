// Prize catalog for the PokeMachine kiosk.
//
// Add/remove/edit prizes here. Each prize needs:
//   id       - unique string, no spaces
//   name     - shown to kids on the reveal screen
//   category - "cards" | "candy" | "custom" (controls the accent color; add more in style.css if needed)
//   weight   - relative odds. Odds of winning = weight / (sum of all weights).
//              e.g. candy items sum to 55 and cards sum to 30, so candy as a whole is ~1.8x as
//              likely as cards, and the custom pack (5) is rare by comparison.
//   image    - path to the prize image. Drop matching files into images/prizes/<category>/
//              using the exact filenames below. If a file is missing, a colored placeholder
//              with the emoji below is shown instead so the app never breaks with a broken image.
//   emoji    - fallback glyph used until you add real product photos.
//
// This same list also feeds the scrolling background wall on the idle screen (see js/app.js).

const PRIZES = [
  // --- Candy --- (sharing one bucket photo for now until per-candy photos are added)
  { id: "candy-gummy-bears", name: "Gummy Bears", category: "candy", weight: 12, image: "images/prizes/candy/Candy.png", emoji: "🐻" },
  { id: "candy-skittles", name: "Skittles", category: "candy", weight: 12, image: "images/prizes/candy/Candy.png", emoji: "🌈" },
  { id: "candy-bubble-gum", name: "Bubble Gum", category: "candy", weight: 11, image: "images/prizes/candy/Candy.png", emoji: "🫧" },
  { id: "candy-sweettarts", name: "SweeTarts", category: "candy", weight: 10, image: "images/prizes/candy/Candy.png", emoji: "⭐" },
  { id: "candy-red-vines", name: "Red Vines", category: "candy", weight: 10, image: "images/prizes/candy/Candy.png", emoji: "🍭" },

  // --- Pokémon TCG: Mega Evolution series card packs ---
  { id: "cards-perfect-order", name: "Perfect Order Pack", category: "cards", weight: 10, image: "images/prizes/cards/PerfectOrder.png", emoji: "✨" },
  { id: "cards-chaos-rising", name: "Chaos Rising Pack", category: "cards", weight: 10, image: "images/prizes/cards/ChaosRising.png", emoji: "🌀" },
  { id: "cards-pitch-black", name: "Pitch Black Pack", category: "cards", weight: 10, image: "images/prizes/cards/PitchBlack.png", emoji: "⚫" },

  // --- Custom ---
  { id: "custom-prize-pack", name: "Surprise Bag", category: "custom", weight: 5, image: "images/prizes/custom/SurpriseBag.png", emoji: "🎁" },
];
