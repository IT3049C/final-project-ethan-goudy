export const hmconfig = {
  wordLength: 6,
  maxLives: 10,
};



export async function getRandomWord() {
  const response = await fetch(
    `https://random-word-api.herokuapp.com/word?length=${hmconfig.wordLength}`
  );

  const data = await response.json();
  console.log(data);
  return data[0];
}

export async function checkGuess(targetWord, guess, currentDisplayWord) {
  const isValid = await isValidWord(guess.toLowerCase());
  if (!isValid) {
    return null; //suggested by Copilot to fix a bug in this function
  }
  const targetLetters = targetWord.toLowerCase();
  const guessLetter = guess.toLowerCase();

  const isCorrect = targetLetters.includes(guessLetter);

  let newDisplayWord = '';
  for (let i = 0; i < targetWord.length; i++) {
    if (targetLetters[i] === guessLetter) {
      newDisplayWord += guessLetter;
    }
    else {
      newDisplayWord += currentDisplayWord[i];
    }
  }

   return {
      correct: isCorrect,
      newDisplayWord: newDisplayWord
    }
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
