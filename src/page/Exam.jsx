import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import Question from '../components/Question';
import Option from '../components/Option';
import Header from '../components/Header';

const questionsssss = [
  {
    question: 'What is the capital of Indonesia?',
    options: ['Jakarta', 'Bandung', 'Surabaya', 'Medan'],
    answer: 2,
  },
];


export default function Exam() {
  // This state is used to store the answer chosen by the user
  const [answer, setAnswer] = useState('');
  const [questions, setQuestions] = useState([]);
  const [customOrder, setCustomOrder] = useState([9, 2, 1, 7, 4, 5, 8, 6, 0, 3]);

  
  useEffect(() => {
    axios.get('//localhost:3000/questions/exam/643b089a21c7035d5c8e26d4',{
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5kb2UiLCJzdWIiOiIxMjMiLCJyb2xlIjpbImFkbWluIl0sImlhdCI6MTY4MTYwNTA1OCwiZXhwIjoxNjgxNjkxNDU4fQ.zoSua-7Xn0esuox8kzw90GvOROrAE27o68w5NlacoIg'  
      }
    })
      .then(response => {
        setQuestions(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.log(error);
      });
  });
  // console.log(questions);
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
        <Question question={questions ? questions.questions[0]:"test"} />
        <div className='flex flex-col gap-[18px]'>
          {questions.questions[0].options.map((option, index) => (
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