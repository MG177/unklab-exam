import React from "react";
import TimerSmall from "../../components/TimerSmall";
export default function Footer() {
  return (
    <div className="fixed bottom-0 w-full h-max bg-white rounded-t-[24px] shadow-[0px_5px_25px_0px_rgba(0,0,0,0.25)] flex flex-row items-center justify-evenly gap-[276px]">
      <div className="font-nunito w-content">
        <p className="text-accent1 text-[29px] font-bold">Pre-Intermediate</p>
      </div>
      <TimerSmall />
      <button className="bg-accent2 w-[152px] h-[57px] font-[Nunito] font-bold text-[24px] text-[#FAFAFA] rounded-[34px] shadow-[0_5px_25px_rgba(0,0,0,0.2)]">
        Logout
      </button>
    </div>
  );
}
