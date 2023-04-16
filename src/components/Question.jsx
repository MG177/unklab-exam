import React from 'react';
import sound from '../audio/limya-puluhh.mp3';

export default function questions({ question, questions }) {
  // console.log('from question', question.text);
  return (
    <div className='w-[586px] top-[20px] left-[20px] rounded-[25.16px] p-[28px] gap-[5px] bg-[#FFFFFF] shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]'>
      <h1 className='top-[28px] left-[28px] font-bold text-[29px] leading-[34.8px] font-nunito text-[#B55FFE]'>
        Question #{question + 1}
      </h1>
      <p className='text-[#37474F] text-[20px] font-nunito leading-[24px] top-[68px] left-[28px]'>
        {questions[question].text}
      </p>
      <audio controls className='mt-3' style={{width: '100%', marginTop: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)', outline: 'none'}}>
        <source src={sound} type='audio/mpeg' />
      </audio>
    </div>
  );
}