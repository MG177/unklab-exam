import React from "react";
// import Clock from "../image/clock_icon.svg";

export default function TimerSmall() {
  return (
    <div className="flex flex-row justify-center items-center w-[204.5px] h-[61px] bg-white gap-[10px] mt-[41.5px] mb-[41px] mr-[120px] px-[14px] py-[20px] rounded-[24px] shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]">
      {/* <img
        src={Clock}
        alt=""
        className="w-[35.03px] h-[35.03px] animate-bounce duration-[1ms]"
      /> */}
      <p className="text-accent2 font-bold font-nunito text-[41px]">01:90:59</p>
    </div>
  );
}
