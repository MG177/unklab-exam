import React, { createContext, useState, useMemo } from 'react';

const QuestionContext = createContext();

const questionsInitial = [
  {
    id: 1,
    question: '',
    options: [''],
    answer: -1,
    music: null,
    image: null,
    type: 'Listening'
  }
];

export function QuestionProvider({ children }) {
  const [questions, setQuestions] = useState(
    JSON.parse(localStorage.getItem('questions')) ?? questionsInitial
  );

  console.log('questions', questions);

  const handleSave = () => {
    localStorage.setItem('questions', JSON.stringify(questions));
  };

  // calculate file size of image and music in questions
  const totalFileSize = useMemo(() => {
    let total = 0;
    questions.forEach((question) => {
      if (question.music) {
        total += question.music.length;
      }
      if (question.image) {
        total += question.image.length;
      }
    });
    return total;
  }, [questions]);

  console.log(`totalFileSize: ${totalFileSize}`);

  const value = useMemo(
    () => ({
      questions,
      setQuestions,
      handleSave
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions]
  );

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
}

export default QuestionContext;
