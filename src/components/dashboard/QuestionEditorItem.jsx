import React, { useContext, useEffect, useRef } from 'react';
import EditableOptions from './EditableOptions';
import QuestionContext from '../../contexts/QuestionContext';
import SelectableButtons from './SelectableButtons';
import AddImage from '../../image/imageicon.svg';
import AddAudio from '../../image/audio.svg';
import Delete from '../../image/trash.svg';

export default function QuestionEditorItem({ question }) {
  const { questions, setQuestions, setSaveStatus } =
    useContext(QuestionContext);
  const questionRef = useRef(null);

  const resizeTextArea = () => {
    questionRef.current.style.height = 'auto';
    questionRef.current.style.height = questionRef.current.scrollHeight + 'px';
  };

  useEffect(resizeTextArea, [question.question]);

  const handleSetActive = (value) => {
    return question.correctAnswer === value;
  };

  const handleOverwriteDataQuestion = (questionId, value) => {
    let newData = [...questions];
    newData.find((question) => question.id === questionId).text = value;
    setQuestions(newData);
    setSaveStatus(false);
  };

  const handleMusicFileChange = (e, questionId) => {
    console.log('questionId(handleMusicfileChange): ', questionId);
    const file = e.target.files[0];
    if (file.size > 1000000) {
      alert('File size exceeds 1MB limit');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      setQuestions((prevData) => {
        const index = prevData.findIndex(
          (question) => question.id === questionId
        );
        if (index === -1) return prevData;
        const newData = [...prevData];
        newData[index] = {
          ...newData[index],
          audio: base64String,
          image: null
        };
        return newData;
      });
    };

    // remove the the music file from input
    e.target.value = '';
    setSaveStatus(false);
  };

  const handleImageFileChange = (e, questionId) => {
    console.log('questionId: ', questionId);
    const file = e.target.files[0];
    if (file.size > 1000000) {
      alert('File size exceeds 1MB limit');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      setQuestions((prevData) => {
        const index = prevData.findIndex(
          (question) => question.id === questionId
        );
        if (index === -1) return prevData;
        const newData = [...prevData];
        newData[index] = {
          ...newData[index],
          image: base64String,
          audio: null
        };
        return newData;
      });
    };

    // remove the the music file from input
    e.target.value = '';
    setSaveStatus(false);
  };

  const handleRemoveMusicFile = (questionId) => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      newData.find((question) => question.id === questionId).audio = null;
      return newData;
    });
    setSaveStatus(false);
  };

  // This function is used to remove the selected image file
  const handleRemoveImageFile = (questionId) => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      newData.find((question) => question.id === questionId).image = null;
      return newData;
    });
    setSaveStatus(false);
  };

  const handleAddOptions = (questionId) => {
    const newData = [...questions];
    newData.find((question) => question.id === questionId).options.push('');
    setQuestions(newData);
    setSaveStatus(false);
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      newData.splice(
        newData.findIndex((question) => question.id === questionId),
        1
      );
      return newData;
    });
    setSaveStatus(false);
  };

  return (
    <div className='flex w-full gap-3 mb-6'>
      <div className='flex flex-col w-full gap-6'>
        <div className='flex flex-col gap-3 p-3 bg-whitePlus shadow-right rounded-2xl'>
          <SelectableButtons question={question} />
          <h3 className='text-2xl font-bold text-accent1'>
            Question #{question.id}
          </h3>
          {question.audio && typeof question.audio === 'string' && (
            <div className='flex items-center gap-2'>
              <audio src={question.audio} controls />
            </div>
          )}
          {question.image && typeof question.image === 'string' && (
            <div className='flex items-center gap-2'>
              <img
                src={question.image}
                alt='Selected'
                className='object-cover w-full h-auto'
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}
          <div className='grid grid-cols-1 grid-rows-1 after:whitespace-pre-wrap after:content-[attr(data-replicated-value)] after:invisible '>
            <textarea
              placeholder='Question...'
              value={questions.find((q) => q.id === question.id).text}
              onChange={(e) =>
                handleOverwriteDataQuestion(question.id, e.target.value)
              }
              className='w-full col-start-1 row-start-1 resize-none overflow-hidden text-[20px] border-none bg-transparent text-md text-black active:ring-0 focus:ring-0 ring-0'
              ref={questionRef}
              onInput={resizeTextArea}
            />
          </div>
        </div>
        <div className='flex flex-col gap-[18px] min-w-full '>
          {question.options &&
            question.options.map((option, index) => (
              <EditableOptions
                key={index}
                option={option}
                active={handleSetActive(option)}
                index={index}
                questionId={question.id}
              />
            ))}
          <button
            className='w-full gap-[18px] flex justify-center items-center rounded-[24px] px-[15px] py-[20px] hover:backdrop-brightness-95  shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)] bg-whitePlus'
            onClick={() => handleAddOptions(question.id)}>
            <i className='fa-solid fa-plus' />
          </button>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <button
          className='w-[37px] h-[37px] text-white rounded-full bg-accent2 flex justify-center items-center'
          onClick={() => handleDeleteQuestion(question.id)}>
          {/* <i className='fa-solid fa-trash' /> */}
          <img src={Delete} alt='' />
        </button>
        {!question.audio ? (
          <label
            htmlFor={`audio-file-input${question.id}`}
            className='w-[37px] h-[37px] flex justify-center items-center rounded-full bg-whitePlus shadow-right'>
            {/* <i className='text-black fa-solid fa-audio' /> */}
            <img src={AddAudio} alt='' />
          </label>
        ) : (
          <button
            className='px-2 py-1 text-white bg-red-500 rounded-full'
            onClick={() => handleRemoveMusicFile(question.id)}>
            <i className='fa-solid fa-times' />
          </button>
        )}
        <input
          id={`audio-file-input${question.id}`}
          type='file'
          accept='audio/*'
          onChange={(e) => handleMusicFileChange(e, question.id)}
          style={{ display: 'none' }}
        />
        {!question.image ? (
          <label
            htmlFor={`image-file-input${question.id}`}
            className='w-[37px] h-[37px] flex justify-center items-center rounded-full bg-whitePlus shadow-right'>
            {/* <i className='text-black fa-regular fa-image' /> */}
            <img src={AddImage} alt='' />
          </label>
        ) : (
          <button
            className='flex items-center justify-center px-2 py-2 text-white rounded-full bg-accent2'
            onClick={() => handleRemoveImageFile(question.id)}>
            <i className='fa-solid fa-times' />
          </button>
        )}
        <input
          id={`image-file-input${question.id}`}
          type='file'
          accept='image/*'
          onChange={(e) => handleImageFileChange(e, question.id)}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
