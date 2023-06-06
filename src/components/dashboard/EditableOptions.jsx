import React, { useState, useContext, useEffect } from 'react';
import check from '../../image/check_small.svg';
import QuestionContext from '../../contexts/QuestionContext';
import { Button } from 'primereact/button';

export default function EditableOptions({
  active,
  questionId,
  option,
  optionId,
}) {
  const { setQuestions, setSaveStatus } = useContext(QuestionContext);
  const [optionValue, setOptionValue] = useState('');

  useEffect(() => {
    setOptionValue(option.text);
  }, [option.text]);

  const handleAnswerChange = () => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      newData.find((question) => question.id === questionId).correctAnswer =
        optionId;
      return newData;
    });
    setSaveStatus(false);
  };

  const handleOptionChange = (e) => {
    setOptionValue(e.target.value);

    setQuestions((prevData) => {
      const newData = [...prevData];
      const question = newData.find((question) => question.id === questionId);
      if (!question) return prevData;

      // If the changed option is the correct answer, update the correct answer
      if (question.correctAnswer === optionId) {
        question.correctAnswer = e.target.value;
      }

      const option = question.options.find((opt) => opt.id === optionId);
      if (option) {
        option.text = e.target.value;
      }

      return newData;
    });

    setSaveStatus(false);
  };

  // const handleAnswer = () => {
  //   let newData = [...questions];

  //   setQuestions(newData);
  // };

  const handleDeleteOption = () => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      const questionIndex = newData.findIndex(
        (question) => question.id === questionId
      );
      if (questionIndex === -1) return prevData;

      const question = newData[questionIndex];
      const updatedOptions = question.options.filter(
        (opt) => opt.id !== option.id
      );
      question.options = updatedOptions;

      // If the deleted option was the correct answer, reset the correct answer
      if (question.correctAnswer === option.id) {
        question.correctAnswer = '';
      }

      return newData;
    });

    setSaveStatus(false);
  };

  return (
    <div
      className={`w-full gap-2 flex justify-between items-center rounded-[24px] px-3.5 py-2 hover:backdrop-brightness-[92] bg-whitePlus shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]`}
    >
      <button type="button" onClick={() => handleAnswerChange()}>
        {active ? (
          <img src={check} alt="" className="w-5 h-5" />
        ) : (
          <div className="w-5 h-5 border rounded-full bg-whitePlus"></div>
        )}
      </button>
      <textarea
        type="text"
        id="option"
        className="overflow-hidden text-base leading-normal text-black w-full bg-transparent border-none resize-none h-fit active:ring-0 focus:ring-0 ring-0"
        placeholder="Option..."
        value={optionValue}
        onChange={handleOptionChange}
      />
      {/* <button
        type="button"
        className="flex items-center justify-center px-2 py-2 text-white rounded-full bg-accent2"
        onClick={() => handleDeleteOptions(questionId, index)}
      > */}
      <Button
        icon="pi pi-times"
        rounded
        text
        style={{ color: '#FF6593' }}
        onClick={() => handleDeleteOption()}
        aria-label="Cancel"
      />
      {/* </button> */}
    </div>
  );
}
