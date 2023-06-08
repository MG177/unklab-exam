import React from 'react';
import '../styles/audio.css';
import Media from './Media';

export default function Questions({ question }) {
  const hasContent =
    question.audio || question.image || question.file || question.media;

  return (
    <div
      style={{ userSelect: 'none' }}
      onCopy={(event) => {
        event.preventDefault();
      }}
      className="max-[960px]:w-[400px] cursor-default w-[586px] top-[20px] left-[20px] rounded-[25.16px] p-7 gap-2 bg-whitePlus shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)] mt-4 flex flex-col"
    >
      <h1 className="font-nunito font-bold text-[29px] max-[960px]:text-[24px] text-[#B55FFE]">
        Question #{question.id}
      </h1>

      {hasContent && (
        <Media
          id={
            question.image || question.audio || question.file || question.media
          }
        />
      )}
      <p
        className="font-nunito text-[20px] leading-[24px] max-[960px]:text-[16px] text-[#37474F]"
        dangerouslySetInnerHTML={{
          __html: question.text.replace(/\n/g, '<br>'),
        }}
      ></p>
    </div>
  );
}
