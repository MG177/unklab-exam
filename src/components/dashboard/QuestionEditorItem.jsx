import React from 'react';
import EditableOptions from './EditableOptions';

export default function QuestionEditorItem({
  data,
  currentQuestion,
  handleOverwriteDataQuestion,
  handleActive,
  handleAnswer,
  handleOptionsChange,
  handleRemoveMusicFile,
  handleRemoveImageFile,
  handleMusicFileChange,
  handleImageFileChange,
  handleAddOptions,
  handleDeleteQuestion
}) {
  return (
    <div className='flex gap-3 mb-6 w-full'>
      <div className='w-full flex flex-col gap-6'>
        <div className='flex gap-3 flex-col bg-white shadow-right p-3 rounded-2xl'>
          <h3 className='text-2xl font-bold text-accent1'>
            Question #{currentQuestion + 1}
          </h3>
          {data[currentQuestion].music &&
            typeof data[currentQuestion].music === 'string' && (
              <div className='flex items-center gap-2'>
                <audio src={data[currentQuestion].music} controls />
              </div>
            )}
          {data[currentQuestion].image &&
            typeof data[currentQuestion].image === 'string' && (
              <div className='flex items-center gap-2'>
                <img
                  src={data[currentQuestion].image}
                  alt='Selected'
                  className='w-full h-auto object-cover'
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}
          <textarea
            value={data[currentQuestion].question}
            onChange={(e) =>
              handleOverwriteDataQuestion(currentQuestion, e.target.value)
            }
            className='w-full text-[20px] border-none'
          />
        </div>
        <div className='flex flex-col gap-[18px] min-w-full'>
          {data[currentQuestion].options &&
            data[currentQuestion].options.map((option, index) => (
              <EditableOptions
                key={index}
                option={option}
                active={handleActive(index)}
                handleAnswer={handleAnswer}
                handleOptionsChange={handleOptionsChange}
                index={index}
              />
            ))}
          <button
            className='w-full gap-[18px] flex justify-center items-center rounded-[24px] px-[15px] py-[20px] hover:backdrop-brightness-95  shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)] bg-white'
            onClick={() => handleAddOptions(currentQuestion)}>
            <i className='fa-solid fa-plus' />
          </button>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <button
          className='bg-accent2 text-white rounded-full px-2 py-1'
          onClick={() => handleDeleteQuestion(currentQuestion)}>
          <i className='fa-solid fa-trash' />
        </button>
        {!data[currentQuestion].music ? (
          <label
            htmlFor='music-file-input'
            className='p-2 bg-white rounded-full leading-none shadow-right'>
            <i className='fa-solid fa-music text-black' />
          </label>
        ) : (
          <button
            className='bg-red-500 text-white rounded-full px-2 py-1'
            onClick={() => handleRemoveMusicFile(currentQuestion)}>
            <i className='fa-solid fa-times' />
          </button>
        )}
        <input
          id='music-file-input'
          type='file'
          accept='audio/*'
          onChange={(e) => handleMusicFileChange(e, currentQuestion)}
          style={{ display: 'none' }}
        />
        {!data[currentQuestion].image ? (
          <label
            htmlFor='image-file-input'
            className='p-2 bg-white rounded-full leading-none shadow-right'>
            <i className='fa-regular fa-image text-black' />
          </label>
        ) : (
          <button
            className='bg-red-500 text-white rounded-full px-2 py-1'
            onClick={() => handleRemoveImageFile(currentQuestion)}>
            <i className='fa-solid fa-times' />
          </button>
        )}
        <input
          id='image-file-input'
          type='file'
          accept='image/*'
          onChange={(e) => handleImageFileChange(e, currentQuestion)}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
