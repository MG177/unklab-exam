import { useContext } from 'react';
import QuestionContext from '../../contexts/QuestionContext';

export default function SelectableButtons({ question }) {
  const { setQuestions, setSaveStatus } = useContext(QuestionContext);
  // const [selectedButton, setSelectedButton] = useState('Listening');

  // useEffect(() => {
  //   const question = questions.find((question) => question.id === questionId);
  //   setSelectedButton(question.type);
  // }, [questionId, questions]);

  const handleButtonClick = (buttonName) => {
    // setSelectedButton(buttonName);

    setQuestions((prevData) => {
      const index = prevData.findIndex(
        (findQuestion) => findQuestion.id === question.id
      );
      if (index === -1) return prevData;
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        type: buttonName
      };
      return newData;
    });
    setSaveStatus(false);
  };

  return (
    <div className='flex gap-3 mb-3'>
      <button
        className={`py-1 px-4 rounded-full ${
          question.type.toLowerCase() === 'grammar'
            ? 'bg-accent1 text-white'
            : 'bg-white text-gray '
        } font-bold text-sm font-Roboto`}
        onClick={() => handleButtonClick('grammar')}>
        Grammar
      </button>
      <button
        className={`py-1 px-4 rounded-full ${
          question.type.toLowerCase() === 'listening'
            ? 'bg-accent1 text-white'
            : 'bg-white text-gray'
        } font-bold text-sm`}
        onClick={() => handleButtonClick('listening')}>
        Listening
      </button>
      <button
        className={`py-1 px-4 rounded-full ${
          question.type.toLowerCase() === 'reading'
            ? 'bg-accent1 text-white'
            : 'bg-white text-gray'
        } font-bold text-sm`}
        onClick={() => handleButtonClick('reading')}>
        Reading
      </button>
      <button
        className={`py-1 px-4 rounded-full ${
          question.type.toLowerCase() === 'vocabulary'
            ? 'bg-accent1 text-white'
            : 'bg-white text-gray'
        } font-bold text-sm`}
        onClick={() => handleButtonClick('vocabulary')}>
        Vocabulary
      </button>
    </div>
  );
}
