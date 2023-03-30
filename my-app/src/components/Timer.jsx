import React from "react";
import Clock from "../image/clock_icon.svg";

export default function Timer() {
  return (
    <div className="flex flex-row justify-center text-7xl py-5 w-[23.2rem] bg-white rounded-[24px]">
      <img src={Clock} alt="" className="animate-spin"/>
      <p className="text-accent2 font-bold font-nunito ml-[16px]">90:59</p>
    </div>
  );
}
