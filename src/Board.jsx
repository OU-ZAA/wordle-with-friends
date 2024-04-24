import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { decryptRot13 } from "../utils/caesar-cipher";

const WORD_LENGTH = 5;

function Row({ guess, isGuessEntered, solution }) {
  const tiles = [];
  // when the guess is null or '', we still want to render the tiles with empty strings
  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    let className =
      "w-14 h-14 border-2 border-[#d3d6da] text-2xl flex justify-center items-center uppercase font-bold";
    if (isGuessEntered) {
      if (char === solution[i]) {
        className = className + " text-white bg-[#538d4e]";
      } else if (solution.includes(char)) {
        className = className + " text-white bg-[#b59f3b]";
      } else {
        className = className + " text-white bg-[#787c7e]";
      }
    }
    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }

  return <div className="flex gap-1">{tiles}</div>;
}

function Board() {
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const { details } = useParams();
  const [hashedSolution, name] = details.split("-");
  const solution = decryptRot13(hashedSolution.toUpperCase()).toLowerCase();

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
        if (currentGuess === solution) setIsGameOver(true);
        setCurrentGuess("");

        return;
      }

      if (currentGuess.length === WORD_LENGTH) return;

      setCurrentGuess(currentGuess + event.key);
    }

    window.addEventListener("keydown", handleClick);

    return () => window.removeEventListener("keydown", handleClick);
  }, [currentGuess, guesses, isGameOver, solution]);

  return (
    <div className="text-center">
      <h1 className="text-4xl border-b-2 border-blue-200 py-3 font-bold">
        Wordle With Friends
      </h1>
      <p className="mt-3">
        You have 6 tries to guess {name.charAt(0).toUpperCase() + name.slice(1)}
        &apos;s 5 letter word!
      </p>
      <div className="flex flex-col items-center gap-1 mt-4">
        {guesses.map((guess, idx) => {
          const isCurrentGuess =
            idx === guesses.findIndex((val) => val == null);
          return (
            <Row
              key={idx}
              guess={isCurrentGuess ? currentGuess : guess ?? ""}
              isGuessEntered={!isCurrentGuess && guess != null}
              solution={solution}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Board;
