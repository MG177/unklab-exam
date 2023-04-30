import React from "react";
import "../styles/audio.css";

export default function Questions({ question, questions, media }) {
  const hasAudio = questions[question].audio === true;
  const hasImage = questions[question].image === true;

  return (
    <div className=" cursor-default w-[586px] top-[20px] left-[20px] pt-10 rounded-[25.16px] p-[28px] gap-[5px] bg-whitePlus shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)] mt-4 flex flex-col">
      <h1 className="font-nunito font-bold text-[29px] leading-[34.8px] text-[#B55FFE]">
        Question #{question + 1}
      </h1>
      {hasAudio && (
        <div className="flex-1 mb-2">
          <audio
            controls
            className="w-full"
            controlsList="nodownload noplaybackrate"
          >
            <source src={media.audio} type="audio/mpeg" />
          </audio>
        </div>
      )}
      {hasImage && (
        <div className="flex-1 mb-2">
          <img src={media.image} alt="" className="w-full mt-3" />
        </div>
      )}
      <p
        style={{ userSelect: "none" }}
        onCopy={(event) => {
          event.preventDefault();
        }}
        className="font-nunito text-[20px] leading-[24px] text-[#37474F]"
      >
        {questions[question].text}
      </p>
    </div>
  );
}
