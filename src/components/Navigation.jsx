import { NavLink } from "react-router-dom";

export function Navigation() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      {` | `}
      <NavLink to="/lobby">Lobby</NavLink>
      {` | `}
      <NavLink to="/game/rps">Rock Paper Scissors</NavLink>
      {` | `}
      <NavLink to="/game/tic-tac-toe">Tic Tac Toe</NavLink>
      {` | `}
      <NavLink to ="/game/hangman">Hangman</NavLink>
      {` | `}
      <NavLink to ="/game/wordle">Wordle</NavLink>
    </nav>
  );
}