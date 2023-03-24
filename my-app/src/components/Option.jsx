import React from "react";

export default function Option() {
  return (
    <div className="w-[504px] h-[70px] top-[114px] left-[20px] rounded-[24px] px-[15px] py-[20px] gap-[18px] bg-[#FFFFFF] hover:bg-[#B55FFE] shadow-[box-shadow: 0px_5px_10px_0px_rgba(181,95,254,1)] hover:text-white">
      <div className="flex gap-2">
        <form action="">
          <input
            type="checkbox"
            id="check"
            name="check"
            className="w-[17.91px] h-[17.91px] rounded-full hover:bg-[#B55FFE]"
          />
        </form>
        <label
          for="check"
          className="font-nunito text-[17px] leading-[20.4px] "
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
          convallis ligula
        </label>
      </div>
    </div>
  );
}
