import { useState, useEffect, useContext } from 'react';
import QuestionContext from '../../contexts/QuestionContext';

export default function SelectableButtons({ questionId }) {
  const { questions, setQuestions } = useContext(QuestionContext);
  const [selectedButton, setSelectedButton] = useState('Listening');

  useEffect(() => {
    const question = questions.find((question) => question.id === questionId);
    setSelectedButton(question.type);
  }, [questionId, questions]);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);

    setQuestions((prevData) => {
      const index = prevData.findIndex(
        (question) => question.id === questionId
      );
      if (index === -1) return prevData;
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        type: buttonName
      };
      return newData;
    });
  };

  return (
    <div className='flex gap-3 mb-3'>
      <button
        className={`py-1 px-4 rounded-full ${
          selectedButton === 'Listening'
            ? 'bg-accent1 text-white'
            : 'bg-slate-300 text-white'
        } font-bold text-sm`}
        onClick={() => handleButtonClick('Listening')}>
        Listening
      </button>
      <button
        className={`py-1 px-4 rounded-full ${
          selectedButton === 'Reading'
            ? 'bg-accent1 text-white'
            : 'bg-slate-300 text-white'
        } font-bold text-sm`}
        onClick={() => handleButtonClick('Reading')}>
        Reading
      </button>
      <button
        className={`py-1 px-4 rounded-full ${
          selectedButton === 'Grammar'
            ? 'bg-accent1 text-white'
            : 'bg-slate-300 text-white'
        } font-bold text-sm`}
        onClick={() => handleButtonClick('Grammar')}>
        Grammar
      </button>
      <button
        className={`py-1 px-4 rounded-full ${
          selectedButton === 'Vocabulary'
            ? 'bg-accent1 text-white'
            : 'bg-slate-300 text-white'
        } font-bold text-sm`}
        onClick={() => handleButtonClick('Vocabulary')}>
        Vocabulary
      </button>
    </div>
  );
}
