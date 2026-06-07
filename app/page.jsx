'use client';

import React, { useContext, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';
import api from '@/lib/api/client';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useContext(AuthContext);
  const studentStudentIdRef = useRef(null);
  const studentTokenRef = useRef(null);
  const adminUsernameRef = useRef(null);
  const adminPasswordRef = useRef(null);
  const [adminForm, setAdminForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    sessionStorage.clear();
    if (!studentStudentIdRef.current.value || !studentTokenRef.current.value) {
      setErrorMessage(
        'Missing required fields. Please fill in all required fields.'
      );
      shakeitBaby();
      return;
    }
    try {
      const studentAuth = await api.post('/auth/login/student', {
        studentId: studentStudentIdRef.current.value.trim(),
        token: studentTokenRef.current.value.trim(),
      });
      const startResponse = await api.post('/student/start', {});
      setUser(studentAuth.data);
      if (startResponse.data === true) {
        router.push('/started');
      }

      if (startResponse.data === false) {
        router.push('/score');
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        setErrorMessage(
          'Incorrect Registration number or Token. Please try again.'
        );
      } else if (error.response?.status === 403) {
        setErrorMessage('Exam timeout or has not started yet.');
      } else {
        setErrorMessage('There are something wrong, please try again.');
      }
      shakeitBaby();
      console.log(error);
    }
  };

  const handleLoginAdmin = async (event) => {
    event.preventDefault();
    sessionStorage.clear();
    try {
      const response = await api.post('/auth/login/admin', {
        username: adminUsernameRef.current.value.trim(),
        password: adminPasswordRef.current.value.trim(),
      });
      setUser(response.data);
      router.push('/dashboard/exams');
    } catch (error) {
      console.log(error);
    }
  };

  const toggleForm = () => {
    setAdminForm(!adminForm);
  };

  function shakeitBaby() {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 1000);
  }

  return (
    <div
      style={{ userSelect: 'none' }}
      onCopy={(event) => {
        event.preventDefault();
      }}
      className="w-full min-h-screen bg-[url('/image/Background.svg')] bg-cover bg-no-repeat flex justify-center items-center"
    >
      <div>
        <button
          type="button"
          className="py-4 rounded-full bg-[#ff032d] text-[#FAFAFA] font-semibold text-lg md:text-[24px] opacity-10 absolute top-0 w-2 h-2 left-390 right-0"
          onClick={() => toggleForm()}
        ></button>
        <div className="h-fit w-[600px] text-center p-10 rounded-3xl scale-90 bg-white shadow-lg justify-center items-center ">
          {adminForm ? (
            <form onSubmit={handleLoginAdmin}>
              <div className="flex flex-row text-5xl font-inter justify-center font-bold">
                <span className="text-black">Welcome Admin</span>
                <span className="text-accent2">!</span>
              </div>
              <div className="flex flex-col w-full gap-6 max-[960px]:mt-2.5 my-10">
                <div className="flex flex-col items-start ">
                  <label htmlFor="username" className="mb-2 font-semibold">
                    Username
                  </label>
                  <input
                    name="username"
                    id="username"
                    key="usernameAdmin"
                    ref={adminUsernameRef}
                    type="text"
                    placeholder="John"
                    className="w-full max-[960px]:py-3 py-6 border-none rounded-xl shadow-lg font-inter font-normal text-lg
                  pl-5 placeholder:text-[#37474F40]"
                  />
                </div>
                <div className="flex flex-col items-start ">
                  <label htmlFor="password" className="mb-2 font-semibold">
                    Password
                  </label>
                  <input
                    name="password"
                    id="password"
                    key="passwordAdmin"
                    ref={adminPasswordRef}
                    type="password"
                    placeholder="********"
                    className="w-full max-[960px]:py-3 py-6 border-none rounded-xl shadow-lg font-inter font-normal text-lg pl-5 placeholder:text-[#37474F40]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="uppercase w-full py-4 rounded-full bg-[#B55FFE] text-[#FAFAFA] font-semibold text-lg text-[24px] max-[960px]:py-3 max-[960px]:text-[16px]"
              >
                Login as admin
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="flex flex-col items-center justify-center">
                <div className="flex text-5xl font-bold text-14 font-inter ">
                  <h1 className="text-black">Welcome</h1>
                  <h1 className="text-accent2">!</h1>
                </div>
                <p
                  style={{ userSelect: 'none' }}
                  className="font-Nunito font-normal text-xl text-[24px] leading-normal mt-4"
                >
                  Let's get you started with your exams. Enter your login
                  details and token to access your Exam.
                </p>
              </div>
              <div className="flex flex-col w-full gap-6 mb-10 mt-3">
                <div className="flex flex-col items-start ">
                  <label htmlFor="studentid" className="mb-2 font-semibold">
                    Student ID
                  </label>
                  <input
                    name="studentid"
                    id="studentid"
                    ref={studentStudentIdRef}
                    type="text"
                    placeholder="S2200000"
                    className="w-full py-6 border-none rounded-xl shadow-lg font-inter font-normal text-lg pl-[22px] placeholder:text-[#37474F40]"
                  />
                </div>
                <div className="flex flex-col items-start ">
                  <label htmlFor="token" className="mb-2 font-semibold">
                    Token
                  </label>
                  <input
                    name="token"
                    id="token"
                    key="token"
                    ref={studentTokenRef}
                    type="text"
                    placeholder="Token"
                    className="w-full py-6 border-none rounded-xl shadow-lg font-inter font-normal text-lg pl-5 placeholder:text-[#37474F40]"
                  />
                </div>
              </div>
              <div className="flex flex-col w-full gap-4">
                {errorMessage && (
                  <div
                    className={`flex justify-center h-fit ${
                      isShaking ? 'animate-horizontal-shaking' : ''
                    }`}
                  >
                    <img src="/media/Warn.svg" className="" alt="" />
                    <div className="h-fit font-Nunito font-normal text-[17px] leading-[20.4px] text-accent2 text-left ml-4 -mb-6">
                      {errorMessage}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="uppercase w-full py-4 rounded-full bg-accent1 text-white font-semibold text-lg text-6"
                >
                  Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
