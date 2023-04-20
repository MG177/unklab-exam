import React from "react";

export default function Header() {
  return (
    <div className="fixed top-0 w-full h-24 bg-white rounded-b-[24px] shadow-lg flex flex-row justify-between">
      <p className="font-[Roboto] text-3xl mt-8 ml-28 mb-8">
        <span className="text-[#B55FFE]">Unklab </span>Exams
      </p>
      <p className="font-[Nunito] text-3xl text-[#37474F] font-bold mt-8 mr-[120px] mb-8">
        {JSON.parse(localStorage.getItem("username"))}
      </p>
    </div>
  );
}
