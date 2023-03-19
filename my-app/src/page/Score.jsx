import React from "react";
import Header from "../components/Header";

export default function Exam() {
  return (
    <body className="relative flex flex-col items-center w-full min-h-screen bg-[#FCF9FF]">
        <Header />
        <p className="mt-[183px] text-black text-6xl font-nunito font-bold">YOUR SCORE</p>
        <div className="bg-taccent1 w-[29.151875rem] h-[35.6875rem] mt-[64.5px] rounded-[37px]"></div>
    </body>
  );
}
