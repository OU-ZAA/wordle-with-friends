import { useState } from "react";
import { WORDS } from "../utils/words";
import { encryptRot13 } from "../utils/caesar-cipher";

const WORD_LENGTH = 5;

function App() {
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
    <div className="text-center flex flex-col">
      <h1 className="text-4xl border-b-2 border-blue-200 py-3 font-bold">
        Wordle With Friends
      </h1>
      <h2 className="text-xl mt-3 font-medium">
        Let your friends solve your{" "}
        <a
          href="https://www.nytimes.com/games/wordle/index.html"
          target="_blank"
          className="underline hover:text-gray-600"
        >
          Wordle!
        </a>
      </h2>
      <p className="mt-2">Enter a 5 letters word to get started.</p>
      <div className="mt-6 flex flex-col items-center">
        <input
          className="shadow appearance-none border uppercase rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-96"
          type="text"
          placeholder="Enter a word"
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
            className="mt-3 shadow appearance-none border capitalize rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-96"
            type="text"
            placeholder="What's your name?"
            disabled={isCopied}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        )}
        <button
          onClick={handleCreateLink}
          className={`py-2 mt-3 w-96 ${
            isCopied ? "bg-green-600" : "bg-black"
          } text-white rounded font-bold`}
          disabled={isNext ? !name : !word}
        >
          {isCopied ? "Copied!" : isNext ? "Create link" : "Next"}
        </button>
      </div>
      {isCopied && (
        <p className="mt-6">
          A shareable link has been created and copied. Send it to your friends!
        </p>
      )}
    </div>
  );
}

export default App;
