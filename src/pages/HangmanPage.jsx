import { PlayerInfoCard } from "../components/rps-game/PlayerInfoCard";
import { useState, useEffect } from "react";
import { loadSettings } from "../logic/settings";
import { hmconfig, checkGuess, getRandomWord,  hmGameState} from "../components/hm-game/hmLogic";

export function MemoryGamePage(){
const settings = loadSettings()
const playerName = settings?.name || 'Player';
const playerAvatar = settings?.avatar?

const [message, setMessage] = useState('')
const [gameOver, setGameOver] = useState(false)
const [targetWord, setTargetWord]

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

return (
    <main>
        <header>
            <PlayerInfoCard  playerName={playerName} playerAvatar={playerAvatar}></PlayerInfoCard>
        </header>
        <div>
            <label>
                <select name="AlphabetPicker">

                </select>
            </label>
        </div>
    </main>
);
}