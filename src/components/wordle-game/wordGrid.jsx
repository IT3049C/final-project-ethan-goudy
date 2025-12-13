
import { config } from "./wordleLogic"

export function WordleGrid({boardState, currentGuess, currentRow}) {
    return(
        <div className="wordle-grid">
            {Array.from({length: config.maxAttempts}).map((_, row) => (<div key={row} className = "row">
                {Array.from({length: config.wordLength}).map((_, col) => {
                    let letter = '';
                    let status = '';

                    if (row < currentRow) {
                        letter = boardState[row][col].letter;
                        status = boardState[row][col].status;
                    }
                    else if (row === currentRow && col < currentGuess.length){
                        letter = currentGuess[col];
                    }

                    return(
                        <div key={col} id={`cell-${row}-${col}`} className={`cell ${status}`} data-row={row}>
                            {letter || `_`}
                        </div> 
                    )
                })}
            </div>))}
        </div>
    )
}