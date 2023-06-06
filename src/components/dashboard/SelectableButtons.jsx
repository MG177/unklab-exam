import { useContext } from 'react';
import QuestionContext from '../../contexts/QuestionContext';

export default function SelectableButtons({ question }) {
  const { setQuestions, setSaveStatus } = useContext(QuestionContext);
  // const [selectedButton, setSelectedButton] = useState('Listening');

  // useEffect(() => {
  //   const question = questions.find((question) => question.id === questionId);
  //   setSelectedButton(question.type);
  // }, [questionId, questions]);

  const options = ['Listening', 'Grammar', 'Vocabulary', 'Reading'];

  const handleButtonClick = (buttonName) => {
    setQuestions((prevData) => {
      const index = prevData.findIndex(
        (findQuestion) => findQuestion.id === question.id
      );
      if (index === -1) return prevData;
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        type: buttonName,
      };
      return newData;
    });
    setSaveStatus(false);
  };

  return (
    <div className="flex gap-2 mb-1">
      {options.map((option) => (
        <button
          key={option}
          className={`py-1 px-4 rounded-full ${
            question.type.toLowerCase() === option.toLowerCase()
              ? 'bg-accent1 text-white'
              : 'bg-white text-gray'
          } font-bold text-xs`}
          onClick={() => handleButtonClick(option.toLowerCase())}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
