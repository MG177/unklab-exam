import React from "react";
import Check from "../score/Check";

export default function answer({ question }) {
  const color = () => {
    if (question.correct) {
      return "green";
    } else {
      return "accent2";
    }
  };
  return (
    <div
      className={`w-[700px] pt-[30px] pb-2 px-2 bg-${color()} shadow-[2px_3px_7px_0px_rgba(0, 0, 0, 0.15)] flex flex-col justify-end mt-[20px] rounded-[24px] gap-[14px]`}
    >
      <div className="bg-[#FFFFFF] w-full rounded-[24px] px-[24px] py-[14px] shadow-[2px_3px_7px_0px_rgba(0, 0, 0, 0.15) ">
        <div className="flex flex-col gap-1 mb-2">
          <p
            className={`font-bold text-${color()} font-Nunito text-[29px] mt-[15px] mb-2}`}
          >
            Question #{question.index}
          </p>
          <p className="w-full mb-4 font-bold font-Nunito text-[#37474F] text-[20px] leading-[24px]">
            {question.text}
          </p>
        </div>
        <Check
          answer={question.answer}
          correct={question.correct}
          color={color()}
        />
      </div>
    </div>
  );
}
