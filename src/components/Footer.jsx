import React, { useContext } from 'react';
import TimerSmall from './TimerSmall';
import Arrow from '../image/arrow_next.svg';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import api from '../config';

export default function Footer({
  question,
  questions,
  answer,
  setAnswer,
  fetchQuestion,
}) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // console.log("user: " + user.noreg);

  // if (answer) {
  //   console.log("answer: " + answer);
  // }

  const handleNext = async () => {
    console.log('clicked');
    if (!answer || answer === '' || answer === null) {
      console.log('no answer');
      alert('Please choose an answer to continue to the next question');
    } else {
      try {
        const hitAnswer = await api.patch(
          'students/answer/' + user.noreg,
          {
            answer: answer,
            index: question.id - 1,
          },
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
            },
          }
        );
        console.log('hit answer: ' + hitAnswer.data);

        window.location.reload();
        // Check if the API hit was successful
        if (hitAnswer.status === 200 && hitAnswer.data) {
          setAnswer(null);
          fetchQuestion();
        } else {
          console.log('Failed to answer question');
          // Handle the error or show an error message to the user
        }
      } catch (error) {
        console.log('API hit failed:', error);
        alert('Failed to answer question, check your internet connection');
        // Handle the error or show an error message to the user
      }
    }
  };

  const handleTimeOut = () => {
    console.log('time out');
    // navigate('/score');
  };

  const handleLogout = () => {
    //clear local storage
    // sessionStorage.clear();
    // window.location.href = '/';
  };

  const validateUrlExam = () => {
    const rootExamPath = '/exam';
    return window.location.pathname.startsWith(rootExamPath);
  };

  const validateUrlPathFinish = () => {
    const rootExamPathWaiting = '/waiting';
    const rootExamPathScore = '/score';
    if (
      window.location.pathname.startsWith(rootExamPathWaiting) ||
      window.location.pathname.startsWith(rootExamPathScore)
    ) {
      return true;
    }
  };

  return (
    <div className="fixed flex flex-row bottom-0 items-center justify-between w-full h-24 px-6 bg-white rounded-t-3xl shadow-[0px_5px_25px_0px_rgba(0,0,0,0.25)] z-50 select-none">
      <div className="font-Nunito w-[30%]">
        <p className="text-accent1 font-semibold text-xl capitalize truncate w-full">
          {user.examName || 'Exam name'}
          {/* ouisdf8yhg9348yodfijgdfhjdgfjfgjtgasdasgdagdsg */}
        </p>
        {/* {validateUrlExam() && (
          <p className="text-lg text-black font-normal w-full">
            {`Question ${question.id || 'null'} of ${
              question.totalQuestion || 'null'
            }`}
            {`Question null of null`}
          </p>
        )} */}
        <p className="text-lg text-black font-normal w-full">
          {`Question null of null`}
        </p>
      </div>
      <div className="flex justify-center self-center w-[30%]">
        <TimerSmall onTimeUp={handleTimeOut} />
      </div>
      {/* {validateUrlExam() && <TimerSmall time={time} onTimeUp={handleTimeOut} />}
      {validateUrlExam() && question !== null && (
        <button
          type="button"
          onClick={handleNext}
          className="bg-white w-[86px] h-[86px] flex items-center justify-center mr-[120px] mt-[29px] mb-[29px]"
        >
          <img
            src={Arrow}
            alt=""
            className="w-[59px] h-[44px] max-[960px]:w-[35px] max-[960px]:ml-28 max-[960px]:h-[25px] "
          />
        </button>
      )}
      {validateUrlPathFinish() && (
        <button
          className="bg-accent2 max-[960px]:w-[130px] max-[960px]:h-[40px] w-[152px] h-[57px] font-[Nunito] font-bold text-[24px] max-[960px]:text-[16px] text-[#FAFAFA] rounded-[34px] shadow-[0_5px_25px_rgba(0,0,0,0.2)] mr-[120px]"
          onClick={handleLogout}
        >
          Logout
        </button>
      )} */}
      <div className="flex flex-row w-[30%] justify-end">
        <button
          className="bg-accent2 font-Nunito font-bold text-2xl text-white rounded-full shadow-lg px-8 py-2"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
