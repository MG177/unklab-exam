import React, { useState, useEffect } from 'react';

export default function TimerSmall() {
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (timeRemaining === 0) {
      window.location.href = '/score';
    }
  }, [timeRemaining]);

  const minutes = Math.floor(timeRemaining / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timeRemaining % 60).toString().padStart(2, '0');

  return (
    <div className="flex flex-row justify-center items-center w-[204.5px] h-[61px] bg-white gap-[10px] mt-[41.5px] mb-[41px] mr-[120px] px-[14px] py-[20px] rounded-[24px] shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]">
      <p className="text-accent2 font-bold font-nunito text-[41px]">{`${minutes}:${seconds}`}</p>
    </div>
  );
}
