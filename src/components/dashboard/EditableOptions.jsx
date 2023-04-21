import React, { useContext } from "react";
import check from "../../image/check_small.svg";
import QuestionContext from "../../contexts/QuestionContext";

export default function EditableOptions({ active, index, questionId }) {
  const { questions, setQuestions } = useContext(QuestionContext);

  const handleOptionsChange = (index, questionId, value) => {
    let newData = [...questions];
    newData.find((question) => question.id === questionId).options[index] =
      value;
    setQuestions(newData);
  };

  const handleAnswer = (questionId, index) => {
    let newData = [...questions];
    newData.find((question) => question.id === questionId).answer = index;
    setQuestions(newData);
  };

  const handleDeleteOptions = (questionId, optionIndex) => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      newData
        .find((question) => question.id === questionId)
        .options.splice(optionIndex, 1);
      return newData;
    });
  };

  return (
    <div
      onClick={() => handleAnswer(questionId, index)}
      className={`w-full gap-[18px] flex justify-center items-center rounded-[24px] px-[15px] py-[20px] hover:backdrop-brightness-[92] bg-whitePlus cursor-pointer shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]`}
    >
      {active ? (
        <img src={check} alt="" />
      ) : (
        <div className="w-[29px] h-[29px] bg-whitePlus rounded-[50%] border"></div>
      )}
      <input
        type="text"
        className="text-[20px] border-none bg-transparent text-md text-black active:ring-0 focus:ring-0 ring-0"
        placeholder="Option..."
        onChange={(e) => handleOptionsChange(index, questionId, e.target.value)}
      />
      <button
        type="button"
        className="flex items-center justify-center px-2 py-2 text-white rounded-full bg-accent2"
        onClick={() => handleDeleteOptions(questionId, index)}
      >
        <i className="fa-solid fa-trash" />
      </button>
    </div>
  );
}
