import React, { useState, useContext } from 'react';
import api from '../../config';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';

export default function Form() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [student, setStudent] = useState({
    noreg: '',
    token: ''
  });
  const [admin, setAdmin] = useState({
    username: '',
    password: ''
  });
  const [adminForm, setAdminForm] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudent((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleUsernameInput = (event) => {
    setAdmin((prevState) => ({
      ...prevState,
      username: event.target.value
    }));
    handleInputChange(event);
  };
  const handlePasswordInput = (event) => {
    setAdmin((prevState) => ({
      ...prevState,
      password: event.target.value
    }));
    handleInputChange(event);
  };
  const handleLogin = (event) => {
    event.preventDefault();
    console.log(student);
    try {
      api.post('/auth/login/student', student).then((response) => {
        console.log(response);
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.data.access_token);
        setUser(response.data);
        navigate('/started');
      });
      // Perform any necessary actions upon successful login
    } catch (error) {
      console.log(error);
      // Perform any necessary actions upon failed login
    }
    console.log('login student');
  };
  const handleLoginAdmin = (event) => {
    event.preventDefault();
    try {
      api.post('/auth/login/admin', admin).then((response) => {
        console.log(response);
      });
      // Perform any necessary actions upon successful login
    } catch (error) {
      console.log(error);
      // Perform any necessary actions upon failed login
    }
    console.log('login admin');
  };

  return (
    <div>
      {adminForm ? (
        <form onSubmit={handleLoginAdmin}>
          <div className='max-w-[625px] text-center p-12 md:p-[60px] gap-[32px] rounded-[12px] bg-[#FAFAFA] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center'>
            <div className='flex flex-col justify-center items-center'>
              <div className='flex text-5xl md:text-[62px] font-inter font-bold '>
                <h1 className='text-[#37474F]'>Welcome Admin</h1>
                <h1 className='text-[#FF6593]'>!</h1>
              </div>
              <p className='font-Nunito font-normal text-lg md:text-[24px] leading-[29.05px] '>
                Let's get you started with your exams. Enter your login details
                and token to access your account.
              </p>
            </div>
            <div className='flex flex-col gap-6 w-full'>
              <div className='flex flex-col items-start '>
                <label htmlFor='noreg' className='mb-2'>
                  Username
                </label>
                <input
                  name='noreg'
                  id='noreg'
                  value={student.noreg}
                  onChange={handleUsernameInput}
                  type='text'
                  placeholder='John'
                  className='w-full py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg md:text-[24px] pl-[22px] placeholder:text-[#37474F40]'
                />
              </div>
              <div className='flex flex-col items-start '>
                <label htmlFor='token' className='mb-2'>
                  Token
                </label>
                <input
                  name='token'
                  id='token'
                  value={student.token}
                  onChange={handlePasswordInput}
                  type='password'
                  placeholder='********'
                  className='w-full py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg md:text-[24px] pl-[22px] placeholder:text-[#37474F40]'
                />
              </div>
            </div>
            <button
              type='submit'
              className='uppercase w-full py-4 rounded-full bg-[#B55FFE] text-[#FAFAFA] font-semibold text-lg md:text-[24px]'
              onClick={() => setAdminForm(true)}>
              Login as admin
            </button>
            <button
              type='button'
              className='uppercase py-4 rounded-full bg-[#ff032d] text-[#FAFAFA] font-semibold text-lg md:text-[24px] opacity-10 absolute top-0 w-2 h-2 left-390 right-0'
              onClick={() => setAdminForm(false)}></button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <div className='max-w-[625px] text-center p-12 md:p-[60px] gap-[32px] rounded-[12px] bg-[#FAFAFA] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center'>
            <div className='flex flex-col justify-center items-center'>
              <div className='flex text-5xl md:text-[62px] font-inter font-bold '>
                <h1 className='text-[#37474F]'>Welcome</h1>
                <h1 className='text-[#FF6593]'>!</h1>
              </div>
              <p className='font-Nunito font-normal text-lg md:text-[24px] leading-[29.05px] '>
                Let's get you started with your exams. Enter your login details
                and token to access your account.
              </p>
            </div>
            <div className='flex flex-col gap-6 w-full'>
              <div className='flex flex-col items-start '>
                <label htmlFor='noreg' className='mb-2'>
                  Registration Number
                </label>
                <input
                  name='noreg'
                  id='noreg'
                  value={student.noreg}
                  onChange={handleUsernameInput}
                  type='text'
                  placeholder='S2200000'
                  className='w-full py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg md:text-[24px] pl-[22px] placeholder:text-[#37474F40]'
                />
              </div>
              <div className='flex flex-col items-start '>
                <label htmlFor='token' className='mb-2'>
                  Token
                </label>
                <input
                  name='token'
                  id='token'
                  value={student.token}
                  onChange={handlePasswordInput}
                  type='text'
                  placeholder='Token'
                  className='w-full py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg md:text-[24px] pl-[22px] placeholder:text-[#37474F40]'
                />
              </div>
            </div>

            <button
              type='submit'
              className='uppercase w-full py-4 rounded-full bg-[#B55FFE] text-[#FAFAFA] font-semibold text-lg md:text-[24px]'>
              Login
            </button>
            <button
              type='button'
              className='uppercase py-4 rounded-full bg-[#ff032d] text-[#FAFAFA] font-semibold text-lg md:text-[24px] opacity-10 absolute top-0 w-2 h-2 left-390 right-0'
              onClick={() => setAdminForm(true)}></button>
          </div>
        </form>
      )}
    </div>
  );
}
