import React, { useContext } from 'react';
import TimerSmall from './TimerSmall';
import Arrow from '../image/arrow_next.svg';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import api from '../config';

export default function Footer({
  question,
  questions,
  time,
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

        // Check if the API hit was successful
        if (hitAnswer.status === 200 && hitAnswer.data) {
          setAnswer(null);
          // setQuestion((prev) => prev + 1);
          // window.location.reload();
          fetchQuestion();
        } else {
          console.log('API hit was not successful');
          // Handle the error or show an error message to the user
        }
      } catch (error) {
        console.log('API hit failed:', error);
        // Handle the error or show an error message to the user
      }
    }

    if (!question) {
      // handleTimeOut();
      navigate('/waiting');
    }
  };

  const handleTimeOut = () => {
    console.log('time out');
    navigate('/score');
  };

  const handleLogout = () => {
    //clear local storage
    localStorage.clear();
    window.location.href = '/';
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
    <div
      style={{ userSelect: 'none' }}
      onCopy={(event) => {
        event.preventDefault();
      }}
      className="fixed bottom-0 w-full h-28 bg-white rounded-t-[24px] shadow-[0px_5px_25px_0px_rgba(0,0,0,0.25)] flex flex-row items-center justify-between z-50"
    >
      <div className="font-nunito my-[40.26px] ml-28 w-content">
        <p className="text-accent1 text-[29px] font-bold">{user.examName}</p>
        {validateUrlExam() && (
          <p className="text-[20px] text-black font-normal">
            {`Question ${question.id} of ${questions.length + question.id - 1}`}
          </p>
        )}
      </div>
      {validateUrlExam() && <TimerSmall time={time} onTimeUp={handleTimeOut} />}
      {validateUrlExam() && question !== null && (
        <button
          type="button"
          onClick={handleNext}
          className="bg-white w-[86px] h-[86px] flex items-center justify-center mr-[120px] mt-[29px] mb-[29px]"
        >
          <img src={Arrow} alt="" className="w-[59px] h-[44px]" />
        </button>
      )}
      {validateUrlPathFinish() && (
        <button
          className="bg-accent2 w-[152px] h-[57px] font-[Nunito] font-bold text-[24px] text-[#FAFAFA] rounded-[34px] shadow-[0_5px_25px_rgba(0,0,0,0.2)] mr-[120px]"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
}
