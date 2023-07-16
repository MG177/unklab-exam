import React, { useContext, useEffect, useState, useRef } from 'react';
import Timer, { TimerBig } from './Timer';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import api from '../config';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

export default function Footer({ questions, number, setNumber, fetchQuestion }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const question = questions[number];
  const [isBookmark, setIsBookmark] = useState(question.isBookmark || false);
  const confirmSubmitRef = useRef(null);
  const [confirmSubmitPopup, setConfirmSubmitPopup] = useState(false);

  useEffect(() => {
    setIsBookmark(question.isBookmark);
  }, [number]);

  const handleTimeOut = () => {
    console.log('time out');
    // navigate('/score');
  };

  const handleNextQuestion = () => {
    console.log('next question', number + 1);
    if (number === questions.length - 1) {
      console.log('last question');
      return;
    } else {
      setNumber((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    console.log('prev question', number - 1);
    if (number === 0) {
      console.log('first question');
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
      console.log('bookmark', res.data);
      setIsBookmark(res.data);
      fetchQuestion();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitQuestion = async () => {
    try {
      const res = await api.patch('student/submit');
      if (user.isShowScore) {
        // const res = await api.get('student/score');
        // console.log('score', res.data);
        navigate('/score');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const isBookmarked = () => {
  //   if (isBookmark) {
  //     return 'pi-bookmark-fill';
  //   } else {
  //     return 'pi-bookmark';
  //   }
  // };

  return (
    <div className="fixed flex flex-row bottom-0 items-center justify-between w-full h-24 px-6 lg:px-10 bg-white rounded-t-3xl shadow-[0px_5px_25px_0px_rgba(0,0,0,0.25)] z-50 select-none">
      <div className="font-Nunito w-[30%]">
        <p className="text-accent1 font-semibold text-xl capitalize truncate w-full">
          {user.examName || 'Exam name'}
          {/* ouisdf8yhg9348yodfijgdfhjdgfjfgjtgasdasgdagdsg */}
        </p>
        <p className="text-lg text-black font-normal w-full leading-none">
          {/* {`Question null of null`} */}
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
            // onClick={handleSubmitQuestion}
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
  const navigate = useNavigate();
  const confirmLogoutRef = useRef(null);
  const [confirmLogoutPopup, setConfirmLogoutPopup] = useState(false);

  const handleLogout = () => {
    //clear local storage
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="fixed flex flex-row bottom-0 items-center justify-between w-full h-24 px-6 lg:px-10 bg-white rounded-t-3xl shadow-[0px_5px_25px_0px_rgba(0,0,0,0.25)] z-50 select-none">
      <div className="font-Nunito w-[30%]">
        <p className="text-accent1 font-semibold text-xl capitalize truncate w-full">
          {user.examName || 'Exam name'}
          {/* ouisdf8yhg9348yodfijgdfhjdgfjfgjtgasdasgdagdsg */}
        </p>
        <p className="text-lg text-black font-normal w-full leading-none whitespace-nowrap">
          {/* {`Question null of null`} */}
          {`Completed all questions`}
        </p>
      </div>
      <div className="flex justify-center self-center w-[30%]">
        {/* <Timer onTimeUp={handleTimeOut} /> */}
        {time > 0 ? (
          <TimerBig setTimeRemaining={setTime} timeRemaining={time} />
        ) : (
          user.isShowAnswer && (
            <button
              className="flex items-center justify-center text-xl bg-whitePlus rounded-3xl py-2 px-4 border border-gray/20 transition-all duration-200 ease-out font-bold z-30 shadow-md font-Nunito whitespace-nowrap leading-none"
              onClick={() => setVisibleBottom(true)}
            >
              Show answer
              {/* <i className="fas fa-chevron-up ml-1 mt-1"></i> */}
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
        // onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
