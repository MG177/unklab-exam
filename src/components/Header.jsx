import React from 'react';
import { Tooltip } from 'primereact/tooltip';
import { useNavigate } from 'react-router-dom';

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

const statusIcons = {
  failed: 'pi pi-exclamation-circle text-red-500',
  loading: 'pi pi-spin pi-spinner text-red-500',
  true: 'pi pi-check-circle text-blue-500',
};

const statusText = {
  failed: 'Failed to save changes',
  loading: 'Saving...',
  true: 'Saved successfully',
};

export function HeaderQuestionEditor({
  saveStatus,
  questionName,
  saveQuestions,
}) {
  const navigate = useNavigate();
  const goBack = () => {
    navigate('/dashboard/questions');
  };

  const statusIcon =
    statusIcons[saveStatus] || 'pi pi-exclamation-circle text-red-500';
  const statusMsg = statusText[saveStatus] || 'Saved successfully';

  return (
    <div className="fixed top-0 w-full h-16 bg-white shadow-lg rounded-b-[24px] z-20">
      <div className="absolute flex items-center justify-center w-full h-full text-xl text-center font-Nunito z-10">
        <span>Question Editor /</span>
        <span className="font-bold indent-1">
          {questionName || 'Question Name'}
        </span>
        <div
          className="right-0 flex items-center justify-center ml-1 p-1 rounded-full text-xl text-center font-Nunito"
          tooltip="Don't forget to save before exit!"
        >
          <Tooltip target="#statusIcon" />
          <i
            id="statusIcon"
            className={statusIcon}
            style={{ fontSize: '1rem' }}
            data-pr-tooltip={statusMsg}
          />
        </div>
      </div>
      <div
        style={{ userSelect: 'none' }}
        className="flex flex-row items-center justify-between h-full px-16 z-30"
      >
        <button
          className="flex flex-row items-center justify-center text-black z-20"
          onClick={goBack}
        >
          <div
            className="mr-3 pi pi-angle-left"
            style={{ fontSize: '1.5rem' }}
          />
          <p className="font-[Roboto] text-2xl">
            <span className="text-accent1">Unklab </span>
            Exams
          </p>
        </button>
        <div className="flex flex-row">
          <button
            className="w-10 h-10 mr-3 text-white rounded-full pi pi-eye bg-accent1 z-20"
            style={{ fontSize: '1.4rem' }}
          />
          <button
            className="flex items-center justify-center px-12 font-bold text-white rounded-3xl font-Nunito bg-accent1 z-20"
            onClick={() => saveQuestions(true)}
          >
            Save
          </button>
        </div>
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
