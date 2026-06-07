'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth/logout';

export default function GetstartedPage() {
  const [isShaking, setIsShaking] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const handleChange = () => {
    setIsChecked((current) => !current);
  };

  function shakeitBaby() {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 1000);
  }

  useEffect(() => {
    if (sessionStorage.getItem('agree')) {
      router.push('/exam');
    }
  }, [router]);

  const handleLogout = () => {
    logout();
  };

  const handleStart = () => {
    if (isChecked) {
      sessionStorage.setItem('agree', true);
      router.push('/exam');
    } else {
      shakeitBaby();
    }
  };

  return (
    <div className="w-full h-screen bg-[url('/image/Background.svg')] bg-cover flex justify-center items-center select-none">
      <div className="px-10 py-8 h-max rounded-3xl  bg-white shadow-xl flex gap-5 flex-col items-center ">
        <button
          type="button"
          className="py-4 rounded-full bg-[#ff032d] text-white font-semibold text-lg md:text-[24px] opacity-10 absolute top-0 w-2 h-2 left-390 right-0"
          onClick={handleLogout}
        ></button>
        <div className="font-Nunito text-4xl font-bold text-black">
          <p>
            Welcome to the Exam Test
            <span className="text-accent2">!</span>
          </p>
        </div>
        <div className="max-[720px]:mt-[20px] max-[720px]:w-[500px]">
          <img src="/image/terms and conditions.svg" alt="Terms and conditions" />
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
          <button
            onClick={handleStart}
            className={`font-Nunito max-[720px]:py-[8px] max-[720px]:text-lg font-bold text-2xl py-[14px] px-[211px] rounded-[34px] ${
              !isChecked && 'text-black bg-[#E0E0E0]'
            } text-white bg-accent1`}
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
}
