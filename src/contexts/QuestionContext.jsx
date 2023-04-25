import React, { createContext, useState, useMemo } from "react";
import api from "../config/index";

const QuestionContext = createContext();

const questionsInitial = [
  {
    id: 1,
    text: "",
    options: [""],
    answer: -1,
    audio: null,
    image: null,
    type: "Listening",
  },
];

export function QuestionProvider({ children }) {
  const [questions, setQuestions] = useState(
    JSON.parse(localStorage.getItem("questions")) ?? questionsInitial
  );

  // console.log("questions", questions);

  const handleSave = () => {
    localStorage.setItem("questions", JSON.stringify(questions));
    postQuestions();
  };

  // calculate file size of image and audio in questions
  const totalFileSize = useMemo(() => {
    let total = 0;
    questions.forEach((question) => {
      if (question.audio) {
        total += question.audio.length;
      }
      if (question.image) {
        total += question.image.length;
      }
    });
    return total;
  }, [questions]);

  const postQuestions = async () => {
    api
      .patch("/questions/643b089a21c7035d5c8e26d4", questions)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // console.log(`totalFileSize: ${totalFileSize}`);

  const value = useMemo(
    () => ({
      questions,
      setQuestions,
      handleSave,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions]
  );

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
}

export default QuestionContext;
