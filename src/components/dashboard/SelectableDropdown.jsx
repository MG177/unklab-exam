import { useContext, useState } from 'react';
import QuestionContext from '../../contexts/QuestionContext';

export default function SelectableButtons({
  question,
  setQuestions,
  handleQuestionChange,
}) {
  const [selectedOption, setSelectedOption] = useState(
    question.type || 'Choose question type'
  );

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
    handleQuestionChange();
  };

  return (
    <div className="">
      <select
        className={`py-1 text-xs font-bold bg-white bg-opacity-25 rounded-xl border-none shadow-md ${
          selectedOption === 'Choose question type'
            ? 'text-accent2'
            : 'text-accent1'
        }  focus:border-none focus:ring-1 focus:outline-none w-full`}
        value={selectedOption}
        onChange={(e) => handleOptionChange(e.target.value)}
      >
        {selectedOption === 'Choose question type' && (
          <option
            value="Choose question type"
            className="font-bold text-black bg-white rounded-none"
            selected
            disabled
            hidden
          >
            Choose question type
          </option>
        )}
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
