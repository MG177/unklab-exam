import React from "react";
import Header from "../components/Header";
// import Cancel from "../image/x.svg";
import ProgressBar from "../image/progress_bar.svg";

export default function Score() {
  return (
    <body className="relative flex flex-col items-center w-full min-h-screen bg-[#FCF9FF]">
      <Header />
      <p className="mt-[183px] text-black text-6xl font-Nunito font-bold">
        YOUR SCORE
      </p>
      <div className="bg-taccent1 w-[29.151875rem] h-[35.6875rem] mt-16 rounded-[37px] flex justify-center items-center">
        <div className="bg-white w-[26.401875rem] h-[32.9375rem] rounded-[24px] flex flex-col justify-center items-center">
          {/* <button className="w-9 h-9">
            <img src={Cancel} className="w-9 h-9" alt=""></img>
          </button> */}
          <div className="drop-shadow-[2px_3px_7px_rgba(0,0,0,0.15)] relative">
            <img src={ProgressBar} alt="" />
            <div className="absolute top-[50%] left-[17.5%]">
              <p className="font-Nunito text-6xl font-bold text-black">75/100</p>
              <p>Passing Grade</p>
            </div>
          </div>
          <div className="flex flex-row font-Nunito mt-9 gap-7">
            <div className="text-black bg-white shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px] p-4">
              <p className="text-5xl font-bold">15/20</p>
              <p className="text-2xl">Right answers</p>
            </div>
            <div className="text-white bg-accent1 shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px] py-4 px-7">
              <p className="text-5xl font-bold">B+</p>
              <p className="text-2xl font-bold">Grade</p>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}
