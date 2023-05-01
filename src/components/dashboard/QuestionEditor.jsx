import React, { useContext, useEffect } from 'react';
import QuestionEditorItem from './QuestionEditorItem';
import QuestionContext from '../../contexts/QuestionContext';

export default function QuestionEditor() {
  const { handleSave, questions, setQuestions, setSaveStatus, saveStatus } =
    useContext(QuestionContext);

  const handleAddQuestion = () => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      let newId = newData.length + 1;
      // eslint-disable-next-line no-loop-func
      while (newData.some((question) => question.id === newId)) {
        newId++;
      }
      newData.push({
        id: newId,
        question: '',
        options: [
          {
            id: 1,
            text: ''
          }
        ],
        answer: 0,
        audio: null,
        image: null,
        type: 'Listening'
      });
      return newData;
    });
    setSaveStatus(false);
  };

  return (
    <div className='relative z-20 flex flex-col h-screen overflow-y-scroll bg-white font-Nunito min-w-fit shadow-right scroll-smooth'>
      <div className='flex flex-col items-center justify-start w-full max-w-lg p-3 '>
        <h1 className='flex items-center justify-between w-full p-4 mb-3 text-3xl font-bold text-center text-white bg-accent1 rounded-2xl'>
          <span className='flex-1'> QUESTION EDITOR </span>
          <span className='px-4 py-2 bg-white rounded-[17px] text-accent2'>{`${questions.length}`}</span>
        </h1>
        {questions.map((question, index) => (
          <QuestionEditorItem
            key={index}
            question={question}
            currentQuestion={index}
          />
        ))}
      </div>
      <div className='sticky bottom-0 flex w-full gap-3 p-3 bg-opacity-25 rounded bg-whitePlus backdrop-blur-sm backdrop-filter'>
        <button
          className='flex-1 py-3 font-medium text-white rounded-full px-44 bg-accent1 text-3 disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={handleSave}
          disabled={saveStatus}>
          Save
        </button>
        <button
          className='w-12 py-3 font-medium text-white rounded-full bg-accent1 text-3'
          onClick={handleAddQuestion}>
          <i className='fa-solid fa-plus' />
        </button>
      </div>
    </div>
  );
}
