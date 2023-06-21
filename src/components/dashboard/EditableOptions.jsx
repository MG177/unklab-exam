import React, { useState, useContext, useEffect } from 'react';
import check from '../../image/check_small.svg';
import QuestionContext from '../../contexts/QuestionContext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';

export default function EditableOptions({
  active,
  questionId,
  option,
  optionId,
  setQuestions,
  handleQuestionChange,
}) {
  // const { setQuestions, setSaveStatus } = useContext(QuestionContext);
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
    handleQuestionChange();
  };

  const handleOptionChange = (e) => {
    setOptionValue(e.target.value);
    setQuestions((prevData) => {
      // console.log('prevData', prevData);
      const newData = [...prevData];
      const question = newData.find((question) => question.id === questionId);
      if (!question) return prevData;

      const option = question.options.find((opt) => opt.id === optionId);
      if (option) {
        option.text = e.target.value;
      }

      return newData;
    });
    handleQuestionChange();
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
    handleQuestionChange();
  };

  return (
    <div
      className={`w-full gap-2 flex justify-between items-center rounded-3xl px-3.5 py-2 hover:backdrop-brightness-[92] bg-whitePlus shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]`}
    >
      <button
        type="button"
        onClick={() => handleAnswerChange()}
        className="p-1 border rounded-full bg-whitePlus justify-center items-center flex "
      >
        {active ? (
          <i
            className="pi pi-check text-accent1"
            style={{ fontWeight: '600' }}
          />
        ) : (
          <i className="pi pi-check invisible" />
        )}
      </button>
      <InputTextarea
        type="text"
        id="option"
        className="overflow-hidden text-base leading-normal text-black w-full rounded-lg border-0 bg-transparent drop-shadow-sm resize-none h-fit active:ring-0 focus:ring-0 ring-0"
        autoResize
        placeholder="Option..."
        value={optionValue}
        // onChange={(e) => setOptionValue(e.target.value)}
        rows={1}
        onChange={handleOptionChange}
      />
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
