import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ScrollPanel } from 'primereact/scrollpanel';
import Questions from '../components/Question';

export default function Exam() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(null);
  const [number, setNumber] = useState(
    Number(sessionStorage.getItem('number')) || 0
  );
  const [loading, setLoading] = useState(true);
  const textSize = [
    'text-xs',
    'text-sm',
    'text-md',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'text-5xl',
    'text-5xl',
    'text-5xl',
    'text-5xl',
    'text-5xl',
    'text-5xl',
    'text-5xl',
  ];
  const [size, setSize] = useState(3);
  console.log('size: ', size);
  console.log('textSize: ', textSize[size]);

  const fetchQuestion = async () => {
    try {
      const response = await api.get('student/questions');
      console.log('fetchQuestion', response.data);
      // setAnswer(response.data.answer);
      setQuestions(response.data);
      setLoading(false);
      if (response.status === 404) {
        throw new Error('Question not found');
      }
    } catch (error) {
      navigate('/');
      console.log(error);
    }
  };
  useEffect(() => {
    fetchQuestion();
    sessionStorage.setItem('number', number);
  }, [number]);

  const handleSize = (operator) => {
    if (size === 0 && operator === -1) {
      return;
    } else if (size === 8 && operator === +1) {
      return;
    }
    setSize((prev) => prev + operator);
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <Header />
      {questions && (
        <>
          <div className="fixed flex top-24 right-6 flex-row gap-2 items-center justify-center bg-whitePlus rounded-full px-3 py-1 shadow-md border border-gray/20 z-50 opacity-20 hover:opacity-100 transition-all duration-200 ease-out font-bold">
            <button
              className="pi pi-minus"
              onClick={() => handleSize(-1)}
            ></button>
            <span className="text-xl font-normal select-none">Aa</span>
            <button
              className="pi pi-plus"
              onClick={() => handleSize(+1)}
            ></button>
          </div>
          <ScrollPanel style={{ width: '100%', height: '100vh' }}>
            <div className="flex flex-col w-full py-28 justify-center items-center min-h-screen">
              <Questions
                questions={questions}
                number={number}
                textSize={textSize}
                size={size}
              />
            </div>
          </ScrollPanel>
          <Footer questions={questions} number={number} setNumber={setNumber} />
        </>
      )}
    </>
  );
}
