import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../config';
import { useNavigate } from 'react-router-dom';
// import Clock from "../image/clock_icon.svg";

export default function Timer() {
  // const [time, setTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await api.get(
          `time/${JSON.parse(localStorage.getItem('examId'))}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem('access_token')
              )}`,
            },
          }
        );
        setTimeRemaining(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTime(); // Fetch time once when component mounts

    const intervalId = setInterval(() => {
      fetchTime();
    }, 5000); // Send request every 5 seconds

    return () => clearInterval(intervalId); // Clear interval when component unmounts
  }, []);

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
  const seconds = Math.floor(timeRemaining % 60);

  const hoursStr = hours.toString().length === 1 ? `0${hours}` : hours;
  const minutesStr = minutes.toString().length === 1 ? `0${minutes}` : minutes;
  const secondsStr = seconds.toString().length === 1 ? `0${seconds}` : seconds;

  return (
    <div className="flex flex-row justify-center items-center text-[72px] gap-[16px] px-[20px] py-[28px] min-w-fit h-[140px] bg-white rounded-[24px]">
      <p className="font-bold text-accent2 font-nunito">
        {hours === 0
          ? `00 : ${minutesStr} : ${secondsStr}`
          : `${hoursStr} : ${minutesStr} : ${secondsStr}`}
      </p>
    </div>
  );
}
