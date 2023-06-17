import { useContext, useState } from 'react';
import QuestionContext from '../../contexts/QuestionContext';

export default function SelectableButtons({ question }) {
  const { setQuestions, setSaveStatus } = useContext(QuestionContext);
  const [selectedOption, setSelectedOption] = useState(question.type);

  const options = ['Listening', 'Grammar', 'Vocabulary', 'Reading'];

  const handleOptionChange = (selectedValue) => {
    setSelectedOption(selectedValue);

    setQuestions((prevData) => {
      const index = prevData.findIndex(
        (findQuestion) => findQuestion.id === question.id
      );
      if (index === -1) return prevData;
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        type: selectedValue,
      };
      return newData;
    });
    setSaveStatus(false);
  };

  return (
    <div className="mb-1">
      <select
        className="px-4 py-1 text-xs font-bold bg-white bg-opacity-25 rounded-xl border-1 text-accent1 focus:border-none focus:ring-1 focus:outline-none"
        value={selectedOption}
        onChange={(e) => handleOptionChange(e.target.value)}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option.toLowerCase()}
            className="font-bold text-black bg-white rounded-none"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
