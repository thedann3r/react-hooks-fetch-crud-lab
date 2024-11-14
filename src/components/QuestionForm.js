import React, { useState } from "react";

function NewQuestionForm({ onAddQuestion }) {
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  function handleSubmit(e) {
    e.preventDefault()

    const newQuestion = {
      prompt,
      answers,
      correctIndex,
    };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newQuestion),
    })
      .then((res) => res.json())
      .then((data) => onAddQuestion(data))
      .catch((error) => console.error(error));
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Question Prompt:
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
      </label>
      <div>
        Answers:
        {answers.map((answer, index) => (
          <input
            key={index}
            type="text"
            value={answer}
            onChange={(e) => {
              const newAnswers = [...answers];
              newAnswers[index] = e.target.value;
              setAnswers(newAnswers);
            }}
            required
          />
        ))}
      </div>
      <label>
        Correct Answer Index:
        <input
          type="number"
          value={correctIndex}
          onChange={(e) => setCorrectIndex(Number(e.target.value))}
          min="0"
          max="3"
          required
        />
      </label>
      <button type="submit">Add Question</button>
    </form>
  );
}

export default NewQuestionForm