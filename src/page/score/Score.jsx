import React from "react";
import Header from "../../components/Header";
import ProgressBar from "../score/progress_bar.svg";
import FooterScore from "./FooterScore";

export default function Score() {
  const handleLogout = () => {
    //clear local storage
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen bg-[#FCF9FF]">
      <Header />
      <p className="mt-[183px] text-black text-6xl font-Nunito font-bold">
        YOUR SCORE
      </p>
      <div className="bg-taccent1 w-max h-max mt-16 rounded-[37px] flex justify-center items-center p-[22px] shadow-[0_5.95px_29.74px_rgba(0,0,0,0.1)]">
        <div className="bg-white w-max h-max px-[40px] gap-7 py-[27px] rounded-[24px] flex flex-row justify-center items-center shadow-[0_5.95px_29.74px_rgba(0,0,0,0.58)]">
          <div className="relative flex flex-col justify-center items-center drop-shadow-[2px_3px_7px_rgba(0,0,0,0.15)]">
            <img src={ProgressBar} alt="" />
            <div className="absolute flex flex-col items-center justify-center">
              <p className="text-6xl font-bold text-black font-Nunito">
                75/100
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-row font-Nunito gap-[10px] ">
              <div className="text-black w-full bg-white shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px] h-[111px] py-4 pl-4">
                <p className="text-5xl font-bold">8/10</p>
                <p className="text-2xl">Right answers</p>
              </div>
              <div className="text-white bg-accent1 shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px] py-4 px-7">
                <p className="text-5xl font-bold">A+</p>
                <p className="text-2xl font-bold">Grade</p>
              </div>
            </div>
            <div className="bg-white shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-3xl min-w-[350px] w-full h-[111px] flex items-center justify-center px-[16px] py-[30px] leading-[35px]">
              <p className="text-[35px] font-bold font-[Nunito] text-black text-center">
                Tester Account
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer classtime="flex flex-row justify-center items-center w-[204.5px] h-[61px] bg-white gap-[10px] mt-[41.5px] mb-[41px] mr-[120px] px-[14px] py-[20px] rounded-[24px] shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)] hidden" /> */}
      <FooterScore />
      {/* <button
        className="bg-accent2 font-[Nunito] font-bold text-2xl text-[#FAFAFA] rounded-[34px] px-[112.5px] py-[18px] shadow-[0_5px_25px_rgba(0,0,0,0.2)] mt-10"
        onClick={handleLogout}
      >
        Logout
      </button> */}
    </div>
  );
}
