import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext
} from 'react';
import api from '../config/index';
import AuthContext from './AuthContext';
import UnsaveWarning from '../components/dashboard/UnsaveWarning';

const QuestionContext = createContext();

const questionsInitial = [
  {
    id: 1,
    text: '',
    options: [
      {
        id: 1,
        text: ''
      }
    ],
    audio: null,
    image: null,
    type: 'Listening',
    correctAnswer: ''
  }
];

export function QuestionProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState(
    JSON.parse(localStorage.getItem('questions')) ?? questionsInitial
  );
  const [examActive, setExamActive] = useState('');
  const [saveStatus, setSaveStatus] = useState(true);

  console.log('questions in context', questions);

  useEffect(() => {
    api
      .get(`/exam`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`
        }
      })
      .then((response) => {
        setExamActive(response.data[0]._id);
      });
  }, [user]);

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
        `/questions/${examActive}`,
        { questions: questions },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem('access_token')
            )}`
          }
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
      setSaveStatus
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions]
  );

  return (
    <QuestionContext.Provider value={value}>
      {!saveStatus && <UnsaveWarning />}
      {children}
    </QuestionContext.Provider>
  );
}

export default QuestionContext;
