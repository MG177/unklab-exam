import React from "react";
import Green from "../score/check_small green.svg";
import Purple from "../score/check_small purple.svg";
export default function Check() {
  return (
    <div className="w-[630px] h-[100px] rounded-[24px] px-[15px] py-[25px] flex bg-[#ffffff] items-center shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)] mb-6">
      <div className="w-[40px] h-[40px] rounded-full bg-[#fAfAfA] border-[#D9D9D9] border-[1px] flex justify-center items-center ml-2">
        <img src={Green} className="w-[28.5px] h-[28.5px]" />
      </div>
      <p className="w-[500px] ml-6 font-Nunito font-bold text-[18px] leading-[17px] text-[#37474F]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce convallis
        ligula
      </p>
    </div>
  );
}
