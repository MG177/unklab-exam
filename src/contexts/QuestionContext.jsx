import React, { createContext, useState, useMemo, useContext } from 'react';
import api from '../config/index';
import AuthContext from './AuthContext';
import { useParams } from 'react-router-dom';
import UnsaveWarning from '../components/dashboard/UnsaveWarning';

const QuestionContext = createContext();

const questionsInitial = [
  {
    id: 1,
    text: '',
    options: [
      {
        id: 1,
        text: '',
      },
    ],
    audio: null,
    image: null,
    type: 'Listening',
    correctAnswer: '',
  },
];

export function QuestionProvider({ children }) {
  const { examId } = useParams();
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState(
    JSON.parse(localStorage.getItem('questions')) ?? questionsInitial
  );
  const [saveStatus, setSaveStatus] = useState(true);

  console.log('questions in context', questions);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSave = () => {
    setSaveStatus(true);
    localStorage.setItem('questions', JSON.stringify(questions));
    postQuestions();
  };

  // calculate file size of image and audio in questions
  const totalFileSize = useMemo(() => {
    let total = 0;
    questions.forEach((question) => {
      if (question.audio) {
        total += question.audio.length;
      }
      if (question.image) {
        total += question.image.length;
      }
    });
    return total;
  }, [questions]);

  console.log('totalFileSize', totalFileSize);

  const postQuestions = async () => {
    api
      .patch(
        `/questions/${examId}`,
        { questions: questions },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // console.log(`totalFileSize: ${totalFileSize}`);

  const value = useMemo(
    () => ({
      questions,
      setQuestions,
      handleSave,
      saveStatus,
      setSaveStatus,
    }),
    [handleSave, questions, saveStatus]
  );

  return (
    <QuestionContext.Provider value={value}>
      {!saveStatus && <UnsaveWarning />}
      {children}
    </QuestionContext.Provider>
  );
}

export default QuestionContext;
