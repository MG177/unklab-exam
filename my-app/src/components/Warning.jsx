import React from "react";
import check from "../image/tick_circle.svg"

export default function Warning() {
  return(
    <div className="bg-white w-[526.82px] h-20 flex flex-row items-center rounded-l-[16.8147px] mt-[176px]">
      <div className="bg-[#38BE5E] w-[0.63rem] h-20 rounded-l-[16.8147px]"></div>
      <img src={check} alt="" className="w-[50px] h-[50px]"/>
      <div className="ml-[10px] flex flex-col mt-[16px] mb-[16px]">
        <p className="font-Roboto text-[20px]"><span className="font-Roboto text-[#37474F] font-bold text-[29px]">Success!</span></p>
        <p className="font-Roboto text-[20px] text-black w-[22.6rem]">All of your answer already been recorded</p>
      </div>
      <div className="flex flex-row items-center justify-center border-l-2 ml-[10px] h-full">
        <p className="px-[14.84px] py-[33px]">
          CLOSE
        </p>
      </div>
    </div>
  )
}
