// PokeMachine kiosk logic: inventory-aware prize selection + reveal animation.
// Prize data/quantities live in prizes.js — this file shouldn't need edits for day-to-day tuning.

const POKEBALL_SOUND_SRC = "sounds/pokeball-open.wav";
// Safety net only: if the sound can't play (missing file, browser blocks it), reveal anyway
// after this long so the kiosk never gets stuck spinning.
const SPIN_FALLBACK_MS = 6000;
const REVEAL_AUTO_RESET_MS = 10000;
const CONFETTI_COUNT = 40;
const CONFETTI_COLORS = ["#ffcb05", "#ee1515", "#3b6cff", "#ff5da2", "#f5f5f5"];
const SCROLL_LANE_COUNT = 7;
const SCROLL_LANE_MIN_DURATION_S = 18;
const SCROLL_LANE_MAX_DURATION_S = 32;

const idleScreen = document.getElementById("idle-screen");
const revealScreen = document.getElementById("reveal-screen");
const prizeButton = document.getElementById("prize-button");
const pokeball = document.getElementById("pokeball");
const resetButton = document.getElementById("reset-button");
const revealImage = document.getElementById("reveal-image");
const revealPlaceholder = document.getElementById("reveal-placeholder");
const revealName = document.getElementById("reveal-name");
const confettiLayer = document.getElementById("confetti-layer");
const scrollBg = document.getElementById("scroll-bg");

const pokeballSound = new Audio(POKEBALL_SOUND_SRC);
pokeballSound.preload = "auto";

let revealAutoResetTimer = null;

const INVENTORY_STORAGE_KEY = `pokemachine-inventory:${INVENTORY_SESSION}`;

// { spins: total taps so far, given: { [prizeId]: count handed out } }
function loadInventory() {
  try {
    const saved = JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY));
    if (saved && typeof saved.spins === "number" && saved.given) return saved;
  } catch (e) {}
  return { spins: 0, given: {} };
}

function saveInventory(inventory) {
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
  } catch (e) {}
}

function remainingQuantity(prize, inventory) {
  return Math.max(prize.quantity - (inventory.given[prize.id] || 0), 0);
}

// Odds model is documented at the top of prizes.js.
function pickPrize(prizes, inventory) {
  const inStock = prizes.filter((p) => p.quantity !== null && remainingQuantity(p, inventory) > 0);
  const unlimited = prizes.filter((p) => p.quantity === null);

  const limitedLeft = inStock.reduce((sum, p) => sum + remainingQuantity(p, inventory), 0);
  const guestsLeft = Math.max(EXPECTED_GUESTS - inventory.spins, 1);
  // Once guests outnumber expectations (or stock outnumbers guests), this goes to 0 and
  // the remaining limited stock is handed out before more unlimited prizes.
  const unlimitedShare = unlimited.length ? Math.max(guestsLeft - limitedLeft, 0) / unlimited.length : 0;

  const entries = [
    ...inStock.map((p) => ({ prize: p, weight: remainingQuantity(p, inventory) })),
    ...unlimited.map((p) => ({ prize: p, weight: unlimitedShare })),
  ].filter((e) => e.weight > 0);

  // Only reachable if every prize is limited and all are gone.
  if (!entries.length) return unlimited[0] || prizes[0];

  const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) return entry.prize;
  }
  return entries[entries.length - 1].prize;
}

function awardPrize() {
  const inventory = loadInventory();
  const prize = pickPrize(PRIZES, inventory);
  inventory.spins += 1;
  inventory.given[prize.id] = (inventory.given[prize.id] || 0) + 1;
  saveInventory(inventory);
  return prize;
}

function renderPrizeVisual(prize) {
  revealImage.hidden = true;
  revealPlaceholder.className = "reveal-placeholder";

  const img = new Image();
  img.onload = () => {
    revealImage.src = prize.image;
    revealImage.alt = prize.name;
    revealImage.hidden = false;
    revealPlaceholder.hidden = true;
  };
  img.onerror = () => {
    revealPlaceholder.hidden = false;
    revealPlaceholder.classList.add(prize.category);
    revealPlaceholder.textContent = prize.emoji || "🎉";
  };
  img.src = prize.image;
}

function createScrollThumb(prize) {
  const thumb = document.createElement("div");
  thumb.className = "scroll-thumb";

  const img = new Image();
  img.alt = "";
  img.onerror = () => {
    thumb.classList.add("placeholder", prize.category);
    thumb.textContent = prize.emoji || "🎉";
  };
  img.onload = () => thumb.appendChild(img);
  img.src = prize.image;

  return thumb;
}

function createScrollLane() {
  const lane = document.createElement("div");
  lane.className = "scroll-lane";

  const shuffled = [...PRIZES].sort(() => Math.random() - 0.5);
  // Render the shuffled sequence twice back-to-back so translating the lane
  // by exactly half its height loops it seamlessly.
  for (let copy = 0; copy < 2; copy++) {
    for (const prize of shuffled) {
      lane.appendChild(createScrollThumb(prize));
    }
  }

  const duration = SCROLL_LANE_MIN_DURATION_S + Math.random() * (SCROLL_LANE_MAX_DURATION_S - SCROLL_LANE_MIN_DURATION_S);
  lane.style.animationDuration = `${duration}s`;
  // A negative delay starts the lane already mid-scroll so lanes don't all launch in sync.
  lane.style.animationDelay = `-${Math.random() * duration}s`;

  return lane;
}

function buildScrollBackground() {
  for (let i = 0; i < SCROLL_LANE_COUNT; i++) {
    scrollBg.appendChild(createScrollLane());
  }
}

function spawnConfetti() {
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
    piece.style.animationDelay = `${Math.random() * 0.3}s`;
    confettiLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function showIdleScreen() {
  clearTimeout(revealAutoResetTimer);
  revealScreen.classList.add("hidden");
  idleScreen.classList.remove("hidden");
  prizeButton.disabled = false;
}

function showRevealScreen(prize) {
  renderPrizeVisual(prize);
  revealName.textContent = prize.name;
  idleScreen.classList.add("hidden");
  revealScreen.classList.remove("hidden");
  spawnConfetti();
  revealAutoResetTimer = window.setTimeout(showIdleScreen, REVEAL_AUTO_RESET_MS);
}

function runPrizeSequence() {
  prizeButton.disabled = true;
  pokeball.classList.add("spinning");

  let revealed = false;
  const revealOnce = () => {
    if (revealed) return;
    revealed = true;
    pokeballSound.removeEventListener("ended", revealOnce);
    pokeball.classList.remove("spinning");
    const prize = awardPrize();
    showRevealScreen(prize);
  };

  // The reveal is timed to the sound finishing, so the prize appears right as the
  // Pokéball "pops" open. If the sound can't play, the fallback timer below covers it.
  pokeballSound.currentTime = 0;
  pokeballSound.addEventListener("ended", revealOnce, { once: true });
  pokeballSound.play().catch(() => {});

  window.setTimeout(revealOnce, SPIN_FALLBACK_MS);
}

prizeButton.addEventListener("click", runPrizeSequence);
resetButton.addEventListener("click", showIdleScreen);

buildScrollBackground();
