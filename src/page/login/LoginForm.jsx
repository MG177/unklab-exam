import React, { useContext, useRef, useState } from 'react';
import api from '../../config';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import Vector from '../login/Vector.svg';
import { eventWrapper } from '@testing-library/user-event/dist/utils';

export default function Form() {
  const navigate = useNavigate();
  const { user, setUser, getAllLocalData } = useContext(AuthContext);
  const studentNoregRef = useRef(null);
  const studentTokenRef = useRef(null);
  const adminUsernameRef = useRef(null);
  const adminPasswordRef = useRef(null);
  const [adminForm, setAdminForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    localStorage.clear();
    if (!studentNoregRef.current.value || !studentTokenRef.current.value) {
      setErrorMessage(
        'Missing required fields. Please fill in all required fields.'
      );
      shakeitBaby();
      return;
    }
    try {
      const studentData = await api.post('/auth/login/student', {
        noreg: studentNoregRef.current.value.trim(),
        token: studentTokenRef.current.value.trim(),
      });
      const startResponse = await api.post(
        `/students/start/${studentData.data.data.examId}`,
        {
          token: studentData.data.data.access_token,
        },
        {
          headers: {
            Authorization: `Bearer ${studentData.data.data.access_token}`,
          },
        }
      );

      if (startResponse.status >= 200 && startResponse.status < 300) {
        if (startResponse.data.isScore) {
          // alert("You already finish the exam");
          alert(' Login Success\n Click oke to start Unklab Exam');
          setUser({ ...user, score: startResponse.data.score });
          localStorage.setItem(
            'isScore',
            JSON.stringify(startResponse.data.isScore)
          );
        }
        if (startResponse.data.id) {
          localStorage.setItem(
            'studentId',
            JSON.stringify(startResponse.data.id)
          );
        }
        Object.entries(studentData.data.data).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });

        setUser(studentData.data.data);

        getAllLocalData();
        navigate('/started');
      } else {
        throw new Error('Student not found');
      }
    } catch (error) {
      setErrorMessage(
        'Incorrect Registration number or Token. Please try again.'
      );
      shakeitBaby();
      console.log(error);
    }
  };

  const handleLoginAdmin = (event) => {
    event.preventDefault();
    localStorage.clear();
    try {
      api
        .post('/auth/login/admin', {
          username: adminUsernameRef.current.value.trim(),
          password: adminPasswordRef.current.value.trim(),
        })
        .then((response) => {
          const admin = response.data.data;
          Object.entries(admin).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
          });
          setUser(response.data.data);
          navigate('/dashboard/home');
        });
    } catch (error) {
      console.log(error);
    }
    console.log('login admin');
  };

  const toggleForm = () => {
    setAdminForm(!adminForm);
  };

  function shakeitBaby() {
    console.log('shake');
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 1000);
  }
  return (
    <div>
      <button
        type="button"
        className="py-4 rounded-full bg-[#ff032d] text-[#FAFAFA] font-semibold text-lg md:text-[24px] opacity-10 absolute top-0 w-2 h-2 left-390 right-0"
        onClick={() => toggleForm()}
      ></button>
      {adminForm ? (
        <form onSubmit={handleLoginAdmin}>
          <div className="h-fit w-[600px] text-center p-12 min-[960px]: gap-8 rounded-3xl scale-90 bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex flex-row text-5xl font-inter font-bold mb-2 max-[960px]:mb-0">
                <span className="text-black">Welcome Admin</span>
                <span className="text-accent2">!</span>
              </div>
              <p className="text-lg font-normal font-Nunito">
                Let's get you started with your exams. Enter your login details
                and token to access your account.
              </p>
            </div>
            <div className="flex flex-col w-full gap-6 max-[960px]:-mt-[10px]">
              <div className="flex flex-col items-start ">
                <label htmlFor="username" className="mb-2 max-[960px]:mb-0">
                  Username
                </label>
                <input
                  name="username"
                  id="username"
                  ref={adminUsernameRef}
                  type="text"
                  placeholder="John"
                  className="w-full max-[960px]:py-3 py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg
                  pl-5 placeholder:text-[#37474F40]"
                />
              </div>
              <div className="flex flex-col items-start ">
                <label htmlFor="password" className="mb-2 max-[960px]:mb-0">
                  Password
                </label>
                <input
                  name="password"
                  id="password"
                  ref={adminPasswordRef}
                  type="password"
                  placeholder="********"
                  className="w-full max-[960px]:py-3 py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg pl-5 placeholder:text-[#37474F40]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="uppercase w-full py-4 rounded-full bg-[#B55FFE] text-[#FAFAFA] font-semibold text-lg text-[24px] max-[960px]:py-3 max-[960px]:text-[16px]"
              // onClick={() => (adminFormRef.current = true)}
            >
              Login as admin
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <div className="h-fit w-[600px] text-center p-12 gap-8 rounded-3xl scale-90 bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center">
              <div className="flex text-5xl font-bold text-14 font-inter ">
                <h1 className="text-black">Welcome</h1>
                <h1 className="text-accent2">!</h1>
              </div>
              <p
                style={{ userSelect: 'none' }}
                className="font-Nunito font-normal text-xl text-[24px] leading-normal mt-4"
              >
                Let's get you started with your exams. Enter your login details
                and token to access your account.
              </p>
            </div>
            <div className="flex flex-col w-full gap-6">
              <div className="flex flex-col items-start ">
                <label htmlFor="noreg" className="mb-2">
                  Registration Number
                </label>
                <input
                  name="noreg"
                  id="noreg"
                  ref={studentNoregRef}
                  type="text"
                  placeholder="S2200000"
                  className="w-full py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg pl-[22px] placeholder:text-[#37474F40]"
                />
              </div>
              <div className="flex flex-col items-start ">
                <label htmlFor="token" className="mb-2">
                  Token
                </label>
                <input
                  name="token"
                  id="token"
                  ref={studentTokenRef}
                  type="text"
                  placeholder="Token"
                  className="w-full py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg pl-5 placeholder:text-[#37474F40]"
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
                  <img src={Vector} className="" />
                  <div className="h-fit font-Nunito font-normal text-[17px] leading-[20.4px] text-accent2 text-left ml-4 -mb-6">
                    {errorMessage}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="uppercase w-full py-4 rounded-full bg-[#B55FFE] text-white font-semibold text-lg text-6"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
