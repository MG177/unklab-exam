import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Sidebar } from 'primereact/sidebar';
import Questions from '../components/Question';

export default function Exam() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(null);
  const [number, setNumber] = useState(
    Number(sessionStorage.getItem('number')) || 0
  );
  const [loading, setLoading] = useState(true);
  const [navigator, setNavigator] = useState(false);
  const navigatorRef = useRef(null);
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
    'text-6xl',
    'text-7xl',
    'text-8xl',
    'text-9xl',
  ];
  const q = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
    79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97,
    98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
    113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127,
    128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142,
    143, 144, 145,
  ];
  const [size, setSize] = useState(3);
  const [visibleBottom, setVisibleBottom] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navigatorRef.current &&
        !navigatorRef.current.contains(event.target) &&
        navigator === true
      ) {
        console.log('You clicked outside of me!');
        setNavigator(false);
      } else {
        console.log('You clicked inside of me!');
      }
    };

    // Add event listener on component mount
    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  console.log('navigator', navigator);

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

  const handleNavigator = () => {
    setNavigator((prev) => !prev);
  };

  return (
    <div className="overflow-hidden">
      <Header />
      {questions && (
        <>
          <div className="fixed flex top-24 right-6 flex-row gap-2 items-center justify-center bg-whitePlus rounded-full px-3 py-1 shadow-md border border-gray/20 z-10 opacity-50 hover:opacity-100 transition-all duration-200 ease-out font-bold">
            <button
              className="pi pi-minus"
              title="Decrease font size"
              onClick={() => handleSize(-1)}
            ></button>
            <button
              className="text-xl font-normal"
              title="Default font size"
              onClick={() => setSize(3)}
            >
              Aa
            </button>
            <button
              className="pi pi-plus"
              title="Increase font size"
              onClick={() => handleSize(+1)}
            ></button>
          </div>
          <div
            className={`fixed bottom-28 ${
              navigator ? '-right-0' : '-right-[calc(30rem-1.7rem)]'
            } z-20 w-[30rem] h-[calc(100vh-15rem)] flex items-end transition-all duration-400 ease-in-out bg-transparent`}
            ref={navigatorRef}
          >
            <button
              className={`sticky flex left-10 pi ${
                navigator ? 'pi-chevron-right' : 'pi-chevron-left'
              } items-center justify-center text-xl bg-whitePlus rounded-l-3xl h-[6rem] w-[1.7rem] border border-r-0 border-gray/20 z-20 transition-all duration-200 ease-out font-bold mb-5 z-30 shadow-md`}
              onClick={() => setVisibleBottom(true)}
              // onClick={() => handleNavigator()}
            />
            {/* {navigator && ( */}
            {/* <div className="bg-whitePlus px-4 py-3 z-30 shadow-md border border-gray/20 rounded-2xl w-full h-full"> */}

            <Sidebar
              visible={visibleBottom}
              position="right"
              onHide={() => setVisibleBottom(false)}
              className="w-fit h-screen rounded-l-3xl bg-white shadow-lg"
            >
              <ScrollPanel style={{ width: '100%', height: '100%' }}>
                <div className="sticky top-0 bg-white font-bold font-Nunito text-xl z-10">
                  Navigate question :
                </div>
                <div className="grid grid-cols-10 gap-2 mr-5 my-2">
                  {questions.map((question, index) => (
                    <button
                      key={index}
                      className={`relative w-8 h-8 shadow-md rounded-lg border-2 text-xs font-Nunito font-semibold ${
                        index === number
                          ? 'bg-accent1/70 text-white'
                          : 'bg-white text-black'
                      }
                      ${question.answer ? 'border-accent1/70' : ''} 
                      border-gray/20 transition-all duration-200 ease-out`}
                      onClick={() => setNumber(index)}
                    >
                      {index + 1}
                      {question.isBookmark && (
                        <i
                          className="pi pi-bookmark-fill text-yellow-400 ml-1 absolute -top-1 -right-1"
                          style={{ fontSize: '0.6rem' }}
                        ></i>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollPanel>
            </Sidebar>
            {/* </div> */}
            {/* )} */}
          </div>
          <ScrollPanel style={{ width: '100%', height: '100vh' }}>
            <div className="flex flex-col w-full py-28 justify-center items-center min-h-screen z-0">
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
    </div>
  );
}
