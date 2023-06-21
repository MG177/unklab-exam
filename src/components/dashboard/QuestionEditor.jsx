import api from '../../config';
import { HeaderQuestionEditor } from '../Header';
import QuestionEditorItem from './QuestionEditorItem';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Divider } from 'primereact/divider';

export default function QuestionEditor() {
  const { questionId } = useParams();
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState(true);
  const [questionName, setQuestionName] = useState('Question Name');

  const initialQuestions = [
    {
      id: 1,
      text: '',
      options: [
        {
          id: 1,
          text: '',
        },
        {
          id: 2,
          text: '',
        },
      ],
      image: null,
      audio: null,
      correctAnswer: 1,
    },
  ];

  const saveQuestionsTimerRef = useRef(null);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions/' + questionId);
      if (response && response.data.questions === null) {
        console.log('No questions found');
        setQuestions(initialQuestions);
      } else {
        setQuestions(response.data.questions);
      }
      setQuestionName(response.data.questionName);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuestionChange = () => {
    console.log('questions - handleQuestionChange', questions);
    
    setSaveStatus('loading');
    clearTimeout(saveQuestionsTimerRef.current);
    saveQuestionsTimerRef.current = setTimeout(saveQuestions, 3000);
  };

  const saveQuestions = async () => {
    try {
      console.log('questions - saveQuestions: ', questions);

      const res = await api.put('/questions/' + questionId, { questions });
      setQuestions(res.data.questions);
      setSaveStatus(true);
      console.log('Questions saved successfully');
    } catch (error) {
      setSaveStatus('failed');
      console.error('Failed to save questions', error);
    }
  };

  useEffect(() => {
    console.log('questions - updated:', questions);
  }, [questions]);

  useEffect(() => {
    fetchQuestions();

    return () => {
      clearTimeout(saveQuestionsTimerRef.current);
    };
  }, [questionId]);

  const handleAddNewQuestion = () => {
    setQuestions((prevData) => {
      let newQuestionId = 1;
      while (prevData.find((question) => question.id === newQuestionId)) {
        newQuestionId++;
      }

      const newQuestion = {
        ...initialQuestions[0],
        id: newQuestionId,
      };

      const newData = [...prevData, newQuestion];
      return newData;
    });
  };

  return (
    <div className="relative">
      <HeaderQuestionEditor
        saveStatus={saveStatus}
        questionName={questionName}
      />

      <div className="flex flex-col items-center justify-center w-full gap-5 my-24">
        {questions.map((question, index) => (
          <>
            <QuestionEditorItem
              key={index}
              question={question}
              questions={questions}
              setQuestions={setQuestions}
              index={index}
              handleQuestionChange={handleQuestionChange}
              saveStatus={saveStatus}
            />
            <Divider style={{ margin: '0px' }} />
          </>
        ))}
      </div>
      <button
        className="p-4 flex justify-center items-center fixed bottom-7 right-7 bg-accent1 rounded-full text-white"
        onClick={handleAddNewQuestion}
      >
        <i className="pi pi-plus"></i>
      </button>
    </div>
  );
}
