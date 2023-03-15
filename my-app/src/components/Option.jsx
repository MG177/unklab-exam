import React from "react";

export default function Option() {
  return (
    <div className="w-[504px] h-[70px] top-[114px] left-[20px] rounded-[16.48px] px-[15px] py-[20px] gap-[18px] bg-[#FAFAFA] hover:bg-[#B55FFE] shadow-[0px_5px_25px_rgba(0,0,0,0.2)] hover:text-white">
      <div className="flex gap-2">
        <form action="">
          <input
            type="checkbox"
            className="w-[17.91px] h-[17.91px] rounded-full hover:bg-[#B55FFE]"
          />
        </form>
        <p className="font-nunito text-[17px] leading-[20.4px] ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
          convallis ligula
        </p>
      </div>
    </div>
  );
}
