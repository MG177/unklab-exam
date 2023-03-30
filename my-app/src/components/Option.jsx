import React from 'react';
import check from '../image/check_small.svg';

export default function Option({ active, option, handleAnswer }) {
  return (
    <div
      onClick={() => handleAnswer(option)}
      className={`w-[586px] gap-[18px] flex rounded-[24px] px-[15px] py-[20px] hover:text-white hover:bg-accent1 shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]   ${
        active ? 'bg-accent1 shadow-md shadow-accent1 ' : ' '
      }`}>
      {active ? (
        <img src={check} alt='' />
      ) : (
        <div className='w-[29px] h-[29px] bg-white rounded-[50%] border'></div>
      )}
      <p className={`${active ? 'text-white ' : ''} text-[20px]`}>{option}</p>
    </div>
  );
}
