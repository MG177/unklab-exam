'use client';

import React, { useContext, useEffect, useState, useRef } from 'react';
import Timer, { TimerBig } from './Timer';
import { useRouter } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';
import api from '@/lib/api/client';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { logout } from '@/lib/auth/logout';

export default function Footer({ questions, number, setNumber, fetchQuestion }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const question = questions[number];
  const [isBookmark, setIsBookmark] = useState(question.isBookmark || false);
  const confirmSubmitRef = useRef(null);
  const [confirmSubmitPopup, setConfirmSubmitPopup] = useState(false);

  useEffect(() => {
    setIsBookmark(question.isBookmark);
  }, [number, question.isBookmark]);

  const handleTimeOut = () => {
    console.log('time out');
  };

  const handleNextQuestion = () => {
    if (number === questions.length - 1) {
      return;
    } else {
      setNumber((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (number === 0) {
      return;
    } else {
      setNumber((prev) => prev - 1);
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await api.patch('student/bookmark', {
        index: number,
        isBookmark: !isBookmark,
      });
      setIsBookmark(res.data);
      fetchQuestion();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitQuestion = async () => {
    try {
      await api.patch('student/submit');
      if (user.isShowScore) {
        router.push('/score');
      } else {
        await logout();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed flex flex-row bottom-0 items-center justify-between w-full h-24 px-6 lg:px-10 bg-white rounded-t-3xl shadow-[0px_5px_25px_0px_rgba(0,0,0,0.25)] z-50 select-none">
      <div className="font-Nunito w-[30%]">
        <p className="text-accent1 font-semibold text-xl capitalize truncate w-full">
          {user.examName || 'Exam name'}
        </p>
        <p className="text-lg text-black font-normal w-full leading-none">
          {`Question ${number + 1} of ${questions.length}`}
        </p>
      </div>
      <div className="flex justify-center self-center w-[30%]">
        <Timer onTimeUp={handleTimeOut} />
      </div>

      <div className="flex flex-row w-[30%] justify-end gap-3">
        <ConfirmPopup
          target={confirmSubmitRef.current}
          visible={confirmSubmitPopup}
          onHide={() => setConfirmSubmitPopup(false)}
          message="Are you sure you want to submit now?"
          icon="pi pi-exclamation-triangle"
          accept={handleSubmitQuestion}
          reject={() => setConfirmSubmitPopup(false)}
          className="rounded-2xl w-[300px]"
          rejectClassName="rounded-xl bg-whitePlus hover:bg-blue-100 text-blue-600 border border-whitePlus hover:border-whitePlus"
          acceptClassName="rounded-xl bg-blue-500 hover:bg-blue-600 text-white border border-blue-500 hover:border-blue-600"
        />
        {number === 0 ? null : (
          <button
            className="pi pi-arrow-left bg-white font-bold text-xl text-accent1 rounded-full shadow-lg border-[1px] border-gray/25 py-2.5 px-3.5 md:px-8 md:py-3 transition ease-out duration-200 hover:scale-[1.05]"
            onClick={handlePrevQuestion}
          />
        )}
        {number === questions.length - 1 ? (
          <button
            className="bg-white font-Nunito font-bold text-lg lg:text-xl text-accent1 rounded-full shadow-lg border-[1px] border-gray/25 px-3 md:px-5 py-2 transition ease-out duration-200 hover:scale-[1.05]"
            ref={confirmSubmitRef}
            onClick={() => setConfirmSubmitPopup(true)}
          >
            Submit
          </button>
        ) : (
          <button
            className="pi pi-arrow-right bg-white font-bold text-xl text-accent1 rounded-full shadow-lg border-[1px] border-gray/25 py-2.5 px-3.5 md:px-8 md:py-3 transition ease-out duration-200 hover:scale-[1.05]"
            onClick={handleNextQuestion}
          />
        )}

        <button
          className={`pi ${isBookmark ? 'pi-bookmark-fill' : 'pi-bookmark'
            } bg-white text-xl text-yellow-500 rounded-full shadow-lg border-[1px] border-gray/25 px-5 md:px-4 py-2 transition ease-out duration-200 hover:scale-[1.05]`}
          onClick={handleBookmark}
        />
      </div>
    </div>
  );
}

export function FooterCountdown({ setTime, time, setVisibleBottom }) {
  const { user } = useContext(AuthContext);
  const confirmLogoutRef = useRef(null);
  const [confirmLogoutPopup, setConfirmLogoutPopup] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed flex flex-row bottom-0 items-center justify-between w-full h-24 px-6 lg:px-10 bg-white rounded-t-3xl shadow-[0px_5px_25px_0px_rgba(0,0,0,0.25)] z-50 select-none">
      <div className="font-Nunito w-[30%]">
        <p className="text-accent1 font-semibold text-xl capitalize truncate w-full">
          {user.examName || 'Exam name'}
        </p>
        <p className="text-lg text-black font-normal w-full leading-none whitespace-nowrap">
          {`Completed all questions`}
        </p>
      </div>
      <div className="flex justify-center self-center w-[30%]">
        {time > 0 ? (
          <TimerBig setTimeRemaining={setTime} timeRemaining={time} />
        ) : (
          user.isShowAnswer && (
            <button
              className="flex items-center justify-center text-xl bg-whitePlus rounded-3xl py-2 px-4 border border-gray/20 transition-all duration-200 ease-out font-bold z-30 shadow-md font-Nunito whitespace-nowrap leading-none"
              onClick={() => setVisibleBottom(true)}
            >
              Show answer
            </button>
          )
        )}
      </div>

      <div className="flex flex-row w-[30%] justify-end gap-3">
        <ConfirmPopup
          target={confirmLogoutRef.current}
          visible={confirmLogoutPopup}
          onHide={() => setConfirmLogoutPopup(false)}
          message="Are you sure you want to logout?"
          icon="pi pi-exclamation-triangle"
          accept={handleLogout}
          reject={() => setConfirmLogoutPopup(false)}
          className="rounded-2xl w-[300px]"
          rejectClassName="rounded-xl bg-whitePlus hover:bg-blue-100 text-blue-600 border border-whitePlus hover:border-whitePlus"
          acceptClassName="rounded-xl bg-red-500 hover:bg-red-600 text-white border border-red-500 hover:border-red-600"
        />
        <button
          className="bg-accent2 font-Nunito flex font-bold text-lg lg:text-xl text-white rounded-full shadow-lg border-[1px] border-gray/25 px-5 py-2 transition ease-out duration-200 hover:scale-[1.05]"
          ref={confirmLogoutRef}
          onClick={() => setConfirmLogoutPopup(true)}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
