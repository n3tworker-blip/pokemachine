// Prize catalog for the PokeMachine kiosk.
//
// Add/remove/edit prizes here. Each prize needs:
//   id       - unique string, no spaces (also the key its given-out count is saved under)
//   name     - shown to kids on the reveal screen
//   category - "cards" | "candy" | "custom" (controls the accent color; add more in style.css if needed)
//   quantity - how many you have on hand, or null for unlimited (candy).
//   image    - path to the prize image. Drop matching files into images/prizes/<category>/
//              using the exact filenames below. If a file is missing, a colored placeholder
//              with the emoji below is shown instead so the app never breaks with a broken image.
//   emoji    - fallback glyph used until you add real product photos.
//
// How the odds work (see pickPrize in js/app.js):
//   On every tap, each limited prize's chance = (how many are left) / (guests still expected),
//   where guests still expected = EXPECTED_GUESTS - taps so far. Unlimited prizes split
//   whatever chance is left over. This spreads the limited stock evenly across the whole
//   night instead of running out early. A prize with 0 left can never be picked.
//   Once taps reach EXPECTED_GUESTS, only unlimited prizes (candy) can be won.
//
// Given-out counts are saved in the browser (localStorage) so they survive a page reload
// or browser restart. To start counting from zero (e.g. after testing, before the event),
// change INVENTORY_SESSION to any new value.
//
// This same list also feeds the scrolling background wall on the idle screen (see js/app.js).

const EXPECTED_GUESTS = 500;
const INVENTORY_SESSION = "2026-trunk-or-treat";

const PRIZES = [
  // --- Candy --- (one generic prize covering all candy types, rather than naming each one)
  { id: "candy", name: "Candy", category: "candy", quantity: null, image: "images/prizes/candy/Candy.png", emoji: "🍬" },

  // --- Pokémon TCG card packs ---
  { id: "cards-perfect-order", name: "Perfect Order Pack", category: "cards", quantity: 6, image: "images/prizes/cards/PerfectOrder.png", emoji: "✨" },
  { id: "cards-journey-together", name: "Journey Together Pack", category: "cards", quantity: 2, image: "images/prizes/cards/JourneyTogether.png", emoji: "🤝" },
  { id: "cards-pitch-black", name: "Pitch Black Pack", category: "cards", quantity: 36, image: "images/prizes/cards/PitchBlack.png", emoji: "⚫" },

  // --- Custom ---
  { id: "custom-prize-pack", name: "Surprise Bag", category: "custom", quantity: 60, image: "images/prizes/custom/SurpriseBag.png", emoji: "🎁" },
  { id: "custom-card-pack", name: "Custom Pokémon Card Pack", category: "custom", quantity: 60, image: "images/prizes/custom/CustomCardPack.png", emoji: "🃏" },
];
