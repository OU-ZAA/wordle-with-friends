import { useState } from "react";
import { WORDS } from "../utils/words";
import { encryptRot13 } from "../utils/caesar-cipher";
import "./App.css";

const WORD_LENGTH = 5;

function App() {
  const [word, setWord] = useState("");
  const [isNext, setIsNext] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

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
    navigator.clipboard.writeText(
      `http://localhost:5173/${hashedSolution}-${name}-`
    );
  }

  return (
    <div className="container">
      <h1>Wordle With Friends</h1>
      <h2>
        Let your friends solve your{" "}
        <a
          href="https://www.nytimes.com/games/wordle/index.html"
          target="_blank"
        >
          Wordle!
        </a>
      </h2>
      <p>Enter a 5 letters word to get started.</p>
      <input
        type="text"
        placeholder="Enter a word"
        onChange={(e) => {
          if (e.target.value.length > WORD_LENGTH) return;
          setWord(e.target.value);
        }}
        value={word}
      />
      {error && <p className="error">{error}</p>}
      {isNext && (
        <input
          type="text"
          placeholder="What's your name?"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      )}
      <button onClick={handleCreateLink} disabled={isNext ? !name : !word}>
        {isNext ? "Create link" : "next"}
      </button>
      {/* <Board /> */}
    </div>
  );
}

export default App;
