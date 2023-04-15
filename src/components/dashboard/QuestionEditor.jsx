import React, { useState } from 'react';
import Option from '../../components/Option';

const questions = [
  {
    question: 'What is the capital of Indonesia?',
    options: ['Jakarta', 'Bandung', 'Surabaya', 'Medan'],
    answer: 2
  }
];

export default function Sidebar() {
  // This state is used to store the answer chosen by the user
  const [answer, setAnswer] = useState('');

  // This function allows you to select an answer by passing in the index of the answer
  const handleAnswer = (index) => {
    // This sets the answer state to the index of the answer chosen
    setAnswer(index);
    // This logs the index of the answer chosen to the console
    console.log(index);
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

  return (
    <div className='flex flex-col font-Nunito h-screen min-w-fit bg-white shadow-right z-20'>
      <div className='flex flex-col items-center justify-start p-3 h-16 max-w-lg'>
        <h1 className='text-3xl w-full text-center font-bold text-white bg-accent1 p-4 rounded-2xl mb-3'>
          QUESTION EDITOR
        </h1>
        <div className='flex gap-3 mb-6'>
          <div className=' w-full flex flex-col gap-6'>
            <div className='bg-white shadow-right p-3 rounded-2xl'>
              <div className='flex gap-3 mb-3'>
                <button className='py-1 px-4 rounded-full bg-accent1 text-white font-bold text-sm'>
                  Listening
                </button>
                <button className='py-1 px-4 rounded-full bg-slate-300 text-white font-bold text-sm'>
                  Reading
                </button>
                <button className='py-1 px-4 rounded-full bg-slate-300 text-white font-bold text-sm'>
                  Grammar
                </button>
                <button className='py-1 px-4 rounded-full bg-slate-300 text-white font-bold text-sm'>
                  Vocabulary
                </button>
              </div>
              <h3 className='text-2xl font-bold text-accent1'>Question #1</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa
                fugit placeat reprehenderit esse incidunt officiis deleniti
                assumenda neque est labore!
              </p>
            </div>
            <div className='flex flex-col gap-[18px] min-w-full'>
              {questions[0].options.map((option, index) => (
                <Option
                  key={index}
                  option={option}
                  active={handleActive(option)}
                  handleAnswer={handleAnswer}
                  widthFit
                />
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <button className='p-2 bg-accent2 rounded-full leading-none shadow-right'>
              <i className='fa-regular fa-trash-can text-white' />
            </button>
            <button className='p-2 bg-white rounded-full leading-none shadow-right'>
              <i className='fa-solid fa-music text-black' />
            </button>
            <button className='p-2 bg-white rounded-full leading-none shadow-right'>
              <i className='fa-regular fa-image text-black' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
