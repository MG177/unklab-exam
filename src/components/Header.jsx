import React from 'react';

export default function Header() {
  return (
    <div
      style={{ userSelect: 'none' }}
      onCopy={(event) => {
        event.preventDefault();
      }}
      className="fixed top-0 w-full max-[960px]:h-20 h-24 bg-white rounded-b-[24px] shadow-lg flex flex-row justify-between z-50"
    >
      <p className="font-[Roboto] max-[960px]:text-2xl text-3xl max-[960px]:mt-5 mt-8 ml-28 mb-8">
        <span className="text-[#B55FFE]">Unklab </span>
        Exams
      </p>
      <p className="font-[Nunito] max-[960px]:text-2xl text-3xl text-[#37474F] font-bold mt-8 max-[960px]:mt-5 mr-[120px] mb-8">
        {JSON.parse(localStorage.getItem('username'))}
      </p>
    </div>
  );
}
