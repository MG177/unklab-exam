import React from 'react';
import check from '../image/check_small.svg';

export default function Option({
  active,
  option,
  handleAnswer,
  answerId,
  widthFit,
}) {
  return (
    <div
      onClick={() => handleAnswer(answerId)}
      className={` ${
        !widthFit ? 'w-[586px] max-[960px]:w-[400px]' : 'w-full'
      } gap-[18px] flex rounded-[24px] max-[960px]:items-center max-[960px]:py-2 px-[15px] py-[20px] hover:backdrop-brightness-95  shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]   ${
        active
          ? 'bg-accent1 shadow-md shadow-accent1 transition ease-out duration-300'
          : 'bg-whitePlus cursor-pointer'
      }`}
    >
      {active ? (
        <img src={check} className="max-[960px]:w-5" alt="" />
      ) : (
        <div className="max-[960px]:w-4 w-[29px] max-[960px]:h-4 h-[29px] bg-white rounded-[50%] border"></div>
      )}
      <p
        style={{ userSelect: 'none' }}
        onCopy={(event) => {
          event.preventDefault();
        }}
        className={`${
          active
            ? 'text-white tr  ansition ease-out duration-300 cursor-default'
            : ''
        } text-[20px] max-[960px]:text-[16px]`}
      >
        {option}
      </p>
    </div>
  );
}
