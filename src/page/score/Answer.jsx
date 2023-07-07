import React from 'react';

export default function Answer({ question, index }) {
  if (question.correctAnswer === question.answer) {
    return (
      <div className="p-1.5 pt-5 bg-green-500 shadow-lg rounded-3xl min-w-[400px] font-Nunito">
        <div className="bg-whitePlus w-full rounded-3xl px-6 py-4">
          <div className="flex flex-col gap-1 mb-2">
            <p
              className={`font-bold text-green-500  text-[29px] max-[960px]:text-[24px] mt-[15px] mb-2}`}
            >
              Question #{index + 1}
            </p>
            <p className="w-full mb-4 font-bold  text-[#37474F] max-[960px]:text-[16px] text-[20px] leading-[24px]">
              {question.text}
            </p>
          </div>

          <div className="relative left-[40px] border-x-[2px] border-t-[2px] border-[#cccccc] w-fit px-2.5 pt-0.5 bg-white drop-shadow-lg font-semibold  max-[960px]:text-[8px] text-[12px] text-black rounded-t-[15px] ">
            Your answer
          </div>
          <div className="w-full h-fit rounded-3xl px-2 py-2 flex bg-white items-center drop-shadow-lg border-2 border-gray/50">
            <div className="rounded-full border-gray/20 border flex justify-center items-center">
              <i
                className={`pi pi-check text-green-500`}
                style={{ fontSize: '1.5rem' }}
              ></i>
            </div>
            <p className="w-full ml-6 text-left  font-bold text-md text-black">
              {question.answer || ' -- no answer --'}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`p-1.5 pt-5 bg-accent2 shadow-lg rounded-3xl font-Nunito`}
      >
        <div className="bg-whitePlus w-full rounded-3xl px-6 py-4 ">
          <div className="flex flex-col gap-1 mb-2">
            <p
              className={`font-bold text-accent2 text-[29px] max-[960px]:text-[24px] mt-[15px] mb-2}`}
            >
              Question #{index + 1}
            </p>
            <p className="w-full mb-4 font-bold  text-[#37474F] max-[960px]:text-[16px] text-[20px] leading-[24px]">
              {question.text}
            </p>
          </div>

          <div className="relative left-[40px] border-x-[2px] border-t-[2px] border-[#cccccc] w-fit px-2.5 pt-0.5 bg-white drop-shadow-lg font-semibold  max-[960px]:text-[8px] text-[12px] text-black rounded-t-[15px] ">
            Your answer
          </div>
          <div className="w-full h-fit rounded-3xl px-2 py-2 flex bg-white items-center drop-shadow-lg border-2 border-gray/50">
            <div className="rounded-full border-gray/20 border flex justify-center items-center">
              <i
                className="pi pi-times text-accent2"
                style={{ fontSize: '1.5rem' }}
              ></i>
            </div>
            <p className="w-full ml-6 text-left  font-bold text-md text-black">
              {question.answer || ' -- no answer --'}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
