import React, { useState, useEffect } from 'react';
import Check from '../score/Check';

export default function Aanswer({ question }) {
  const [colors, setColor] = useState('');
  useEffect(() => {
    if (question.correct) {
      setColor('green');
    } else {
      setColor('accent2');
    }
    console.log('correct? ' + question.correct);
  }, [question.correct]);
  return (
    <div
      className={`w-[700px] max-[960px]:w-[560px] pt-[30px] pb-2 px-2 ${
        !question.correct ? 'bg-accent2' : 'bg-green'
      } shadow-lg flex flex-col justify-end mt-[20px] rounded-[24px] gap-[14px]`}
    >
      <div className="bg-[#FFFFFF] w-full rounded-[24px] px-[24px] py-[14px] shadow-[2px_3px_7px_0px_rgba(0, 0, 0, 0.15) ">
        <div className="flex flex-col gap-1 mb-2">
          <p
            className={`font-bold ${
              !question.correct ? 'text-accent2' : 'text-green'
            } font-Nunito text-[29px] max-[960px]:text-[24px] mt-[15px] mb-2}`}
          >
            Question #{question.index}
          </p>
          <p className="w-full mb-4 font-bold font-Nunito text-[#37474F] max-[960px]:text-[16px] text-[20px] leading-[24px]">
            {question.text}
          </p>
        </div>
        <Check
          answer={question.answer}
          correct={question.correct}
          color={colors}
        />
      </div>
    </div>
  );
}
