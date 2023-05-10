import React, { createContext, useState, useMemo, useContext } from 'react';
import api from '../config/index';
import AuthContext from './AuthContext';
import { useParams } from 'react-router-dom';
import UnsaveWarning from '../components/dashboard/UnsaveWarning';

const QuestionContext = createContext();

// const questionsInitial = [
//   {
//     id: 1,
//     text: '',
//     options: [
//       {
//         id: 1,
//         text: '',
//       },
//     ],
//     audio: null,
//     image: null,
//     type: 'Listening',
//     correctAnswer: '',
//   },
// ];

export function QuestionProvider({ children }) {
  const { examId } = useParams();
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState(null);
  const [saveStatus, setSaveStatus] = useState(true);

  console.log('questions in context', questions);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSave = () => {
    let emptyOption = false;
    questions.forEach((question) => {
      if (!question.correctAnswer) {
        emptyOption = true;
        return;
      }
      question.options.forEach((option) => {
        if (!option.text) {
          emptyOption = true;
          return;
        }
      });
    });
    if (emptyOption) {
      alert(
        'Please make sure all options and correct answers are filled in before saving.'
      );
      return;
    }

    setSaveStatus(true);
    localStorage.setItem('questions', JSON.stringify(questions));
    postQuestions();
  };

  // calculate file size of image and audio in questions
  const totalFileSize = useMemo(() => {
    let total = 0;
    if (!questions) return total;
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
      saveStatus,
      setSaveStatus,
      handleSave,
      totalFileSize,
    }),
    [handleSave, questions, saveStatus, totalFileSize]
  );

  return (
    <QuestionContext.Provider value={value}>
      {!saveStatus && <UnsaveWarning />}
      {children}
    </QuestionContext.Provider>
  );
}

export default QuestionContext;
