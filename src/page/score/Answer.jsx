import React from "react";
import Check from "../score/Check";

export default function answer() {
  return (
    <div className="w-[800px] pt-[50px] pb-2 px-[6px] bg-[#51B330] shadow-[2px_3px_7px_0px_rgba(0, 0, 0, 0.15)] flex flex-col justify-end mt-[20px] rounded-[24px] mb-[400px]">
      <div className="bg-[#FFFFFF] w-[788px] h-content rounded-[24px] pl-[16px] pr-[28px] py-[32px] shadow-[2px_3px_7px_0px_rgba(0, 0, 0, 0.15)">
        <div className="ml-[50px]">
          <div>
            <p className="font-bold text-[#51B330] font-Nunito text-[42px] -mt-[15px] mb-2">
              Question #1
            </p>
            <p className="w-[620px] mb-4 font-bold font-Nunito text-[#37474F] text-[27px] leading-[24px]">
              Lorem ipsum dolor sit amet consectetur. Eget orci neque facilisis
              sit consequat. Orci ut et nulla malesuada semper. Nunc ornare nec
              consequat tortor tempor.
            </p>
          </div>
          <Check />
          <Check />
        </div>
      </div>
    </div>
  );
}
