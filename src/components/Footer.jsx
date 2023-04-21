import React from "react";
import TimerSmall from "./TimerSmall";
import Arrow from "../image/arrow_next.svg";
import { useNavigate } from "react-router-dom";

export default function Footer({
  question,
  setQuestion,
  questions,
  time,
  answer,
}) {
  const navigate = useNavigate();

  const handleNext = () => {
    console.log("clicked");
    setQuestion((prev) => prev + 1);

    if (question === questions.length - 1) {
      // handleTimeOut();
      navigate("/waiting");
    }
  };
  const handleTimeOut = () => {
    console.log("time out");
    navigate("/score");
  };

  const validateUrlPath = () => {
    const rootExamPath = "/exam";
    return window.location.pathname.startsWith(rootExamPath);
  };
  console.log(validateUrlPath());
  const validateUrlPath1 = () => {
    const rootExamPath = "/waiting";
    return window.location.pathname.startsWith(rootExamPath);
  };
  console.log(validateUrlPath1());

  const validateUrlPath2 = () => {
    const rootExamPath2 = "/score";
    return window.location.pathname.startsWith(rootExamPath2);
  };
  console.log(validateUrlPath2());

  const handleLogout = () => {
    //clear local storage
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="fixed bottom-0 w-full h-28 bg-white rounded-t-[24px] shadow-[0px_5px_25px_0px_rgba(0,0,0,0.25)] flex flex-row items-center justify-between">
      <div className="font-nunito my-[40.26px] ml-28 w-content">
        <p className="text-accent1 text-[29px] font-bold">
          {JSON.parse(localStorage.getItem("examName"))}
        </p>
        {validateUrlPath() && (
          <p className="text-[20px] text-black font-normal">
            {`Question ${question + 1} of ${questions.length}`}
          </p>
        )}
      </div>
      {validateUrlPath() && <TimerSmall time={time} onTimeUp={handleTimeOut} />}
      {validateUrlPath() && question < questions.length && (
        <button
          type="button"
          onClick={handleNext}
          className="bg-white w-[86px] h-[86px] flex items-center justify-center mr-[120px] mt-[29px] mb-[29px]"
        >
          <img src={Arrow} alt="" className="w-[59px] h-[44px]" />
        </button>
      )}
      {validateUrlPath1() && (
        <button
          className="bg-accent2 w-[152px] h-[57px] font-[Nunito] font-bold text-[24px] text-[#FAFAFA] rounded-[34px] shadow-[0_5px_25px_rgba(0,0,0,0.2)] mr-[120px]"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
      {validateUrlPath2() && (
        <button
          className="bg-accent2 w-[152px] h-[57px] font-[Nunito] font-bold text-[24px] text-[#FAFAFA] rounded-[34px] shadow-[0_5px_25px_rgba(0,0,0,0.2)] mr-[120px]"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}

      {/* {validateUrlPath() ? (
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="bg-white w-[86px] h-[86px] flex items-center justify-center mr-[120px] mt-[29px] mb-[29px]"
        >
          <img src={Arrow} alt="" className="w-[59px] h-[44px]" />
        </button>
      )} */}
    </div>
  );
}
