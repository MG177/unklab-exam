import React from 'react';
import 'primeicons/primeicons.css';
export default function Check({ answer, correct, color }) {
  console.log(color);
  return (
    <>
      <div className="relative left-[40px] border-x-[2px] border-t-[2px] border-[#cccccc] w-fit px-2.5 pt-0.5 bg-white drop-shadow-lg font-semibold font-Nunito max-[960px]:text-[8px] text-[12px] text-black rounded-t-[15px] ">
        Your answer
      </div>
      <div className="w-full h-fit max-[960px]:w-[500px] max-[960px]:h-[40px] rounded-[24px] px-[15px] py-[20px] flex bg-white items-center drop-shadow-lg border-[2px] border-[#cccccc] mb-6">
        <div className="max-[960px]:w-7 max-[960px]:h-7 w-[45px] h-[40px] rounded-full bg-[#fAfAfA] border-[#D9D9D9] border-[1px] flex justify-center items-center ml-2">
          <i
            className={
              !correct
                ? `pi pi-times text-${color}`
                : `pi pi-check text-${color}`
            }
            style={{ fontSize: '1.5rem', color: `${color}` }}
          ></i>
        </div>
        {answer === '' ? (
          <p className="w-full ml-6 text-left font-Nunito font-bold max-[960px]:text-[15px] text-[17px] text-black">
            -- no answer --
          </p>
        ) : (
          <p className="w-full ml-6  text-left font-Nunito font-bold max-[960px]:text-[15px] text-[17px] text-black">
            {answer}
          </p>
        )}
      </div>
    </>
  );
}
