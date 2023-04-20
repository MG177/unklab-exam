import React from 'react';
import '../styles/audio.css';

export default function Questions({ question, questions, media }) {
  const hasAudio = questions[question].media && questions[question].media.type === 'audio';
  const hasImage = questions[question].media && questions[question].media.type === 'image';

  return (
    <div className="w-[586px] top-[20px] left-[20px] pt-10 rounded-[25.16px] p-[28px] gap-[5px] bg-whitePlus shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)] mt-4 flex flex-col">
      <h1 className="font-nunito font-bold text-[29px] leading-[34.8px] text-[#B55FFE]">
        Question #{question + 1}
      </h1>
        {hasAudio && (
          <div className="mb-2 flex-1">
            <audio controls className='w-full' controlsList='nodownload noplaybackrate'>
              <source src={media.audio} type='audio/mpeg' />
            </audio>
          </div>
        )}
        {hasImage && (
          <div className="mb-2 flex-1">
            <img src={media.image} alt='' className='w-full mt-3' />
          </div>
        )}
      <p className="font-nunito text-[20px] leading-[24px] text-[#37474F]">
        {questions[question].text}
      </p>
    </div>
  );
}
