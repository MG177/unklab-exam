import React, { useContext, useEffect, useState } from 'react';
import Timer from './Timer';
import Arrow from '../image/arrow_next.svg';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import api from '../config';

export default function Footer({ questions, number, setNumber }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const question = questions[number];
  const [isBookmark, setIsBookmark] = useState(question.isBookmark || false);

  useEffect(() => {
    setIsBookmark(question.isBookmark);
  }, [number]);

  const handleTimeOut = () => {
    console.log('time out');
    // navigate('/score');
  };

  const handleLogout = () => {
    //clear local storage
    // sessionStorage.clear();
    // window.location.href = '/';
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitQuestion = async () => {
    try {
      const res = await api.get('student/score');
      console.log('score', res.data);
      navigate('/score');
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
        {number === 0 ? null : (
          <button
            className="pi pi-arrow-left bg-white font-bold text-xl text-accent1 rounded-full shadow-lg border-[1px] border-gray/25 py-2.5 px-3.5 md:px-8 md:py-3 transition ease-out duration-200 hover:scale-[1.05]"
            onClick={handlePrevQuestion}
          />
        )}
        {number === questions.length - 1 ? (
          <button
            className="bg-white font-Nunito font-bold text-lg lg:text-xl text-accent1 rounded-full shadow-lg border-[1px] border-gray/25 px-3 md:px-5 py-2 transition ease-out duration-200 hover:scale-[1.05]"
            onClick={handleSubmitQuestion}
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
          className={`pi ${
            isBookmark ? 'pi-bookmark-fill' : 'pi-bookmark'
          } bg-white text-xl text-yellow-500 rounded-full shadow-lg border-[1px] border-gray/25 px-5 md:px-4 py-2 transition ease-out duration-200 hover:scale-[1.05]`}
          onClick={handleBookmark}
        />
      </div>
    </div>
  );
}
