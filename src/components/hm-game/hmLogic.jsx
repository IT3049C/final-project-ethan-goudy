export const hmconfig = {
  wordLength: 6,
  maxLives: 10,
};

export const hmGameState = {
  remainingLives: 0,
  targetWord: await getRandomWord(),
};

async function getRandomWord() {
  const response = await fetch(
    `https://random-word-api.herokuapp.com/word?length=${hmconfig.wordLength}`
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

  return guessLetters.map((letter) => {
    if (targetLetters.includes(letter)) {
      return "correct";
    } 
    else {
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
  } catch {
    console.error(`Failed to find word: ${word}`);
    return false;
  }
}
