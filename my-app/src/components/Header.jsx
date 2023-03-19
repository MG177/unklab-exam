import React from "react";

export default function Header() {
    return(
        <div className="fixed top-0 w-full h-max bg-white rounded-b-[24px] shadow-lg flex flex-row justify-between">
            <p className="font-[Roboto] text-3xl mt-9 ml-28 mb-9"><span className="text-[#B55FFE]">Unklab </span>Exams</p>
            <p className="font-[Nunito] text-3xl mt-9 mr-[120px] mb-9">John Doe</p>
        </div>
    )
}