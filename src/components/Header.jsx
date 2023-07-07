import React, { useRef, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { ExamModalEditor } from './dashboard/ExamModal';

import api from '../config';

import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import { InputSwitch } from 'primereact/inputswitch';
import { OverlayPanel } from 'primereact/overlaypanel';

export default function Header() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    //clear local storage
    sessionStorage.clear();
    navigate('/');
  };
  return (
    <div className="fixed top-0 w-full h-14 lg:h-20 bg-white shadow-lg rounded-b-3xl z-50 flex flex-row justify-between items-center px-10">
      <button
        className="font-Roboto text-lg md:text-2xl lg:text-3xl max-w-[25%]"
        onDoubleClick={handleLogout}
      >
        <span className="text-accent1">Unklab </span>
        Exams
      </button>
      {/* <div className="flex flex-row gap-2 items-center justify-center text-gray/30">
        <button className="pi pi-minus"></button>
        <span className="text-3xl">Aa</span>
        <button className="pi pi-plus"></button>
      </div> */}
      <p className="font-Nunito font-bold text-md md:text-lg lg:text-2xl text-black max-w-[25%] truncate">
        {user?.studentName || 'Student Name'}
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
          onClick={() => navigate(-1)}
        >
          <div
            className="mr-3 pi pi-angle-left"
            style={{ fontSize: '1.5rem' }}
          />
          <p className="font-Roboto text-2xl">
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

export function HeaderExamDashboard({
  examName,
  setTime,
  time,
  setToken,
  fetchExam,
  checked,
  setChecked,
}) {
  const { examId } = useParams();
  const modalRef = useRef(null);
  const toast = useRef(null);
  const navigate = useNavigate();

  const op = useRef(null);

  const handleOpenModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const handleStartExam = async () => {
    try {
      const res = await api.patch('/exam/start/' + examId);
      setTime(res.data.time);
      setToken(res.data.token);
      // toast.current.show({
      //   severity: 'success',
      //   summary: 'Success',
      //   detail: 'Exam started successfully',
      //   life: 1000,
      //   // sticky: true,
      // });
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: 'error',
        summary: 'Error when starting exam',
        detail: err.response.data.message,
        life: 5000,
        // sticky: true,
      });
    }
  };

  const handleStopExam = async () => {
    try {
      const res = await api.patch('/exam/start/' + examId + '?minute=0');
      setTime(res.data.time);
      // toast.current.show({
      //   severity: 'success',
      //   summary: 'Success',
      //   detail: 'Exam started successfully',
      //   life: 1000,
      //   // sticky: true,
      // });
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: 'error',
        summary: 'Error when starting exam',
        detail: err.response.data.message,
        life: 5000,
        // sticky: true,
      });
    }
  };

  const handleSwitch = async (changes) => {
    try {
      const change = { [changes]: !checked[changes] };
      if (change.isShowAnswer) change.isShowScore = true;
      if (!change.isShowScore) change.isShowAnswer = false;
      console.log(change);
      const res = await api.patch('/exam/switch/' + examId, change);
      const initialSwitch = {
        isShowScore: res.data.isShowAnswer ? true : res.data.isShowScore,
        isShowAnswer: res.data.isShowAnswer,
        isRandom: res.data.isRandom,
      };
      setChecked(initialSwitch);
    } catch (err) {
      console.log(err);
      // toast.current.show({
      //   severity: 'error',
      //   summary: 'Error when switching exam',
      //   detail: 'Something went wrong',
      //   life: 5000,
      //   // sticky: true,
      // });
    }
  };

  return (
    <div className="fixed top-0 w-full h-16 bg-white shadow-lg rounded-b-[24px] z-50 select-none">
      <div className="absolute flex items-center justify-center w-full h-full text-xl text-center font-Nunito">
        <span>Exam Manager /</span>
        <span className="font-bold indent-1">{examName || 'QuestionName'}</span>
      </div>
      <div className="flex flex-row items-center justify-between h-full px-16 ">
        <button
          className="flex flex-row items-center justify-center text-black z-20"
          onClick={() => navigate(-1)}
        >
          <div
            className="mr-3 pi pi-angle-left"
            style={{ fontSize: '1.5rem' }}
          />
          <p className="font-Roboto text-2xl">
            <span className="text-accent1">Unklab </span>
            Exams
          </p>
        </button>
        <div className="flex flex-row gap-3">
          {/* <ExamModalEditor
            modalRef={modalRef}
            examId={examId}
            examName={examName}
            fetchExam={fetchExam}
          /> */}
          <Toast
            ref={toast}
            style={{
              marginTop: '4rem',
              borderRadius: '1rem',
              boxShadow: '0 0 #0000',
              paddingInline: '5px',
            }}
            pt={{
              icon: '1rem',
            }}
          />
          <OverlayPanel ref={op} className="rounded-xl">
            <div className="flex flex-col justify-start gap-2  text-md font-Nunito font-semibold text-black select-none">
              <div className="flex justify-start items-center gap-2">
                <InputSwitch
                  checked={checked.isShowScore}
                  onChange={(e) => handleSwitch('isShowScore')}
                />
                <span>Show score to student</span>
              </div>
              <div className="flex justify-start items-center gap-2">
                <InputSwitch
                  checked={checked.isShowAnswer}
                  onChange={(e) => handleSwitch('isShowAnswer')}
                />
                <span>Show correct answer to student</span>
              </div>
              <div className="flex justify-start items-center gap-2">
                <InputSwitch
                  checked={checked.isRandom}
                  onChange={(e) => handleSwitch('isRandom')}
                />
                <span>Randomize student question and option</span>
              </div>
              {/* <button className="flex self-end items-center justify-center bg-red-500 text-white w-fit gap-2 rounded-xl px-3 py-3 opacity-10 scale-50 translate-y-1/2 translate-x-1/2">
                <i className="pi pi-trash" />
              </button> */}
            </div>
          </OverlayPanel>
          {/* <button
            className="w-10 h-10 text-white rounded-full pl-1 pi pi-file-edit bg-accent1 z-50"
            style={{ fontSize: '1.3rem' }}
            onClick={handleOpenModal}
          /> */}
          <Button
            type="button"
            icon="pi pi-cog"
            className="rounded-3xl shadow-md h-10 w-10 bg-accent1 border-2 border-accent1"
            onClick={(e) => op.current.toggle(e)}
          />
          {time === 0 || time < 0 || time === 'NaN' ? (
            <button
              className="flex items-center justify-center py-2 font-bold text-white px-14 rounded-3xl font-Nunito bg-accent1 z-50"
              onClick={handleStartExam}
            >
              Start
            </button>
          ) : (
            <button
              className="flex items-center justify-center py-2 font-bold text-white px-14 rounded-3xl font-Nunito bg-accent2 z-50"
              onClick={handleStopExam}
            >
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
