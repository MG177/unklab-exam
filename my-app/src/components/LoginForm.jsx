import React from "react";

export default function Form() {
  return (
    <div className=" text-center w-[695.27px] h-[651.92px] top-[188.54px] left-[372.37px] px-[84px] gap-[31px] rounded-[12px] bg-[#FAFAFA] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center -mt-[70px]">
        <div className="flex leading-[209.37px] text-[72px] font-inter font-bold ">
          <h1 className="text-[#37474F]">Welcome</h1>
          <h1 className="text-[#FF6593]">!</h1>
        </div>
        <p className="font-inter font-normal text-[24px] leading-[29.05px] -mt-[60px]">
          Let's get you started with your exams. Enter your login details and
          token to access your account.
        </p>
      </div>
      <div>
        <p className="w-[515px] font-Roboto font-normal text-[17px] text-[#37474F] flex self-start">
          Registration number
        </p>
        <input
          type="text"
          placeholder="s2200000"
          className="w-[515px] h-[65px] rounded-[10px] px-[24px] py-[20px] border-[#FFFFFF] font-Roboto font-normal text-[17px] placeholder:pl-[22px] placeholder:text-[#37474F40] shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]"
        />
      </div>
      <div>
        <p className="w-[515px] font-Roboto font-normal text-[17px] text-[#37474F] flex self-start">
          Token
        </p>
        <input
          type="password"
          placeholder="Token"
          className="w-[515px] h-[65px] rounded-[10px] px-[24px] py-[20px] border-[#FFFFFF] font-Roboto font-normal text-[17px] placeholder:pl-[22px] placeholder:text-[#37474F40] shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]"
        />
      </div>
      <button className="w-[500px] h-[61px] rounded-[25px] bg-[#B55FFE] text-[#FAFAFA] font-semibold text-[24px] leading-[29.05px]">
        Login
      </button>
    </div>
  );
}
