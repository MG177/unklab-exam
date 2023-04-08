import React from "react";
import Clock from "../image/clock_icon.svg";

export default function TimerSmall() {
  return (
    <div className="flex flex-row justify-center items-center w-content h-[61px] bg-white gap-[10px] mt-[41.5px] mb-[41px] mr-[120px] px-[10px] py-[18px] rounded-[24px] shadow-lg">
      {/* <img
        src={Clock}
        alt=""
        className="w-[35.03px] h-[35.03px] animate-bounce duration-[1ms]"
      /> */}
      <p className="text-accent2 font-bold font-nunito text-[41px]">01:90:59</p>
    </div>
  );
}
