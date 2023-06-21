import React, { useContext, useEffect, useRef, useState } from 'react';
import EditableOptions from './EditableOptions';
import AuthContext from '../../contexts/AuthContext';
import SelectableDropdown from './SelectableDropdown';
import AddAudio from '../../image/audio.svg';
import api from '../../config';
import Media from '../Media';
import { InputTextarea } from 'primereact/inputtextarea';

export default function QuestionEditorItem({
  question,
  questions,
  setQuestions,
  index,
  handleQuestionChange,
  saveStatus,
}) {
  const questionRef = useRef(null);
  const hasContent =
    question.media || question.audio || question.image || question.question;

  const handleOptionActive = (valueId) => {
    return question.correctAnswer === valueId;
  };

  const handleQuestionText = (questionId, value) => {
    let newData = [...questions];
    newData.find((question) => question.id === questionId).text = value;
    console.log('newData:', newData);
    setQuestions(newData);
    handleQuestionChange();
  };
  // console.log('question', question);

  const handleFileUpload = async (e, questionId, type) => {
    try {
      const file = e.target.files[0];
      if (file.size > 1000000 && type === 'image') {
        alert('File size exceeds 1MB limit');
        return;
      }

      if (file.size > 5000000 && type === 'audio') {
        alert('File size exceeds 5MB limit');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/file', formData);
      const fileId = response.data.id;

      setQuestions((prevData) => {
        const newData = [...prevData];
        const question = newData.find((question) => question.id === questionId);
        if (question && type === 'image') {
          question.image = fileId;
        }
        if (question && type === 'audio') {
          question.audio = fileId;
        }
        return newData;
      });

      handleQuestionChange();
    } catch (error) {
      console.error(error);
    } finally {
      e.target.value = '';
    }
  };

  const handleRemoveFile = (questionId, type) => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      if (type === 'image') {
        newData.find((question) => question.id === questionId).image = null;
      }
      if (type === 'audio') {
        newData.find((question) => question.id === questionId).audio = null;
      }

      return newData;
    });
    handleQuestionChange();
  };

  const handleAddOption = (questionId) => {
    setQuestions((prevData) => {
      const newData = prevData.map((question) => {
        let newId = 1;
        // eslint-disable-next-line no-loop-func
        while (question.options.find((option) => option.id === newId)) {
          newId++;
        }
        if (question.id === questionId) {
          return {
            ...question,
            options: [
              ...question.options,
              {
                id: newId,
                text: '',
              },
            ],
          };
        }
        return question;
      });
      return newData;
    });
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      setQuestions((prevData) => {
        const newData = prevData.filter(
          (question) => question.id !== questionId
        );
        console.log('prevData:', prevData);
        console.log('newData:', newData);
        return newData;
      });
      console.log('questions - handleDeleteQuestion', questions);
      handleQuestionChange();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log('saveStatus:', saveStatus);
    if (saveStatus != true) {
      handleQuestionChange();
    }
  }, [questions]);

  return (
    <div className="flex w-[500px] gap-3">
      <div className="flex flex-col w-full gap-6">
        <div className="flex flex-col gap-3 p-4 bg-whitePlus shadow-right rounded-2xl">
          <div className="flex flex-row justify-between w-full">
            <h3 className="text-xl font-bold text-accent1">
              Question #{index + 1}
            </h3>
            <SelectableDropdown
              question={question}
              setQuestions={setQuestions}
              handleQuestionChange={handleQuestionChange}
            />
          </div>
          {hasContent && (
            <Media id={question.image || question.audio} dashboard />
          )}
          <div className="grid grid-cols-1 grid-rows-1 after:whitespace-pre-wrap after:content-[attr(data-replicated-value)] after:invisible ">
            <InputTextarea
              placeholder="Question..."
              value={question.text}
              autoResize
              onChange={(e) => handleQuestionText(question.id, e.target.value)}
              className="w-full col-start-1 row-start-1 overflow-hidden text-base text-black bg-transparent border-px rounded-lg border-gray resize-none h-fit active:ring-0 focus:ring-0 ring-0"
              ref={questionRef}
              // onInput={resizeTextArea}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[18px] min-w-full ">
          {question.options &&
            question.options.map((option) => (
              <EditableOptions
                key={option.id}
                option={option}
                active={handleOptionActive(option.id)}
                optionId={option.id}
                questionId={question.id}
                setQuestions={setQuestions}
                questions={question}
                handleQuestionChange={handleQuestionChange}
              />
            ))}
          <button
            className="w-full gap-[18px] flex justify-center items-center rounded-[24px] p-4 hover:backdrop-brightness-95  shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)] bg-whitePlus"
            onClick={() => handleAddOption(question.id)}
          >
            <i className="fa-solid fa-plus" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <button
          className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-accent2"
          onClick={() => handleDeleteQuestion(question.id)}
        >
          {/* <i className='fa-solid fa-trash' /> */}
          <i className="pi pi-trash" />
        </button>

        {!question.image ? (
          <label
            htmlFor={`image-file-input${question.id}`}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-whitePlus shadow-right cursor-pointer"
          >
            <i className="pi pi-image" />
          </label>
        ) : (
          <div className="flex flex-row items-center justify-start">
            <button
              className="flex items-center justify-center px-2 py-2 w-8 h-8 text-white rounded-full cursor-pointer bg-accent2"
              onClick={() => handleRemoveFile(question.id, 'image')}
            >
              <i className="fa-solid fa-times" />
            </button>
          </div>
        )}

        <input
          id={`image-file-input${question.id}`}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, question.id, 'image')}
          style={{ display: 'none' }}
        />
        {!question.audio ? (
          <label
            htmlFor={`audio-file-input${question.id}`}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-whitePlus shadow-right cursor-pointer"
          >
            <img src={AddAudio} alt="" className="scale-75" />
          </label>
        ) : (
          <button
            className="px-2 py-1 text-white bg-red-500 rounded-full cursor-pointer"
            onClick={() => handleRemoveFile(question.id, 'audio')}
          >
            <i className="fa-solid fa-times" />
          </button>
        )}
        <input
          id={`audio-file-input${question.id}`}
          type="file"
          accept="audio/*"
          onChange={(e) => handleFileUpload(e, question.id, 'audio')}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
