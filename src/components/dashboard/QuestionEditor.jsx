import api from '../../config';
import { HeaderQuestionEditor } from '../Header';
import QuestionEditorItem from './QuestionEditorItem';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Divider } from 'primereact/divider';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Toast } from 'primereact/toast';

export default function QuestionEditor() {
  const { questionId } = useParams();
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState(true);
  const [questionName, setQuestionName] = useState('Question Name');
  const toast = useRef(null);

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

  const showErrorSaving = (msg) => {
    toast.current.show({
      severity: 'error',
      summary: 'Error when saving questions',
      detail: msg,
      life: 5000,
      // sticky: true,
    });
  };

  const showSuccessSaving = (msg) => {
    toast.current.show({
      severity: 'success',
      summary: 'Success saving questions',
      detail: msg,
      life: 2000,
      // sticky: true,
    });
  };

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
    saveQuestionsTimerRef.current = setTimeout(
      () => saveQuestions(false),
      5000
    );
  };

  const saveQuestions = async (toast) => {
    try {
      console.log('questions - saveQuestions: ', questions);

      const res = await api.put('/questions/update/' + questionId, {
        questions,
      });
      console.log('res.data:', res.data);
      setQuestions(res.data.questions);
      setSaveStatus(true);
      if (toast) {
        showSuccessSaving();
      }
      console.log('Questions saved successfully');
    } catch (error) {
      setSaveStatus('failed');
      if (toast) {
        showErrorSaving(error.response.data.msg.message);
      }
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
    <div className="relative overflow-hidden">
      <HeaderQuestionEditor
        saveStatus={saveStatus}
        questionName={questionName}
        saveQuestions={saveQuestions}
      />

      <ScrollPanel style={{ width: '100%', height: '100vh' }}>
        <div className="flex flex-col items-center justify-center w-full gap-5 my-24">
          <Toast
            ref={toast}
            style={{
              marginTop: '4rem',
              borderRadius: '1rem',
              boxShadow: '0 0 #0000',
            }}
            pt={{
              icon: '1rem',
            }}
          />
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
                initialQuestions={initialQuestions}
              />
              <Divider style={{ margin: '0px' }} />
            </>
          ))}
        </div>
      </ScrollPanel>
      <button
        className="p-4 flex justify-center items-center fixed bottom-7 z-20 right-7 bg-accent1 rounded-full text-white"
        onClick={handleAddNewQuestion}
      >
        <i className="pi pi-plus"></i>
      </button>
    </div>
  );
}
