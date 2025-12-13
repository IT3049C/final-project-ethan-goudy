import { checkGuess, config, gameState } from "./game.js";
const grid = document.getElementById("wordle-grid");
const GameResultParagraph = document.getElementById("game-result");

function addTileToGrid(row, col) {
  const tile = document.createElement("div");
  tile.className = "letter";
  tile.id = `cell-${row}-${col}`;
  tile.setAttribute(`data-row`, row);
  grid.appendChild(tile);
}

function setupGrid() {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${config.wordLength}, 60px)`;
  for (let row = 0; row < config.maxAttempts; row++) {
    for (let col = 0; col < config.wordLength; col++) {
      addTileToGrid(row, col);
    }
  }
  console.log(gameState.targetWord);
}

setupGrid();

function isLetter(letter) {
  return letter.length == 1 && /[a-z]/i.test(letter);
}

const handleKeyDown = (e) => {
  //if the key was a letter, addleter
  if (isLetter(e.key)) {
    addLetter(e.key);
  } else if (e.key === "Backspace") {
    removeLetter();
  } else if (e.key === "Enter") {
    submitGuess();
  }
  // if the key was a backspace, removeLeter
  //if the key was enter, submitGuess
};

document.addEventListener("keydown", handleKeyDown);

function addLetter(letter) {
  if (gameState.currentPosition < config.wordLength) {
    const cell = document.getElementById(
      `cell-${gameState.currentAttempt}-${gameState.currentPosition}`
    );
    cell.textContent = letter;
    animateELement(cell, `bounceIn`);
    gameState.currentPosition++;
  }
}

function removeLetter() {
  if (gameState.currentPosition == 0) {
    return;
  }
  gameState.currentPosition--;
  const cell = document.getElementById(
    `cell-${gameState.currentAttempt}-${gameState.currentPosition}`
  );
  cell.textContent = "";
}

function animateELement(element, animation) {
  element.classList.add(`animate__animated`, `animate__${animation}`);
  element.addEventListener(`animationend`, () => {
    element.classList.remove(`animate__animated`, `animate__${animation}`);
  });
}

function shakeRow() {
  const rowTiles = document.querySelectorAll(
    `[data-row="${gameState.currentAttempt}"]`
  );
  rowTiles.forEach((tile) => {
    animateELement(tile, `shakeX`);
  });
}

function showMessage(msg) {
  GameResultParagraph.textContent = msg;
}

function revealResults(results) {
  const rowToReveal = gameState.currentAttempt;
  const DelayBetweenTileReveal = 300;
  results.forEach((result, col) => {
    const cell = document.getElementById(`cell-${rowToReveal}-${col}`);
    setTimeout(() => {
      animateELement(cell, `flipInX`);
      cell.classList.add(result);
    }, col * DelayBetweenTileReveal);
  });
}

function lockInput() {
  document.removeEventListener("keydown", handleKeyDown);
}

async function submitGuess() {
  if (gameState.currentPosition < config.wordLength) {
    console.error("word incomplete");
    showMessage("word incomplete");
    shakeRow();
    return;
  }

  const rowTiles = document.querySelectorAll(
    `[data-row="${gameState.currentAttempt}"]`
  );
  const userGuess = Array.from(rowTiles)
    .map((tile) => {
      return tile.textContent;
    })
    .join("");

  const results = await checkGuess(userGuess);
  console.log(results);

  //Copilot told me I forgot this
  if (!results) {
    shakeRow();
    return;
  }

  for (let col = 0; col < config.wordLength; col++) {
    const cell = document.getElementById(
      `cell-${gameState.currentAttempt}-${col}`
    );
    cell.classList.add(results[col]);
  }

  revealResults(results);

  const isWon = results.every((result) => result == "correct");
  console.log(isWon);
  if (isWon) {
    showMessage("You Won!");
  }

  gameState.currentAttempt++;
  gameState.currentPosition = 0;

  const isLost = gameState.currentAttempt >= config.maxAttempts;
  if (isLost) {
    lockInput();
    showMessage("Game Over!");
  }
}
