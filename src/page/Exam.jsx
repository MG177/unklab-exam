import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config';
import Footer from '../components/Footer';
import Question from '../components/Question';
import Option from '../components/Option';
import Header from '../components/Header';
import sound from '../media/no7.mp3';
import img from '../media/gunting.jpg';
import AuthContext from '../contexts/AuthContext';

const media = {
  audio: sound,
  image: img,
};

export default function Exam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [questions, setQuestions] = useState([1]);
  const [question, setQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(0);
  const { user, getAllLocalData } = useContext(AuthContext);
  const [questionLength, setQuestionLength] = useState(0);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(
          'students/' + JSON.parse(localStorage.getItem('noreg')),
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
            },
          }
        );
        if (!response.data) {
          navigate('/started');
        } else {
          const filteredData = response.data.filter((item) => item !== null);
          setQuestions(filteredData);
          setQuestionLength(response.data.length);
          setLoading(false);
          if (filteredData.length === 0) {
            navigate('/waiting');
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTime = async () => {
      try {
        const response = await api.get(`time/${JSON.parse(localStorage.getItem('examId'))}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        setTime(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    async function fetchData() {
      await fetchQuestions();
      await fetchTime();
    }

    fetchData();

    const intervalId = setInterval(() => {
      fetchTime();
    }, 5000); // Send request every 5 seconds

    return () => clearInterval(intervalId); // Clear interval when component unmounts
  }, [examId, navigate]);

  useEffect(() => {
    if (question === questions.length) {
      if (question === 0) {
        return;
      }
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
        <div className="flex flex-col w-full gap-[18px] py-28 overflow-y-auto justify-center items-center min-h-screen">
          <Question question={question} questions={questions} media={media} />
          <div className="flex flex-col gap-[18px] mb-10">
            {questions[question].option.map((option, index) => (
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
        answer={answer}
        setAnswer={setAnswer}
        setQuestion={setQuestion}
        time={time}
        questionLength={questionLength}
      />
    </>
  );
}
