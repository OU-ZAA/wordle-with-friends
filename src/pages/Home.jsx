import { useState } from "react";
import { WORDS } from "../utils/words";
import { encryptRot13 } from "../utils/caesar-cipher";
import { Header } from "../components/ui/Header";

const WORD_LENGTH = 5;

function HomePage() {
  const [word, setWord] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isNext, setIsNext] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  function handleCreateLink() {
    if (!isNext) {
      if (word.length !== WORD_LENGTH) {
        setError("The word should be 5 letters long");
        return;
      }
      if (!WORDS.includes(word)) {
        setError("Enter a real word");
        return;
      }
      setError("");
      setIsNext(true);
      return;
    }
    const hashedSolution = encryptRot13(word.toUpperCase()).toLowerCase();
    const baseUrl = window.location.href;
    navigator.clipboard.writeText(`${baseUrl}${hashedSolution}-${name}`);
    setIsCopied(true);
  }

  return (
    <>
      <Header />
      <h2 className="text-lg text-center mt-5 font-medium">
        Let your friends solve your{" "}
        <a
          href="https://www.nytimes.com/games/wordle/index.html"
          target="_blank"
          className="underline hover:text-gray-600"
        >
          Wordle!
        </a>
      </h2>
      <p className="mt-2 text-center text-sm">
        Enter a 5 letters word to get started.
      </p>
      <div className="mt-6 flex flex-col items-center">
        <input
          className="shadow appearance-none border uppercase rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-80 sm:w-96"
          type="text"
          placeholder="Enter your word here"
          onChange={(e) => {
            if (e.target.value.length > WORD_LENGTH) return;
            setWord(e.target.value);
          }}
          disabled={isNext}
          value={word}
        />
        {error && <p className="error">{error}</p>}
        {isNext && (
          <input
            className="mt-3 shadow appearance-none border capitalize rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-80 sm:w-96"
            type="text"
            placeholder="What's your name?"
            disabled={isCopied}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        )}
        <button
          onClick={handleCreateLink}
          className={`py-2 mt-3 w-80 sm:w-96 ${
            isCopied ? "bg-green-600" : "bg-black"
          } text-white rounded font-bold`}
          disabled={isNext ? !name : !word}
        >
          {isCopied ? "Copied!" : isNext ? "Create link" : "Next"}
        </button>
      </div>
      {isCopied && (
        <p className="mt-6 max-w-96 mx-auto text-center text-sm">
          A shareable link has been created and copied. Send it to your friends!
        </p>
      )}
    </>
  );
}

export default HomePage;
