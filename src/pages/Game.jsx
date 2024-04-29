import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { decryptRot13 } from "../utils/caesar-cipher";
import { CircleXIcon, DeleteIcon, Share2Icon } from "lucide-react";
import { Header } from "../components/ui/Header";
import { WORDS } from "../utils/words";

const WORD_LENGTH = 5;
const backspace = <DeleteIcon />;
const ROW1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const ROW2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const ROW3 = ["Enter", "z", "x", "c", "v", "b", "n", "m", backspace];

function Modal({ name, solution, setIsGameOver }) {
  return (
    <div className="z-10 inset-0 overflow-y-auto absolute top-32 flex justify-center items-start">
      <div className="text-white space-y-8 text-center relative bg-[#121213] rounded-lg p-6 overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-sm sm:w-full">
        <h3 className="text-3xl leading-6 font-bold">
          You win!{" "}
          <span role="img" aria-label="win" aria-hidden="false">
            🎉
          </span>{" "}
        </h3>
        <div>
          {name.charAt(0).toUpperCase() + name.slice(1)}&apos;s word was{" "}
          {solution.toUpperCase()}.
        </div>
        <button
          onClick={() => setIsGameOver(false)}
          type="button"
          className="absolute right-2 top-[-24px]"
        >
          <CircleXIcon className="hover:text-red-500" />
        </button>
        <div className="sm:flex sm:justify-center sm:space-x-2">
          <a
            href={window.location.href.replace(window.location.pathname, "/")}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-correct text-base font-medium text-white bg-[#538d4e] sm:col-start-2 sm:text-sm"
          >
            Create a Word
          </a>
          <button
            type="button"
            className="flex bg-[#b59f3b] items-center space-x-2 mt-3 w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 font-medium text-white sm:mt-0 sm:col-start-1 sm:text-sm"
          >
            <span>Share</span>
            <Share2Icon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ guess, isGuessEntered, solution }) {
  const tiles = [];
  // when the guess is null or '', we still want to render the tiles with empty strings
  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    let className =
      "w-12 h-12 border-2 border-[#d3d6da] text-2xl flex justify-center items-center uppercase font-bold";
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

function KeyboardLayout({
  currentGuess,
  setCurrentGuess,
  guesses,
  setGuesses,
  solution,
  isGameOver,
  setIsGameOver,
  setIsPopupOpen,
}) {
  function handleClick(event) {
    if (isGameOver) return;

    if (event.target.dataset.role === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
      return;
    }

    if (
      event.target.textContent == "Enter" &&
      currentGuess.length == WORD_LENGTH
    ) {
      if (!WORDS.includes(currentGuess)) {
        setIsPopupOpen(true);
        return;
      }
      const newGuesses = guesses;
      newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
      setGuesses(newGuesses);

      if (currentGuess === solution) {
        setIsGameOver(!isGameOver);
        return;
      }
      setCurrentGuess("");
      return;
    }

    if (currentGuess.length === WORD_LENGTH) return;

    setCurrentGuess(currentGuess + event.target.textContent);
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex justify-center items-center gap-1">
        {ROW1.map((element, idx) => (
          <button
            className="bg-gray-300 text-sm w-8 h-12  rounded uppercase font-bold"
            key={idx}
            onClick={handleClick}
          >
            {element}
          </button>
        ))}
      </div>
      <div className="flex justify-center items-center gap-1">
        {ROW2.map((element, idx) => (
          <button
            className="bg-gray-300 text-sm w-8 h-12  rounded uppercase font-bold"
            key={idx}
            onClick={handleClick}
          >
            {element}
          </button>
        ))}
      </div>
      <div className="flex justify-center items-center gap-1">
        {ROW3.map((element, idx) => {
          if (element == "Enter" || element == backspace) {
            return (
              <button
                className="bg-gray-300 text-sm rounded uppercase font-bold w-14 h-12 flex justify-center items-center"
                key={idx}
                onClick={handleClick}
              >
                {element}
              </button>
            );
          }
          return (
            <button
              className="bg-gray-300 text-sm w-8 h-12  rounded uppercase font-bold"
              key={idx}
              onClick={handleClick}
            >
              {element}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PopUp({ setIsPopupOpen }) {
  useEffect(() => {
    setTimeout(() => setIsPopupOpen(false), 2000);
  }, [setIsPopupOpen]);

  return (
    <div className="z-10 inset-0 overflow-y-auto absolute flex justify-center items-start">
      <div
        className="relative p-2 text-sm text-white rounded-lg bg-black w-fit shadow-xl transform transition-all top-10"
        role="alert"
      >
        <span className="font-medium">Not in words list!</span>
      </div>
    </div>
  );
}

function GamePage() {
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { details } = useParams();
  const [hashedSolution, name] = details.split("-");
  const solution = decryptRot13(hashedSolution.toUpperCase()).toLowerCase();

  useEffect(() => {
    function handleType(event) {
      if (isGameOver) return;

      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (event.key == "Enter" && currentGuess.length == WORD_LENGTH) {
        if (!WORDS.includes(currentGuess)) {
          setIsPopupOpen(true);
          return;
        }
        const newGuesses = guesses;
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuesses(newGuesses);
        if (currentGuess === solution) {
          setIsGameOver(true);
          return;
        }
        setCurrentGuess("");
        return;
      }

      if (
        event.key.length !== 1 ||
        event.key.charCodeAt(0) < 97 ||
        event.key.charCodeAt(0) > 122
      )
        return;

      if (currentGuess.length === WORD_LENGTH) return;

      setCurrentGuess(currentGuess + event.key);
    }

    window.addEventListener("keydown", handleType);

    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess, guesses, isGameOver, solution]);

  return (
    <>
      <Header />
      <main className="px-2 py-4">
        <p className="text-sm text-center">
          You have 6 tries to guess{" "}
          {name.charAt(0).toUpperCase() + name.slice(1)}
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
        {isGameOver && (
          <Modal
            name={name}
            solution={solution}
            setIsGameOver={setIsGameOver}
          />
        )}
        <KeyboardLayout
          currentGuess={currentGuess}
          setCurrentGuess={setCurrentGuess}
          guesses={guesses}
          setGuesses={setGuesses}
          isGameOver={isGameOver}
          setIsGameOver={setIsGameOver}
          solution={solution}
          setIsPopupOpen={setIsPopupOpen}
        />
        {isPopupOpen && <PopUp setIsPopupOpen={setIsPopupOpen} />}
      </main>
    </>
  );
}

export default GamePage;
