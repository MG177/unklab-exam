import React from "react";

export default function Login() {
  return (
    <body className="w-[1440px] h-[1060px] -top-[5px] bg-[url('./image/Background.svg')] bg-no-repeat flex justify-center items-center">
      <div className=" text-center w-[695.27px] h-[651.92px] top-[188.54px] left-[372.37px] px-[84px] gap-[31px] rounded-[12px] bg-[#FAFAFA] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center -mt-[70px]">
          <div className="flex leading-[209.37px] text-[72px] font-inter font-bold ">
            <h1 className="text-[#37474F]">Welcome</h1>
            <h1 className="text-[#FF6593]">!</h1>
          </div>
          <p className="font-inter font-normal text-[24px] leading-[29.05px] -mt-[60px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            convallis ligula diam, sit amet hendrerit libero sodales quis.
          </p>
        </div>

        <input
          type="text"
          placeholder="Email"
          className="w-[515px] h-[78px] border-[2px] border-[#37474F] font-inter font-normal text-[24px] placeholder:pl-[22px] placeholder:leading-[29.05px] placeholder:text-[#37474F]"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-[515px] h-[78px] border-[2px] border-[#37474F] font-inter font-normal text-[24px] placeholder:pl-[22px] placeholder:leading-[29.05px] placeholder:text-[#37474F]"
        />

        <button className="w-[500px] h-[61px] rounded-[25px] bg-[#B55FFE] text-[#FAFAFA] font-semibold text-[24px] leading-[29.05px]">
          Login
        </button>
      </div>
    </body>
  );
}
