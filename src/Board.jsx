import { useEffect, useState } from "react";

const SOLUTION = "world";
const WORD_LENGTH = 5;

function Row({ guess, isGuessEntered }) {
  const tiles = [];
  // when the guess is null or '', we still want to render the tiles with empty strings
  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    let className = "tile";
    if (isGuessEntered) {
      if (char === SOLUTION[i]) {
        className = className + " correct";
      } else if (SOLUTION.includes(char)) {
        className = className + " close";
      } else {
        className = className + " incorrect";
      }
    }
    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }

  return <div className="row">{tiles}</div>;
}

function Board() {
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    function handleClick(event) {
      if (isGameOver) return;

      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (
        !event.key.match(/[aA-zZ]/i) ||
        event.key == "Alt" ||
        event.key == "Shift" ||
        event.key == "Control" ||
        event.key == "CapsLock" ||
        event.key == "Tab"
      )
        return;

      if (event.key == "Enter" && currentGuess.length == WORD_LENGTH) {
        const newGuesses = guesses;
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuesses(newGuesses);
        if (currentGuess === SOLUTION) setIsGameOver(true);
        setCurrentGuess("");

        return;
      }

      if (currentGuess.length === WORD_LENGTH) return;

      setCurrentGuess(currentGuess + event.key);
    }

    window.addEventListener("keydown", handleClick);

    return () => window.removeEventListener("keydown", handleClick);
  }, [currentGuess, guesses, isGameOver]);

  return (
    <div className="board">
      {guesses.map((guess, idx) => {
        const isCurrentGuess = idx === guesses.findIndex((val) => val == null);
        return (
          <Row
            key={idx}
            guess={isCurrentGuess ? currentGuess : guess ?? ""}
            isGuessEntered={!isCurrentGuess && guess != null}
          />
        );
      })}
    </div>
  );
}

export default Board;
