const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
const bigWheel = document.getElementById("big-wheel");
const smallWheel = document.getElementById("small-wheel");
const bigArm = document.getElementById("big-arm");
const smallArm = document.getElementById("small-arm");

const ctx = canvas.getContext("2d");
const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
canvas.width = container.offsetWidth;
canvas.height = container.offsetHeight;
ctx.lineWidth = 1;
ctx.lineCap = "round";
ctx.strokeStyle = "rgba(255, 255, 255, 1)";
// ctx.setLineDash([1, 2]);
ctx.beginPath();

const aspectRatio = canvas.width / canvas.height;
const radius = ((aspectRatio > 1 ? canvas.height : canvas.width) - 40) / 4;
bigWheel.style.width = radius * 4 + "px";
bigArm.style.width = radius + "px";
bigArm.style.left = radius / 2 + "px";

smallWheel.style.width = radius * 2 + "px";
smallWheel.style.left = radius * 2 + "px";
smallArm.style.width = radius + "px";
smallArm.style.left = radius / 2 + "px";

let deg = 0;
let deg2 = 0;

let increment = 2;
let ratio = 3;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;

if (centerX % 2 != 0) {
  centerX += 0.5;
}

if (centerY % 2 != 0) {
  centerY += 0.5;
}

let timeout = null;
let interval = 10;

function move() {
  deg += increment;
  deg2 = deg * ratio;

  bigWheel.style.transform = `rotate(${deg}deg)`;
  smallWheel.style.transform = `rotate(${deg2 - deg}deg)`;

  const x = Math.cos(deg * (Math.PI / 180)) * radius;
  const y = Math.sin(deg * (Math.PI / 180)) * radius;
  const x2 = Math.cos(deg2 * (Math.PI / 180)) * radius;
  const y2 = Math.sin(deg2 * (Math.PI / 180)) * radius;
  ctx.lineTo(x + x2 + centerX, y + y2 + centerY);
  ctx.stroke();
  // ctx.beginPath();
}

function stop() {
  if (timeout) clearInterval(timeout);
}
function start() {
  stop();
  timeout = setInterval(move, interval);
}

const settingsIcon = document.getElementById("settings-icon");
const closeIcon = document.getElementById("close-icon");
const settings = document.getElementById("settings");
const speedSlider = document.getElementById("speed");
const ratioInput = document.getElementById("ratio");
const conceptBtn = document.getElementById("concept-btn");
const conceptBtnImg = document.getElementById("concept-btn-img");
const detailsRoot = document.getElementById("details-root");

let settingsOpen = false;
let paused = false;
let conceptOpen = false;

const togglePaused = () => {
  paused = !paused;
  if (!paused) start();
  else stop();
};

const toggleSettings = (val) => {
  settingsOpen = val == undefined ? !settingsOpen : val;

  if (settingsOpen) {
    settingsIcon.classList.remove("active-button");
    closeIcon.classList.add("active-button");
    settings.classList.add("active");
  } else {
    settingsIcon.classList.add("active-button");
    closeIcon.classList.remove("active-button");
    settings.classList.remove("active");
  }
};

const toggleConcept = () => {
  conceptOpen = !conceptOpen;

  if (conceptOpen) {
    conceptBtnImg.classList.add("active-img");
    detailsRoot.classList.add("active-details");
  } else {
    conceptBtnImg.classList.remove("active-img");
    detailsRoot.classList.remove("active-details");
  }
};

const changeSpeed = (newSpeed) => {
  interval = 500 / newSpeed;
};

const handleSubmit = (e) => {
  if (e) e.preventDefault();
  const newRatio = Number(ratioInput.value);
  const speed = Number(speedSlider.value);
  if (Number.isNaN(newRatio)) return;
  ratio = newRatio;
  changeSpeed(speed);
  stop();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  if (canvas.width < 1000) toggleSettings(false);
  start();
};

const handleSpeedChange = (e) => {
  changeSpeed(Number(e.target.value));
  start();
};

settingsIcon.addEventListener("click", () => toggleSettings());
closeIcon.addEventListener("click", () => toggleSettings());
settings.addEventListener("submit", handleSubmit);
speedSlider.addEventListener("change", handleSpeedChange);
window.addEventListener("click", (e) => {
  if (settingsIcon.contains(e.target)) return;
  if (closeIcon.contains(e.target)) return;
  if (!settings.contains(e.target)) toggleSettings(false);
});
container.addEventListener("click", (e) => {
  if (settingsOpen) return;
  togglePaused();
});
conceptBtn.addEventListener("click", toggleConcept);

function scaleNumber(x, x0, x1, y0, y1) {
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0); // returns y
}

// Selects a random number between two numbers a and b
function randNumBtw(a, b) {
  const rand = Math.random();
  return scaleNumber(rand, 0, 1, a, b);
}

const ratioSuggestions = [
  {
    label: "π",
    value: 3.141592653589793238462643383279502884197169399375105820974944592307816406286,
    id: "pi",
    description: "Pi",
  },
  {
    label: "ϕ",
    value: (1 + Math.sqrt(5)) / 2,
    id: "phi",
    description: "Golden ratio",
  },
  { label: "c", value: 299792458, id: "c", description: "Speed of light" },
  { label: "89", value: 89, id: "89", description: "89" },
  { label: "-2", value: -2, id: "-2", description: "-2" },
  { label: "62", value: 62, id: "62", description: "62" },
  {
    label: "rand int",
    value: () => Math.round(randNumBtw(0, 10000)),
    id: "random-int",
    description: "A random integer between 0 and 10000",
  },
  {
    label: "rand dec",
    value: () => randNumBtw(0, 10000),
    id: "random-dec",
    description: "A random decimal between 0 and 10000",
  },
  {
    label: "plus 1",
    value: () => ratio + 1,
    id: "plus-1",
    description: "Adds 1 to the current ratio",
  },
  {
    label: "minus 1",
    value: () => ratio - 1,
    id: "minus-1",
    description: "Subtracts 1 from the current ratio",
  },
];

const suggestionsRoot = document.getElementById("suggestions");
if (suggestionsRoot) {
  suggestionsRoot.innerHTML = ratioSuggestions
    .map(
      (suggestion) => `
    <span class="suggestion" id="sugg_${suggestion.id}" title="${suggestion.description}">${suggestion.label}</span>
  `
    )
    .join(" ");

  for (const suggestion of ratioSuggestions) {
    const el = document.getElementById("sugg_" + suggestion.id);
    if (el)
      el.addEventListener("click", (e) => {
        ratioInput.value =
          typeof suggestion.value === "function"
            ? suggestion.value()
            : suggestion.value;
        handleSubmit();
      });
  }
}

start();
