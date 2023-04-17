import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config';
import Footer from '../components/Footer';
import Question from '../components/Question';
import Option from '../components/Option';
import Header from '../components/Header';

export default function Exam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('questions/exam/' + examId, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then((response) => {
        if (!response.data) {
          navigate('/started');
        }
        console.log('Hello bang', response.data);
        setQuestions(response.data.questions);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Hello bang', error);
      });
    }, [examId, navigate]);
  useEffect(() => {
    if (question === questions.length - 1) {
      navigate('/score');
    }
  }, [question, questions.length, navigate]);

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
      {!loading && (
        <div className='flex flex-col w-full gap-[18px] py-28 overflow-y-auto justify-center items-center min-h-screen'>
          <Question question={question} questions={questions} />
          <div className='flex flex-col gap-[18px] mb-10'>
            {questions[question].options.map((option, index) => (
              <Option
                key={index}
                option={option}
                active={handleActive(option)}
                handleAnswer={handleAnswer}
              />
            ))}
          </div>
        </div>
      )}
      <Footer
        questions={questions}
        question={question}
        setQuestion={setQuestion}
      />
    </>
  );
}
