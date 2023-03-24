import React from "react";

export default function Form() {
  return (
    <div className="max-w-[625px] text-center p-12 md:p-[60px] gap-[32px] rounded-[12px] bg-[#FAFAFA] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <div className="flex text-5xl md:text-[62px] font-inter font-bold ">
          <h1 className="text-[#37474F]">Welcome</h1>
          <h1 className="text-[#FF6593]">!</h1>
        </div>
        <p className="font-inter font-normal text-lg md:text-[24px] leading-[29.05px] ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
          convallis ligula diam, sit amet hendrerit libero sodales quis.
        </p>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col items-start ">
          <label htmlFor="email" className="mb-2">
            Registration Number
          </label>
          <input
            id="email"
            type="text"
            placeholder="Email"
            className="w-full py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg md:text-[24px] pl-[22px] placeholder:text-[#37474F40]"
          />
        </div>
        <div className="flex flex-col items-start ">
          <label htmlFor="email" className="mb-2">
            Token
          </label>
          <input
            type="password"
            placeholder="Password"
            className="w-full py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg md:text-[24px] pl-[22px] placeholder:text-[#37474F40]"
          />
        </div>
      </div>

      <button className="uppercase w-full py-4 rounded-full bg-[#B55FFE] text-[#FAFAFA] font-semibold text-lg md:text-[24px]">
        Login
      </button>
    </div>
  );
}
