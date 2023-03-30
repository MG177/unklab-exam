import React from "react";
import Header from "../components/Header";
import Timer from "../components/Timer";
// import Warning from "../components/Warning";

export default function ScoreCountdown() {
  return (
    <div className="w-full h-screen justify-center items-center flex flex-col bg-[#FCF9FF]">
      <Header />
      {/* <div className="flex flex-row justify-end">
        <Warning />
      </div> */}
      <div className="flex flex-row justify-center min-h-max">
        <div className="bg-white p-[50px] flex flex-col justify-center items-center gap-[28px] rounded-[24px] shadow-[0_5px_25px_rgba(0,0,0,0.2)]">
          <div className="shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px]">
            <Timer />
          </div>
          <p className="font-[nunito] font-bold text-black text-[35px] w-[471px] text-center">
            Wait until the exam time is over to see your score.
          </p>
        </div>
      </div>
    </div>
  );
}
