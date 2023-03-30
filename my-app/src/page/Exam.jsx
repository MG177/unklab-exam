import React, { useState } from 'react';
import Footer from '../components/Footer';
import Question from '../components/Question';
import Option from '../components/Option';
import Header from '../components/Header';

const questions = [
  {
    question: 'What is the capital of Indonesia?',
    options: ['Jakarta', 'Bandung', 'Surabaya', 'Medan'],
    answer: 2,
  },
];

export default function Exam() {
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
    <>
      <Header />
      <div className='flex flex-col w-full h-screen gap-[18px] justify-center items-center bg-[#FAFAFA]'>
        <Question question={questions[0].question} />
        <div className='flex flex-col gap-[18px]'>
          {questions[0].options.map((option, index) => (
            <Option
              key={index}
              option={option}
              active={handleActive(option)}
              handleAnswer={handleAnswer}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
} 