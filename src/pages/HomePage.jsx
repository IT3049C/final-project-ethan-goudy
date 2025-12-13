import { Link, useSearchParams } from "react-router-dom";

export function HomePage() {
  const [params, setParams] = useSearchParams();
  const search = (params.get("search") || "").toLowerCase();


  const games = [
    { key: "rps", name: "Rock Paper Scissors", description: "A simple game of Rock Paper Scissors" },
    { key: "tic-tac-toe", name: "Tic Tac Toe", description: "A simple game of Tic Tac Toe" },
    { key: "Hangman", name: "Hangman", description: "A simple word game where you must guess the letters of a hidden word."},
    { key: "Wordle", name: "Wordle", description: "An implementation of Wordle."},
  ];

    const _filteredGames = games.filter((game) => 
    search==="" || game.name.toLowerCase().includes(search)
    //Bug in suggested version of search logic identified by Claude Sonnet
  );

  return (
    <section>
      <h2>Available Games</h2>
      <p>Choose a game to play</p>

      <input
        id="game-search"
        type="text"
        placeholder="Search games..."
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          if (value.trim() === "") {
            setParams({});
          } else {
            setParams({ search: value });
          }
        }}
      />

      <ul style={{ textAlign: "left" }}>
        {games.map((game) => (
          <li key={game.key}>
            <Link to={`/game/${game.key}`}>{game.name}</Link>
            <p>{game.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}