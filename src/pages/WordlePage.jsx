import { PlayerInfoCard } from "../components/rps-game/PlayerInfoCard";
import { useState, useEffect } from "react";
import { WordleGrid } from "../components/wordle-game/wordGrid";
import { loadSettings } from "../logic/settings";
import { config } from "../components/wordle-game/wordleLogic";
import { checkGuess } from "../components/wordle-game/wordleLogic";
import "../components/wordle-game/wordleStyle.css"
export function WordlePage(){
    const settings = loadSettings()

    const playerName = settings?.name || 'Player';
    const playerAvatar = settings?.avatar;
    const [boardState, setBoardState] = useState(
      Array(config.maxAttempts).fill(null).map(() => Array(config.wordLength).fill({letter: '', status: ''}))
    )
    const [currentGuess, setCurrentGuess] = useState('');
    const [currentRow, setCurrentRow] = useState(0);
    const [message, setMessage] = useState('');
    const [targetWord, setTargetWord] =useState(null);
    const [gameOver, setGameOver] = useState(false)
    const [currentPosition, setCurrentPosition] = useState(0);

useEffect(() => {
  async function fetchWord() {
    const response = await fetch(
      `https://random-word-api.herokuapp.com/word?length=5`
    );
    const data = await response.json();
    setTargetWord(data[0]);
  }
  fetchWord();
}, []);


  function addLetter(letter) {
    if (currentGuess.length < config.wordLength){
      setCurrentGuess(currentGuess + letter);
      setCurrentPosition(currentPosition+1);
    }
  }

  function GameReset() {
    window.location.reload()
  }

  function removeLetter() {
    if (currentGuess.length > 0){
      setCurrentGuess(currentGuess.slice(0,-1));
      setCurrentPosition(currentPosition-1);
    }
  }

  async function submitGuess() {
    if (currentGuess.length < config.wordLength) {
      setMessage("Not enought letters.")
      return;
    }

    const results = await checkGuess(currentGuess);
    
    if (!results) {
      setMessage("Invalid word!")
      return;
    }

    const newBoard = [...boardState];
    for (let i = 0; i < config.wordLength; i++){
      newBoard[currentRow][i] = {
        letter: currentGuess[i], status: results[i]
      }
    }
    setBoardState(newBoard);

    const isWon =results.every(r => r === "correct");
    if (isWon) {
      setMessage("You won!");
      setGameOver(true);
    }
    else if (currentRow >= config.maxAttempts - 1) {
      setMessage(`Game over. Correct answer was: ${targetWord}`);
      setGameOver(true);
    }

    setCurrentRow(currentRow +1);
    setCurrentGuess('');
    setCurrentPosition(0);

  }


  function isLetter(letter) {
  return letter.length == 1 && /[a-z]/i.test(letter);
}

  const handleKeyDown = (e) => {
    if (gameOver) return;
  //if the key was a letter, addletter
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

   useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {document.removeEventListener("keydown", handleKeyDown);}
  }, [currentGuess, currentRow, gameOver, targetWord, boardState, handleKeyDown])
return (
    <main>
        <nav>
          <a>
            ← Back to Settings
          </a>
        </nav>
        <header>
            <PlayerInfoCard  playerName={playerName} playerAvatar={playerAvatar}></PlayerInfoCard>
            {message && <p className = "message">{message}</p>}
        </header>
        <div>
            <WordleGrid boardState = {boardState} currentRow = {currentRow} currentGuess = {currentGuess}></WordleGrid>
        </div>
        <div>
          <button onClick={GameReset}>Reset Game</button>
        </div>
    </main>
);
}