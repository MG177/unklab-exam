'use client';

import React, { useRef, useContext, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';
import { logout } from '@/lib/auth/logout';
import api from '@/lib/api/client';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import { InputSwitch } from 'primereact/inputswitch';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';

export default function Header() {
  const { user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };
  return (
    <div className="fixed top-0 z-50 flex h-[52px] w-full items-center justify-between border-b border-line bg-surface px-6 lg:px-8">
      <button
        type="button"
        className="max-w-[40%] truncate text-left font-sans text-base font-extrabold md:text-lg"
        onDoubleClick={handleLogout}
      >
        <span className="text-brand">Unklab </span>
        KEP
      </button>
      <p className="max-w-[40%] truncate text-sm font-semibold text-ink-muted">
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
  toast,
  questionId,
  fetchQuestions,
}) {
  const router = useRouter();
  const uploadRef = useRef(null);
  const statusIcon =
    statusIcons[saveStatus] || 'pi pi-exclamation-circle text-red-500';
  const statusMsg = statusText[saveStatus] || 'Saved successfully';

  const handleImportQuestion = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      e.target.value = '';
      await api.patch('/questions/import/' + questionId, formData);
      fetchQuestions();
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'question successfully imported',
        life: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: 'error',
        summary: 'There is an error in .CSV file',
        detail: error.response?.data?.message,
        life: 3000,
      });
    }
  };

  return (
    <div className="fixed top-0 w-full h-16 bg-white shadow-lg rounded-b-[24px] z-20">
      <div className="absolute z-10 flex items-center justify-center w-full h-full text-xl text-center font-Nunito">
        <span>Question Editor /</span>
        <span className="font-bold indent-1">
          {questionName || 'Question Name'}
        </span>
        <div
          className="right-0 flex items-center justify-center p-1 ml-1 text-xl text-center rounded-full font-Nunito"
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
        className="z-30 flex flex-row items-center justify-between h-full px-16"
      >
        <button
          className="z-20 flex flex-row items-center justify-center text-black"
          onClick={() => router.back()}
        >
          <div
            className="mr-3 pi pi-angle-left"
            style={{ fontSize: '1.5rem' }}
          />
          <p className="text-2xl font-Roboto">
            <span className="text-accent1">Unklab </span>
            Exams
          </p>
        </button>
        <div className="flex flex-row gap-2">
          <label
            className="z-50 flex items-center justify-center h-10 font-bold text-white cursor-pointer px-7 rounded-3xl font-Nunito bg-accent1"
            htmlFor="uploadCSV"
          >
            <p>Import</p>
            <input
              type="file"
              id="uploadCSV"
              accept=".csv"
              ref={uploadRef}
              onChange={handleImportQuestion}
              className="hidden"
            />
          </label>
          <button
            className="z-20 flex items-center justify-center h-10 px-12 font-bold text-white rounded-3xl font-Nunito bg-accent1"
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
  const params = useParams();
  const examId = params.examId;
  const toast = useRef(null);
  const router = useRouter();
  const [minute, setMinute] = useState(90);

  const op = useRef(null);
  const minuteOverlayRef = useRef(null);

  const handleStartExam = async () => {
    try {
      const res = await api.patch(
        '/exam/start/' + examId + '?minute=' + minute
      );
      setTime(res.data.time);
      setToken(res.data.token);
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: 'error',
        summary: 'Error when starting exam',
        detail: err.response?.data?.message,
        life: 5000,
      });
    }
  };

  const handleStopExam = async () => {
    try {
      const res = await api.patch('/exam/start/' + examId + '?minute=0');
      setTime(res.data.time);
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: 'error',
        summary: 'Error when starting exam',
        detail: err.response?.data?.message,
        life: 5000,
      });
    }
  };

  const handleSwitch = async (changes) => {
    try {
      const change = { [changes]: !checked[changes] };
      if (change.isShowAnswer) change.isShowScore = true;
      if (change.isShowScore === false) change.isShowAnswer = false;
      const res = await api.patch('/exam/switch/' + examId, change);
      const initialSwitch = {
        isShowScore: res.data.isShowScore,
        isShowAnswer: res.data.isShowAnswer,
        isRandom: res.data.isRandom,
      };
      setChecked(initialSwitch);
    } catch (err) {
      console.log(err);
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
          className="z-20 flex flex-row items-center justify-center text-black"
          onClick={() => router.back()}
        >
          <div
            className="mr-3 pi pi-angle-left"
            style={{ fontSize: '1.5rem' }}
          />
          <p className="text-2xl font-Roboto">
            <span className="text-accent1">Unklab </span>
            Exams
          </p>
        </button>
        <div className="flex flex-row gap-3">
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
            <div className="flex flex-col justify-start gap-2 font-semibold text-black select-none text-md font-Nunito">
              <div className="flex items-center justify-start gap-2">
                <InputSwitch
                  checked={checked.isShowScore}
                  onChange={() => handleSwitch('isShowScore')}
                />
                <span>Show score to student</span>
              </div>
              <div className="flex items-center justify-start gap-2">
                <InputSwitch
                  checked={checked.isShowAnswer}
                  onChange={() => handleSwitch('isShowAnswer')}
                />
                <span>Show correct answer to student</span>
              </div>
              <div className="flex items-center justify-start gap-2">
                <InputSwitch
                  checked={checked.isRandom}
                  onChange={() => handleSwitch('isRandom')}
                />
                <span>Randomize student question and option</span>
              </div>
            </div>
          </OverlayPanel>
          <Button
            type="button"
            icon="pi pi-cog"
            className="w-10 h-10 border-2 shadow-md rounded-3xl bg-accent1 border-accent1"
            onClick={(e) => op.current.toggle(e)}
          />
          {time === 0 || time < 0 || time === 'NaN' ? (
            <div className="flex flex-row">
              <button
                className="z-50 flex items-center justify-center py-2 pl-10 font-bold text-white pr-7 rounded-l-3xl font-Nunito bg-accent1"
                onClick={handleStartExam}
              >
                Start
              </button>
              <button
                className="flex items-center justify-center py-2 font-bold text-accent1 pr-2 pl-1.5 rounded-r-3xl font-Nunito bg-accent1/20 border-2 border-accent1 z-50"
                onClick={(e) => minuteOverlayRef.current.toggle(e)}
              >
                <i className="pi pi-angle-down " />
              </button>
              <OverlayPanel ref={minuteOverlayRef} className="rounded-2xl">
                <div className="flex flex-row gap-2">
                  <span className="p-input-icon-left ">
                    <i className="pi pi-clock " />
                    <InputText
                      className="rounded-md py-1 w-[100px]"
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                    />
                  </span>
                </div>
              </OverlayPanel>
            </div>
          ) : (
            <button
              className="z-50 flex items-center justify-center py-2 font-bold text-white px-14 rounded-3xl font-Nunito bg-accent2"
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
