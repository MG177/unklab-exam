import React from 'react';

export default function questions({question, options, answer}) {
  return (
    <div className='w-[586px] h-[168px] top-[20px] left-[20px] rounded-[25.16px] p-[28px] gap-[5px] bg-[#FFFFFF] shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]'>
      <h1 className='top-[28px] left-[28px] font-bold text-[29px] leading-[34.8px] font-nunito text-[#B55FFE]'>
        Question #1
      </h1>
      <p className='text-[#37474F] text-[20px] font-nunito leading-[24px] top-[68px] left-[28px]'>
        {!question ? 'no text' : question}
      </p>
    </div>
  );
}
