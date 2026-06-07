'use client';

import api from '@/lib/api/client';
import { HeaderQuestionEditor } from '@/components/Header';
import QuestionEditorItem from '@/components/dashboard/QuestionEditorItem';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Divider } from 'primereact/divider';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Toast } from 'primereact/toast';

export default function QuestionEditorPage() {
  const params = useParams();
  const questionId = params.questionId;
  const [questions, setQuestions] = useState([]);
  const [saveStatus, setSaveStatus] = useState(true);
  const [questionName, setQuestionName] = useState('Question Name');
  const toast = useRef(null);

  const initialQuestions = [
    {
      id: 1,
      text: '',
      options: [
        { id: 1, text: '' },
        { id: 2, text: '' },
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
    });
  };

  const showSuccessSaving = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Success saving questions',
      detail: 'Questions saved',
      life: 2000,
    });
  };

  const saveQuestionsTimerRef = useRef(null);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions/' + questionId);
      if (response && response.data.questions === null) {
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
    setSaveStatus('loading');
    clearTimeout(saveQuestionsTimerRef.current);
    saveQuestionsTimerRef.current = setTimeout(
      () => saveQuestions(false),
      5000
    );
  };

  const saveQuestions = async (showToast) => {
    try {
      const res = await api.put('/questions/update/' + questionId, {
        questions,
      });
      setQuestions(res.data.questions);
      setSaveStatus(true);
      if (showToast) {
        showSuccessSaving();
      }
    } catch (error) {
      setSaveStatus('failed');
      if (showToast) {
        showErrorSaving(error.response?.data?.msg?.message);
      }
      console.error('Failed to save questions', error);
    }
  };

  useEffect(() => {
    fetchQuestions();

    return () => {
      clearTimeout(saveQuestionsTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      return [...prevData, newQuestion];
    });
  };

  return (
    <div className="relative overflow-hidden">
      <HeaderQuestionEditor
        saveStatus={saveStatus}
        questionName={questionName}
        saveQuestions={saveQuestions}
        toast={toast}
        questionId={questionId}
        fetchQuestions={fetchQuestions}
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
            <div key={question.id}>
              <QuestionEditorItem
                question={question}
                questions={questions}
                setQuestions={setQuestions}
                index={index}
                handleQuestionChange={handleQuestionChange}
                saveStatus={saveStatus}
                initialQuestions={initialQuestions}
              />
              <Divider style={{ margin: '0px' }} />
            </div>
          ))}
        </div>
      </ScrollPanel>
      <button
        className="fixed z-20 flex items-center justify-center p-4 text-white rounded-full bottom-7 right-7 bg-accent1"
        onClick={handleAddNewQuestion}
      >
        <i className="pi pi-plus"></i>
      </button>
    </div>
  );
}
