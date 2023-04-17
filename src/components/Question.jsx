import React from 'react';
import sound from '../audio/limya-puluhh.mp3';
import '../styles/audio.css';

export default function Questions({ question, questions }) {
  const isListeningQuestion = questions[question].type === 'listening';
  return (
    <div className='w-[586px] top-[20px] left-[20px] pt-10 rounded-[25.16px] p-[28px] gap-[5px] bg-whitePlus shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)] mt-4'>
      <h1 className='top-[28px] left-[28px] font-bold text-[29px] leading-[34.8px] font-nunito text-[#B55FFE]'>
        Question #{question + 1}
      </h1>
      <p className='text-[#37474F] text-[20px] font-nunito leading-[24px] top-[68px] left-[28px]'>
        {questions[question].text}
      </p>
      {isListeningQuestion && (
        <audio controls className='mt-3' controlsList='nodownload noplaybackrate'>
          <source src={sound} type='audio/mpeg' />
        </audio>
      )}
    </div>
  );
}
