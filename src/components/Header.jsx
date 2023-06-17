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
        {JSON.parse(sessionStorage.getItem('username'))}
      </p>
    </div>
  );
}

export function HeaderQuestionEditor() {
  return (
    <div className="fixed top-0 w-full h-16 bg-white shadow-lg rounded-b-[24px] z-50">
      <div className="absolute flex items-center justify-center w-full h-full text-xl text-center font-Nunito">
        <span>Question Editor /</span>
        <span className="font-bold indent-1">QuestionName</span>
      </div>
      <div
        style={{ userSelect: 'none' }}
        onCopy={(event) => {
          event.preventDefault();
        }}
        className="flex flex-row items-center justify-between h-full px-16 "
      >
        <div className="flex flex-row items-center justify-center text-black">
          <button
            className="mr-3 pi pi-angle-left"
            style={{ fontSize: '1.5rem' }}
          />
          <p className="font-[Roboto] text-2xl">
            <span className="text-accent1">Unklab </span>
            Exams
          </p>
        </div>
        <div className="flex flex-row">
          <button
            className="w-10 h-10 mr-3 text-white rounded-full pi pi-eye bg-accent1"
            style={{ fontSize: '1.4rem' }}
          />
          <button className="flex items-center justify-center px-8 py-2 font-bold text-white rounded-3xl font-Nunito bg-accent1">
            Submit
          </button>
        </div>
        {/* <p className="text-3xl font-bold text-center text-black font-Nunito">
          {JSON.parse(sessionStorage.getItem('username'))}
        </p> */}
      </div>
    </div>
  );
}

export function HeaderExamDashboard() {
  return (
    <div className="fixed top-0 w-full h-16 bg-white shadow-lg rounded-b-[24px] z-50">
      <div className="absolute flex items-center justify-center w-full h-full text-xl text-center font-Nunito">
        <span>Question Editor /</span>
        <span className="font-bold indent-1">QuestionName</span>
      </div>
      <div
        style={{ userSelect: 'none' }}
        onCopy={(event) => {
          event.preventDefault();
        }}
        className="flex flex-row items-center justify-between h-full px-16 "
      >
        <div className="flex flex-row items-center justify-center text-black">
          <button
            className="mr-3 pi pi-angle-left"
            style={{ fontSize: '1.5rem' }}
          />
          <p className="font-[Roboto] text-2xl">
            <span className="text-accent1">Unklab </span>
            Exams
          </p>
        </div>
        <div className="flex flex-row">
          <button
            className="w-10 h-10 mr-3 text-white rounded-full pi pi-power-off bg-accent1"
            style={{ fontSize: '1.3rem' }}
          />
          <button className="flex items-center justify-center py-2 font-bold text-white px-14 rounded-3xl font-Nunito bg-accent1">
            Start
          </button>
        </div>
        {/* <p className="text-3xl font-bold text-center text-black font-Nunito">
          {JSON.parse(sessionStorage.getItem('username'))}
        </p> */}
      </div>
    </div>
  );
}
