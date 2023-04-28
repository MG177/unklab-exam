import React, { useState, useContext } from 'react';
import check from '../../image/check_small.svg';
import QuestionContext from '../../contexts/QuestionContext';
import { Button } from 'primereact/button';

export default function EditableOptions({ active, index, questionId, option }) {
  const { setQuestions, setSaveStatus } = useContext(QuestionContext);
  const [optionValue, setOptionValue] = useState(option);

  const handleAnswerChange = () => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      newData.find((question) => question.id === questionId).correctAnswer =
        optionValue;
      return newData;
    });
    setSaveStatus(false);
  };

  const handleOptionChange = (e) => {
    setOptionValue(e.target.value);

    setQuestions((prevData) => {
      const newData = [...prevData];
      // if the changed option is the correct answer, update the correct answer
      if (
        newData.find((question) => question.id === questionId).correctAnswer ===
        option
      ) {
        newData.find((question) => question.id === questionId).correctAnswer =
          e.target.value;
      }
      newData.find((question) => question.id === questionId).options[index] =
        e.target.value;

      return newData;
    });
    setSaveStatus(false);
  };

  // const handleAnswer = () => {
  //   let newData = [...questions];

  //   setQuestions(newData);
  // };

  const handleDeleteOptions = () => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      newData
        .find((question) => question.id === questionId)
        .options.splice(index, 1);
      return newData;
    });
    setSaveStatus(false);
  };

  return (
    <div
      className={`w-full gap-[18px] flex justify-center items-center rounded-[24px] px-[15px] py-[20px] hover:backdrop-brightness-[92] bg-whitePlus shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]`}>
      <button type='button' onClick={() => handleAnswerChange()}>
        {active ? (
          <img src={check} alt='' />
        ) : (
          <div className='w-[29px] h-[29px] bg-whitePlus rounded-[50%] border'></div>
        )}
      </button>
      <input
        type='text'
        className='text-[20px] border-none bg-transparent text-md text-black active:ring-0 focus:ring-0 ring-0'
        placeholder='Option...'
        value={optionValue}
        onChange={handleOptionChange}
      />
      {/* <button
        type="button"
        className="flex items-center justify-center px-2 py-2 text-white rounded-full bg-accent2"
        onClick={() => handleDeleteOptions(questionId, index)}
      > */}
      <Button
        icon='pi pi-times'
        rounded
        text
        style={{ color: '#FF6593' }}
        onClick={() => handleDeleteOptions()}
        aria-label='Cancel'
      />
      {/* </button> */}
    </div>
  );
}
