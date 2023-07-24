// import { isValidDateValue } from "@testing-library/user-event/dist/utils";
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../config';

export default function TimerSmall() {
  const { user } = useContext(AuthContext);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();
  const [time, setTime] = useState(2);
  const [loading, setLoading] = useState(true);

  const fetchTime = async () => {
    try {
      const response = await api.get(`exam/time/${user.examId}`);
      setTime(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response.status === 403) {
        navigate('/score');
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTime();

    const intervalId = setInterval(() => {
      fetchTime();
    }, 30000); // Send request every 30 seconds

    return () => clearInterval(intervalId); // Clear interval when component unmounts
  }, []);

  useEffect(() => {
    setTimeRemaining(time);
  }, [time]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => {
        if (prevTimeRemaining <= 1 && loading === false) {
          navigate('/score');
          clearInterval(intervalId);
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
    <div className="flex flex-row justify-center items-center max-h-fit max-w-fit bg-white px-4 py-2 rounded-[24px] shadow-lg text-accent2 font-bold font-Roboto  ">
      <p className="hidden text-2xl lg:block">
        {timeRemaining <= 0
          ? 'Time Out'
          : hours !== 0
            ? `${hoursStr} Hour${hours === 1 ? '' : 's'} ${minutesStr} Minute${minutes === 1 ? '' : 's'
            }`
            : `${minutes !== 0
              ? `${minutesStr} Minute${minutes === 1 ? '' : 's'}`
              : `${secondsStr} Second${seconds === 1 ? '' : 's'}`
            }`}
      </p>
      <p className="text-xl lg:hidden">
        {timeRemaining <= 0
          ? 'Time Out'
          : `${hoursStr} : ${minutesStr} : ${secondsStr}
          `}
      </p>
    </div>
  );
}

export function TimerBig({ timeRemaining, setTimeRemaining }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [time, setTime] = useState(2);

  const fetchTime = async () => {
    try {
      const response = await api.get(`exam/time/${user.examId}`);
      setTime(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTime();

    const intervalId = setInterval(() => {
      fetchTime();
    }, 30000); // Send request every 30 seconds

    return () => clearInterval(intervalId); // Clear interval when component unmounts
  }, []);

  useEffect(() => {
    setTimeRemaining(time);
  }, [time]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => {
        if (prevTimeRemaining <= 1) {
          clearInterval(intervalId);
          // navigate('/score');
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
  // console.log('timeRemaining = ', timeRemaining);
  return (
    <div className="flex flex-row justify-center items-center max-h-fit max-w-fit bg-white px-4 py-2 rounded-[24px] shadow-lg text-accent2 font-bold font-Roboto  ">
      <p className="hidden text-2xl lg:block">
        {!timeRemaining
          ? 'Time Out'
          : hours !== 0
            ? `${hoursStr} Hour${hours === 1 ? '' : 's'} ${minutesStr} Minute${minutes === 1 ? '' : 's'
            }`
            : `${minutes !== 0
              ? `${minutesStr} Minute${minutes === 1 ? '' : 's'}`
              : `${secondsStr} Second${seconds === 1 ? '' : 's'}`
            }`}
      </p>
      <p className="text-xl lg:hidden">
        {!timeRemaining
          ? 'Time Out'
          : `${hoursStr} : ${minutesStr} : ${secondsStr}
          `}
      </p>
    </div>
  );
}
