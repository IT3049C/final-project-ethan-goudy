export const config = {
  wordLength: 5,
  maxAttempts: 6,
};

export const gameState = {
  currentAttempt: 0,
  currentPosition: 0,
  targetWord: await getRandomWord(),
};

async function getRandomWord() {
  const response = await fetch(
    `https://random-word-api.herokuapp.com/word?length=${config.wordLength}`
  );

  const data = await response.json();
  console.log(data);
  return data[0];
}

export async function checkGuess(guess) {
  const isValid = await isValidWord(guess.toLowerCase());
  if (!isValid) {
    return null; //suggested by Copilot to fix a bug in this function
  }
  const targetLetters = gameState.targetWord.toLowerCase().split("");
  const guessLetters = guess.toLowerCase().split("");

  return guessLetters.map((letter, index) => {
    if (letter === targetLetters[index]) {
      return "correct";
    } else if (targetLetters.includes(letter)) {
      return "misplaced";
    } else {
      return "incorrect";
    }
  });
}

async function isValidWord(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    return response.ok;
  } catch  {
    console.error(`Failed to find word: ${word}`);
    return false;
  }
}






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

function shakeRow() {
  const rowTiles = document.querySelectorAll(
    `[data-row="${gameState.currentAttempt}"]`
  );
  rowTiles.forEach((tile) => {
    animateELement(tile, `shakeX`);
  });
}

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


function showMessage(msg) {
  return msg;
  //FIX LATER
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