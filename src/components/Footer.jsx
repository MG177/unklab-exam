import React from 'react';
import TimerSmall from './TimerSmall';
import Arrow from '../image/arrow_right.svg';

export default function Footer({ question, setQuestion, questions, time }) {
  console.log('question', question);

  const handleNext = () => {
    console.log('clicked');
    setQuestion((prev) => prev + 1);
  };

  const displayQuestionOf = () => {
    if (question < 9) {
      return `Question ${question + 1} of 10`;
    }
    return 'Question 10 of 10';
  };

  return (
    <div className="fixed bottom-0 w-full h-28 bg-white rounded-t-[24px] shadow-[0px_5px_25px_0px_rgba(0,0,0,0.25)] flex flex-row items-center justify-between">
      <div className="font-nunito my-[40.26px] ml-28 w-content">
        <p className="text-accent1 text-[29px] font-bold">Pre-Intermediate</p>
        <p className="text-[20px] text-black font-normal">
          {displayQuestionOf()}
        </p>
      </div>
      <TimerSmall time={time} />
      {question < questions.length && (
        <button
          type="button"
          onClick={handleNext}
          className="bg-white w-[86px] h-[86px] flex items-center justify-center mr-[120px] mt-[29px] mb-[29px]"
        >
          <img src={Arrow} alt="" className="w-[26.52px] h-[43px]" />
        </button>
      )}
    </div>
  );
}
