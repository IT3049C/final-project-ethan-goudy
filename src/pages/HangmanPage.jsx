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



    
 async function handleGuess(){
    if (currentAttempt >= hmconfig.maxLives){
        setMessage("ERROR: Out of tries!")
        return;
    }

    if (previousGuesses.includes(guessLetter)){
        setMessage('Already guessed that letter.')
        return;
    }

    setPreviousGuesses([...previousGuesses, guessLetter]);

    const result = await checkGuess(targetWord, guessLetter, displayWord);

    if(!result.correct){
        setMessage(`${guessLetter} is not in the target word. lose one life.`)
        const newAttemptCount = currentAttempt + 1
        setCurrentAttempt(newAttemptCount)
        if (newAttemptCount === hmconfig.maxLives){
        setGameOver(true);
        setMessage(`GAME LOST: You did not guess the word in time. Target word was ${targetWord}`)
    }
    }
    else{
        setMessage(`Correct. ${guessLetter} found.`)
        setDisplayWord(result.newDisplayWord)
        if (targetWord.toLowerCase() === result.newDisplayWord){
        setGameOver(true);
        setMessage("Word guessed successfully! Congratulations.")
    }
    }

    

    
}

async function GameReset(){
    const newWord = await getRandomWord();
        setTargetWord(newWord);
        setCurrentAttempt(0);
        setDisplayWord('_'.repeat(newWord.length));
        setGameOver(false);
        setPreviousGuesses([]);
}

useEffect(() => {
    async function initialize() {
        const newWord = await getRandomWord();
        setTargetWord(newWord);
        setCurrentAttempt(0);
        setDisplayWord('_'.repeat(newWord.length));
        setGameOver(false);
        setPreviousGuesses([]);
    }
    initialize();
}, [])

return (
    <main>
        <header>
            <PlayerInfoCard  playerName={playerName} playerAvatar={playerAvatar}></PlayerInfoCard>
            {currentAttempt && <p className="currentAttempt">ATTEMPTS REMAINING: {hmconfig.maxLives - currentAttempt}</p>}
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
            <button onClick={GameReset}>Restart</button>
        </div>
    </main>
);
}