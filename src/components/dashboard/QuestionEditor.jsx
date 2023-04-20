import React, { useState } from 'react';
import QuestionEditorItem from './QuestionEditorItem';

const questions = [
  {
    question: '',
    options: ['', ''],
    answer: 0,
    music: null,
    image: null
  }
];

export default function QuestionEditor() {
  // This state is used to store the answer chosen by the user
  const [answer, setAnswer] = useState('');
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem('questions')) ?? questions
  );

  const handleOptionsChange = (index, value) => {
    const newData = [...data];
    // console.log('newData ', newData);
    newData[index] = { ...newData[index], options: value };
    // setData(newData);
  };

  const handleOverwriteDataQuestion = (index, value) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], question: value };
      return newData;
    });
  };

  console.log(data);

  // This function allows you to select an answer by passing in the index of the answer
  const handleAnswer = (index) => {
    // This sets the answer state to the index of the answer chosen
    setAnswer(index);
    // This logs the index of the answer chosen to the console
    // console.log(index);
  };

  // This function is used to check whether the answer is correct or not
  const handleActive = (index) => {
    // check if the answer is the same as the index
    if (answer === index) {
      // if true, return true
      return true;
      // if the answer is not the same as the index
    } else if (answer !== index) {
      // return false
      return false;
    }
  };

  const handleMusicFileChange = (e, currentQuestion) => {
    const file = e.target.files[0];
    if (file.size > 5000000) {
      alert('File size exceeds 5MB limit');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      setData((prevData) => {
        const newData = prevData.map((question, index) => {
          if (index === currentQuestion) {
            return { ...question, music: base64String };
          } else {
            return question;
          }
        });
        return newData;
      });
    };
  };

  const handleImageFileChange = (e, i) => {
    const file = e.target.files[0];
    if (file.size > 5000000) {
      alert('File size exceeds 5MB limit');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      setData((prevData) => {
        const newData = [...prevData];
        newData[i] = { ...newData[i], image: base64String };
        newData[i].music = null;
        return newData;
      });
    };
  };

  // This function is used to remove the selected music file
  const handleRemoveMusicFile = (i) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[i].music = null;
      return newData;
    });
  };

  // This function is used to remove the selected image file
  const handleRemoveImageFile = (i) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[i].image = null;
      return newData;
    });
  };

  const handleSave = () => {
    localStorage.setItem('questions', JSON.stringify(data));
  };

  const handleAddQuestion = () => {
    setData((prevData) => {
      const newData = [...prevData];
      newData.push({
        question: '',
        options: [''],
        answer: 0,
        music: null,
        image: null
      });
      return newData;
    });
  };

  const handleAddOptions = (index) => {
    const newData = [...data];
    console.log('newData ', newData[index]);
    newData[index].options.push('');
    setData(newData);
  };

  const handleDeleteQuestion = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  return (
    <div className='flex flex-col font-Nunito h-screen overflow-y-scroll min-w-fit bg-white shadow-right z-20'>
      <div className='flex flex-col items-center justify-start p-3 max-w-lg'>
        <h1 className='text-3xl w-full text-center font-bold text-white bg-accent1 p-4 rounded-2xl mb-3'>
          QUESTION EDITOR
        </h1>
        {data.map((question, index) => (
          <QuestionEditorItem
            key={index}
            data={data}
            currentQuestion={index}
            handleOverwriteDataQuestion={handleOverwriteDataQuestion}
            handleActive={handleActive}
            handleAnswer={handleAnswer}
            handleOptionsChange={handleOptionsChange}
            handleRemoveMusicFile={handleRemoveMusicFile}
            handleRemoveImageFile={handleRemoveImageFile}
            handleMusicFileChange={handleMusicFileChange}
            handleImageFileChange={handleImageFileChange}
            handleAddOptions={handleAddOptions}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        ))}
        <div className='flex w-full gap-3'>
          <button
            className='bg-accent1 flex-1 w-full text-white rounded-full py-3 text-3 font-medium'
            onClick={handleSave}>
            Save
          </button>
          <button
            className='bg-accent1 w-12 text-white rounded-full py-3 text-3 font-medium'
            onClick={handleAddQuestion}>
            <i className='fa-solid fa-plus' />
          </button>
        </div>
      </div>
    </div>
  );
}
