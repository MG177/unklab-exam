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
  const [questions, setQuestions] = useState(null);
  const [question, setQuestion] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchQuestion = async () => {
    try {
      const response = await api.get(`students/${user.noreg}/onebyone`);
      setQuestion(response.data[0]);
      if (response.status === 204) {
        // navigate('/waiting');
      }
      if (response.status === 404) {
        // navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQuestions = async () => {
    console.log('inside fetchQuestions');
    try {
      const response = await api.get(`student/${user.noreg}`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      if (!response.data) {
        // navigate('/started');
      } else {
        const filteredData = response.data.filter((item) => item !== null);
        setQuestions(filteredData);
        setLoadingQuestion(false);
        if (filteredData.length === 0) {
          // navigate('/waiting');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function fetchData() {
    await fetchQuestions();
    await fetchQuestion();
    setLoading(false);
  }

  useEffect(() => {
    // console.log('user from exam = ', user);

    console.log('question = ', questions);

    fetchData();
  }, [examId, navigate]);

  // useEffect(() => {
  //   if (question === questions.length) {
  //     if (question === 0) {
  //       return;
  //     }
  //   }
  // }, [question, questions.length, navigate]);

  const handleAnswer = (index) => {
    setAnswer(index);
  };

  const handleActive = (index) => {
    return answer === index;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      {!loadingQuestion && (
        <div className="flex flex-col w-full gap-[18px] py-28 overflow-y-auto justify-center items-center min-h-screen">
          <Question question={question} media={media} />
          <div className="flex flex-col gap-[18px] mb-10">
            {question.options.map((option) => (
              <Option
                key={option.id} // Use option.id as the key
                answerId={option.id} // Pass option.id to handleAnswer
                option={option.text} // Use option.text as the option
                active={handleActive(option.id)} // Pass option.text to handleActive
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
        fetchQuestion={fetchQuestion}
      />
    </>
  );
}
