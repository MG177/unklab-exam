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
  console.log("question :", question);
  console.log("questions length :", questions.length);
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
    const rootExamPath = "/waiting";
    if (rootExamPath) {
      return "hidden";
    } else if (!rootExamPath) {
      return "flex flex-row justify-center items-center w-[204.5px] h-[61px] bg-white gap-[10px] mt-[41.5px] mb-[41px] mr-[120px] px-[14px] py-[20px] rounded-[24px] shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]";
    }
  };
  const isValidUrlPath = validateUrlPath();

  return (
    <div className="fixed bottom-0 w-full h-28 bg-white rounded-t-[24px] shadow-[0px_5px_25px_0px_rgba(0,0,0,0.25)] flex flex-row items-center justify-between">
      <div className="font-nunito my-[40.26px] ml-28 w-content">
        <p className="text-accent1 text-[29px] font-bold">
          {JSON.parse(localStorage.getItem("examName"))}
        </p>
        <p className="text-[20px] text-black font-normal">
          {`Question ${question + 1} of ${questions.length}`}
        </p>
      </div>
      <TimerSmall time={time} onTimeUp={handleTimeOut} />
      {question < questions.length && (
        <button
          type="button"
          onClick={handleNext}
          className="bg-white w-[86px] h-[86px] flex items-center justify-center mr-[120px] mt-[29px] mb-[29px]"
        >
          <img src={Arrow} alt="" className="w-[59px] h-[44px]" />
        </button>
      )}
    </div>
  );
}
