import React, {
  useState,
  // useContext,
  useEffect,
} from 'react';
// import AuthContext from "../../contexts/AuthContext";
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
      navigate('/exam');
    } else {
      shakeitBaby();
    }
  };
  return (
    <div
      style={{ userSelect: 'none' }}
      onCopy={(event) => {
        event.preventDefault();
      }}
      className="w-full h-screen bg-[url('./image/Background.svg')] bg-cover flex justify-center items-center"
    >
      <div
        style={{ userSelect: 'none' }}
        onCopy={(event) => {
          event.preventDefault();
        }}
        className="px-10 py-8 h-max rounded-3xl  bg-white shadow-xl flex gap-5 flex-col items-center"
      >
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
