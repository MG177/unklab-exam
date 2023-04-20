import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TimerSmall({ time }) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeRemaining(time);
  }, [time]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => {
        if (prevTimeRemaining <= 1) {
          clearInterval(intervalId);
          navigate('/score');
        } else {
          return prevTimeRemaining - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [navigate]);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  // const seconds = Math.floor(timeRemaining % 60);

  const hoursStr = hours.toString().length === 1 ? `0${hours}` : hours;
  const minutesStr = minutes.toString().length === 1 ? `0${minutes}` : minutes;
  // const secondsStr = seconds.toString().length === 1 ? `0${seconds}` : seconds;

  return (
    <div className="flex flex-row justify-center items-center w-[204.5px] h-[61px] bg-white gap-[10px] mt-[41.5px] mb-[41px] mr-[120px] px-[14px] py-[20px] rounded-[24px] shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]">
      <p className="text-accent2 font-bold font-nunito text-[41px]">
        {/* {hours > 0 ? `${hoursStr} : ` : ''}
        {`${minutesStr} : ${secondsStr}`} */}
        {hours === 0 ? `00 : ${minutesStr}` : `${hoursStr} : ${minutesStr}`}
      </p>
    </div>
  );
}
