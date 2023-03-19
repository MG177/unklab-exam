import React from "react";
import TimerSmall from "./TimerSmall";
import Arrow from "../image/arrow_right.svg";

export default function Footer() {
  return (
    <div className="fixed bottom-0 w-full h-max bg-white rounded-t-[24px] shadow-lg flex flex-row justify-between">
      <div className="font-nunito mt-[40.26px] mb-[40.26px] ml-28 w-[225px]">
        <p className="text-accent1 text-[29px] font-bold">Pre-Intermediate</p>
        <p className="text-[20px] text-black font-normal">1 of 10 questions</p>
      </div>
      <TimerSmall />
      <button className="bg-white w-[86px] h-[86px] flex items-center justify-center mr-[120px] mt-[29px] mb-[29px]">
        <img src={Arrow} alt="" className="w-[26.52px] h-[43px]" />
      </button>
    </div>
  );
}
