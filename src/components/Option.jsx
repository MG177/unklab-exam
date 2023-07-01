import React from 'react';

export default function Option({
  active,
  option,
  handleAnswer,
  answerId,
  textSize,
  size,
}) {
  return (
    <div
      onClick={() => handleAnswer(answerId)}
      className={`w-full gap-4 flex rounded-3xl items-center p-5 shadow-md border-[1px] border-gray/20 text-black transition ease-out duration-50 hover:scale-[1.007] ${
        active ? 'bg-accent1 shadow-accent1 ' : 'bg-whitePlus cursor-pointer'
      }`}
    >
      {active ? (
        <div className="flex justify-center items-center w-fit h-fit rounded-full bg-white p-2">
          <i
            className="pi pi-check text-accent1"
            style={{ fontWeight: '900' }}
          />
        </div>
      ) : (
        <div className="w-1 h-1 p-3.5 bg-white rounded-full border border-gray"></div>
      )}
      <p
        style={{ userSelect: 'none' }}
        onCopy={(event) => {
          event.preventDefault();
        }}
        className={`${
          active
            ? 'text-white tr  ansition ease-out duration-50 cursor-default'
            : ''
        } ${textSize[size]} md:${textSize[size + 1]} xl:${textSize[size + 2]} `}
        dangerouslySetInnerHTML={{ __html: option.replace(/\n/g, '<br>') }}
      ></p>
    </div>
  );
}
