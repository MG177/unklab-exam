import React, { useState } from 'react';
import TermsConditions from '../../image/terms and conditions.svg';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isShaking, setIsShaking] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => {
    setIsChecked((current) => !current);
  };

  function shakeitBaby() {
    console.log('shake');
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 1000);
  }

  // useEffect(() => {
  //   // if (sessionStorage.getItem('isScore')) {
  //   //   navigate('/score');
  //   // }
  //   if (sessionStorage.getItem('agree')) {
  //     navigate(/exam/ + JSON.parse(sessionStorage.getItem('examId')));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const logout = async () => {
    //clear local storage
    sessionStorage.clear();
    window.location.href = '/';
  };

  const handleStart = () => {
    if (isChecked) {
      sessionStorage.setItem('agree', true);
      navigate('/exam/start');
    } else {
      shakeitBaby();
    }
  };
  return (
    <div className="w-full h-screen bg-[url('./image/Background.svg')] bg-cover flex justify-center items-center select-none">
      <div className="px-10 py-8 h-max rounded-3xl  bg-white shadow-xl flex gap-5 flex-col items-center ">
        <button
          type="button"
          className="py-4 rounded-full bg-[#ff032d] text-white font-semibold text-lg md:text-[24px] opacity-10 absolute top-0 w-2 h-2 left-390 right-0"
          onClick={logout}
        ></button>
        <div className="font-Nunito text-4xl font-bold text-black">
          <p>
            Welcome to the English Exam Test
            <span className="text-accent2">!</span>
          </p>
        </div>
        <div className="max-[720px]:mt-[20px] max-[720px]:w-[500px]">
          <img src={TermsConditions} alt="" />
        </div>
        {/* <p>
          Before taking the test, please carefully read and agree to the
          following terms and conditions:
          <br />
          <ul type="1">
            <li>
              Test Format: The test will consist of multiple-choice questions
              with some media like image and audio.
            </li>
            <li>
              Test Rules: You must adhere to the following rules while taking
              the test:
            </li>
            <ul>
              <li>
                You must not cheat or use any unauthorized resources during the
                test.
              </li>
              <li>
                You must not share any information about the test or its
                contents with anyone else.
              </li>
              <li>
                You must not attempt to record, copy, or reproduce any part of
                the test.
              </li>
              <li>
                You must not disrupt or interfere with the testing environment
                or other test-takers.
              </li>
            </ul>
            <li>
              Test Results: Your test results will be provided to you
              immediately after the exam is over.
            </li>
          </ul>
          <br />
          By taking the test, you agree to be bound by these terms and
          conditions. If you do not agree to these terms and conditions, you may
          not take the test.
        </p> */}
        <div className="flex flex-col items-center h-fit">
          <form
            action=""
            className={`flex gap-1 mb-[14.5px] ${
              isShaking ? 'animate-horizontal-shaking' : ''
            }`}
          >
            <input
              type="checkbox"
              id="agree"
              name="agreement"
              value={isChecked}
              onChange={handleChange}
              className="w-[17.91px] h-[17.91px] rounded-full focus:ring-white focus:checked:bg-accent2 checked:bg-accent2 checked:hover:bg-accent2"
            />
            <label
              htmlFor="agree"
              className="font-montserrat font-bold text-[14px] max-[720px]:text-[13px] text-black"
            >
              I agree to the Software Exam Test terms and conditions.
            </label>
          </form>
          {/* <div onClick={handleStart}> */}
          <button
            // disabled={!isChecked}
            onClick={handleStart}
            className={`font-Nunito max-[720px]:py-[8px] max-[720px]:text-lg font-bold text-2xl py-[14px] px-[211px] rounded-[34px] ${
              !isChecked && 'text-black bg-[#E0E0E0]'
            } text-white bg-accent1`}
          >
            START
          </button>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
