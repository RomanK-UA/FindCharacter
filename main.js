// Constants
const numInput = document.getElementById('symbNum');
const backgroundColorPicker = document.getElementById('backgroundColorPicker');
const characterColorPicker = document.getElementById('characterColorPicker');
const characterSizePicker = document.getElementById('characterSizePicker');
const checker = document.myForm.turnOn;
const mainPad = document.getElementById('pad');
const aimPad = document.getElementById('aimPad');
const stopWatch = document.getElementById('stopWatch')

// Variables
let offset = 0;
let paused = true;
let auto = true;
let charColor;
let charSize;

// Event Listeners
backgroundColorPicker.addEventListener("input", updateBackgroundColor);
characterColorPicker.addEventListener("input", updateCharacterColor);
characterSizePicker.addEventListener("input", updateCharacterSize);
checker.addEventListener('change', toggleSettings);

// Event Listener Functions
function updateBackgroundColor(event) {
  mainPad.style.background = event.target.value;
}

function updateCharacterColor(event) {
  charColor = event.target.value;
}

function updateCharacterSize(event) {
  charSize = event.target.value;
}

function toggleSettings(event) {
  if (event.target.checked) {
    backgroundColorPicker.disabled = false;
    characterColorPicker.disabled = false;
    auto = false;
  } else {
    backgroundColorPicker.disabled = true;
    characterColorPicker.disabled = true;
    auto = true;
  }
}

// Stopwatch Functions 
function startStopwatch(evt) {
  if (paused) {
    paused = false;
    offset -= Date.now();
    render();
  }
}
function stopStopwatch(evt) {
  if (!paused) {
    paused = true;
    offset += Date.now();
    pressed = 1;
  }
}
function resetStopwatch(evt) {
  if (paused) {
    offset = 0;
    render();
  } else {
    offset = -Date.now();
  }
  stopWatch.style.backgroundColor = '#FE642E';
}
function format(value, scale, modulo, padding) {
  value = Math.floor(value / scale) % modulo;
  return value.toString().padStart(padding, 0);
}
function render() {
  var value = paused ? offset : Date.now() + offset;

  document.querySelector('#s_ms').textContent = format(value, 1, 1000, 3);
  document.querySelector('#s_seconds').textContent = format(value, 1000, 60, 2);
  document.querySelector('#s_minutes').textContent = format(value, 60000, 60, 2);
  
  if(!paused) {
    requestAnimationFrame(render);
  }
}
// Helper Functions
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomColor(backgroundColor) {
  let characterColor;
  do {
    characterColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  } while (characterColor === backgroundColor);
  return characterColor;
}
function getRandomCharacter() {
  return String.fromCharCode(random(33, 126));
}

function createSpanElement(text) {
  const newSpan = document.createElement("span");
  newSpan.innerHTML = text;
  return newSpan;
}
function stopRound() {
  stopStopwatch();
  stopWatch.style.backgroundColor = 'green';
}
// Main Function
function createTargets() {
  mainPad.innerHTML = '';
  aimPad.innerHTML = '';
  resetStopwatch();
  const randomAim = random(0, numInput.value - 1);

  for (let i = 0; i < numInput.value; i++) {
    const newSpan = createSpanElement(getRandomCharacter());
    mainPad.appendChild(newSpan);

    // Apply styling based on settings
    if (!auto) {
      newSpan.style.position = 'absolute';
      newSpan.style.color = charColor;
      newSpan.style.fontSize = charSize + 'px';
      newSpan.style.marginLeft = random(0, mainPad.clientWidth - charSize - 10) + 'px';
      newSpan.style.marginTop = random(0, mainPad.clientHeight - charSize - 10) + 'px';
    } else {
      newSpan.style.position = 'absolute';
      newSpan.style.color = generateRandomColor(mainPad.style.backgroundColor);
      newSpan.style.fontSize = random(14, 50) + 'px';
      newSpan.style.marginLeft = random(0, mainPad.clientWidth - 50) + 'px';
      newSpan.style.marginTop = random(0, mainPad.clientHeight - 50) + 'px';
    }

    if (i === randomAim) {
      newSpan.id = 'aim';
      const yourAim = newSpan.cloneNode(true);
      aimPad.appendChild(yourAim);
      yourAim.style.marginTop = '0px';
      yourAim.style.marginLeft = '0px';
      yourAim.style.textAlign = 'center';
      yourAim.id = "aimImg";
    }
  }

  document.getElementById('aim').onclick = stopRound;
  setTimeout(startStopwatch, 700);
}

