import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config';
import Footer from '../components/Footer';
import Question from '../components/Question';
import Option from '../components/Option';
import Header from '../components/Header';
import sound from '../media/no7.mp3';
import img from '../media/gunting.jpg';

const media = {
  audio: sound,
  image: img
};

export default function Exam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`questions/exam/${examId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.data) {
          navigate('/started');
        }
        setQuestions(response.data.questions);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestions();
  }, [examId, navigate]);
  console.log(localStorage.getItem('token'))
  console.log(questions);
  useEffect(() => {
    if (question === questions.length - 1) {
      if (question === 0) {
        return;
      }
      navigate('/score');
    }
  }, [question, questions.length, navigate]);

  const handleAnswer = (index) => {
    setAnswer(index);
  };

  const handleActive = (index) => {
    return answer === index;
  };

  return (
    <>
      <Header />
      {!loading && (
        <div className='flex flex-col w-full gap-[18px] py-28 overflow-y-auto justify-center items-center min-h-screen'>
          <Question question={question} questions={questions} media={media} />
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