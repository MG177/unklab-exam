import React, { useRef } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { useNavigate, useParams } from 'react-router-dom';
import { ExamModalEditor } from './dashboard/ExamModal';
import api from '../config';
import { Toast } from 'primereact/toast';

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

export function HeaderExamDashboard({ examName, setTime, time, setToken }) {
  const { examId } = useParams();
  const modalRef = useRef(null);
  const uploadRef = useRef(null);
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const handleAddExam = async (e) => {
    e.preventDefault();
    console.log('tes');
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const response = await api.patch('/exam/studentList/' + examId, formData);
      // if (response.status === 201) {
      //   // fetchData();
      //   // fetchDataBySession(newSession);
      //   // setSelectedSession(newSession);
      //   // newClassDialog.close();
      //   alert('Exam uploaded successfully');
      // } else {
      //   throw new Error('Something went wrong, please try again later');
      // }
      e.target.value = '';
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Student list uploaded successfully',
        life: 3000,
      });
      // e.target.value = null;
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to upload student list',
        life: 3000,
      });
      // alert(error.message);
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

  return (
    <div className="fixed top-0 w-full h-16 bg-white shadow-lg rounded-b-[24px] z-50">
      <div className="absolute flex items-center justify-center w-full h-full text-xl text-center font-Nunito">
        <span>Exam Manager /</span>
        <span className="font-bold indent-1">{examName || 'QuestionName'}</span>
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
            className="mr-3 pi pi-angle-left z-50"
            onClick={() => navigate(-1)}
            style={{ fontSize: '1.5rem' }}
          />
          <p className="font-[Roboto] text-2xl">
            <span className="text-accent1">Unklab </span>
            Exams
          </p>
        </div>
        <div className="flex flex-row gap-3">
          <ExamModalEditor
            modalRef={modalRef}
            examId={examId}
            examName={examName}
          />
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
          <button
            className="w-10 h-10 text-white rounded-full pl-1 pi pi-file-edit bg-accent1 z-50"
            style={{ fontSize: '1.3rem' }}
            onClick={handleOpenModal}
          />

          <label
            className="cursor-pointer flex items-center justify-center py-2 font-bold text-white px-10 rounded-3xl font-Nunito bg-accent1 z-50"
            htmlFor="uploadCSV"
          >
            <p className="text-base text-whitePlus">Import</p>
            <input
              type="file"
              id="uploadCSV"
              accept=".csv"
              ref={uploadRef}
              // onInput={handleAddExam}
              onChange={handleAddExam}
              className="hidden"
            />
          </label>
          {/* <button className="flex items-center justify-center py-2 font-bold text-white px-10 rounded-3xl font-Nunito bg-accent1 z-50">
            Import
          </button> */}
          {/* {time === 0 || time < 0 ? (
            <button
              className="flex items-center justify-center py-2 font-bold text-white px-14 rounded-3xl font-Nunito bg-accent2 z-50"
              onClick={handleStopExam}
            >
              Stop
            </button>
          ) : (
            <button
              className="flex items-center justify-center py-2 font-bold text-white px-14 rounded-3xl font-Nunito bg-accent1 z-50"
              onClick={handleStartExam}
            >
              Start
            </button>
          )} */}
          {time === 0 || time < 0 ? (
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
