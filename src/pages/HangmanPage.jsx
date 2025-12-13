import { PlayerInfoCard } from "../components/rps-game/PlayerInfoCard";
import { useState, useEffect } from "react";
import { loadSettings } from "../logic/settings";
import { hmconfig, checkGuess, getRandomWord,} from "../components/hm-game/hmLogic";

export function HangmanPage(){
const settings = loadSettings()
const playerName = settings?.name || 'Player';
const playerAvatar = settings?.avatar;

const [message, setMessage] = useState('')
const [gameOver, setGameOver] = useState(false)
const [targetWord, setTargetWord] = useState(null)
const [currentAttempt, setCurrentAttempt] = useState(0)
const [guessLetter, setGuessLetter] = useState('A')
const [previousGuesses, setPreviousGuesses] = useState([])
const [displayWord ,setDisplayWord] = useState('')


function handleGuess(){
    if (currentAttempt >= hmconfig.maxLives){
        setMessage("ERROR: Out of tries!")
        return;
    }

    if (previousGuesses.includes(guessLetter)){
        setMessage('Already guessed that letter.')
        return;
    }

    setPreviousGuesses([...previousGuesses, guessLetter]);

    const result = checkGuess(targetWord, guessLetter, displayWord);

    if(!result.correct){
        setMessage(`${guessLetter} is not in the target word. lose one life.`)
        setCurrentAttempt(currentAttempt+1)
    }
    else{
        setMessage(`Correct. ${guessLetter} found.`)
    }
}


useEffect(() => {
    const newWord = getRandomWord();
    setTargetWord(newWord);
    setCurrentAttempt(0);
    setDisplayWord('_'.repeat(newWord.length));
    setGameOver(false);
    setPreviousGuesses([]);
}, [])

return (
    <main>
        <header>
            <PlayerInfoCard  playerName={playerName} playerAvatar={playerAvatar}></PlayerInfoCard>
            {currentAttempt && <p className="currentAttempt">ATTEMPTS REMAINING: {currentAttempt}</p>}
            <p>MAXIMUM ATTEMPTS: {hmconfig.maxLives}</p>
            {message && <p className = "message">{message}</p>}
            <p>CURRENT PROGRESS: {displayWord}</p>
        </header>
        <div>
            <label>
                <select  name="AlphabetPicker" value={guessLetter} onChange={(e) => setGuessLetter(e.target.value)}>
                    <option name="A">A</option>
                    <option name="B">B</option>
                    <option name="C">C</option>
                    <option name="D">D</option>
                    <option name="E">E</option>
                    <option name="F">F</option>
                    <option name="G">G</option>
                    <option name="H">H</option>
                    <option name="I">I</option>
                    <option name="J">J</option>
                    <option name="K">K</option>
                    <option name="L">L</option>
                    <option name="M">M</option>
                    <option name="N">N</option>
                    <option name="O">O</option>
                    <option name="P">P</option>
                    <option name="Q">Q</option>
                    <option name="R">R</option>
                    <option name="S">S</option>
                    <option name="T">T</option>
                    <option name="U">U</option>
                    <option name="V">V</option>
                    <option name="W">W</option>
                    <option name="X">X</option>
                    <option name="Y">Y</option>
                    <option name="Z">Z</option>
                </select>
            </label>
            <button onClick={handleGuess} disabled={gameOver}>Guess</button>
        </div>
    </main>
);
}