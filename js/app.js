// PokeMachine kiosk logic: weighted prize selection + reveal animation.
// Prize data/weights live in prizes.js — this file shouldn't need edits for day-to-day tuning.

const SPIN_DURATION_MS = 1400;
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

function pickWeightedPrize(prizes) {
  const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const prize of prizes) {
    roll -= prize.weight;
    if (roll <= 0) return prize;
  }
  return prizes[prizes.length - 1];
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
}

function runPrizeSequence() {
  prizeButton.disabled = true;
  pokeball.classList.add("spinning");

  window.setTimeout(() => {
    pokeball.classList.remove("spinning");
    const prize = pickWeightedPrize(PRIZES);
    showRevealScreen(prize);
  }, SPIN_DURATION_MS);
}

prizeButton.addEventListener("click", runPrizeSequence);
resetButton.addEventListener("click", showIdleScreen);

buildScrollBackground();
