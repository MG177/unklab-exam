import React, { useState } from 'react';

export default function Sidebar() {
  const [isHidden, setIsHidden] = useState(true);

  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div className='flex flex-col h-screen w-fit bg-white shadow-2xl'>
      <div className='flex items-center justify-center h-16'>
        <h1 className='font-bold text-3xl'>
          {isHidden ? 'Unklab Exams' : 'UE'}
        </h1>
      </div>
      <nav className='flex-1 px-4'>
        <ul className='space-y-2'>
          <li
            className={`flex font-mediu p-3 bg-accent2 text-white rounded-lg ${
              !isHidden ? 'gap-0 justify-center' : 'gap-3'
            }`}>
            <span className='flex justify-center items-center'>1</span>
            {isHidden && <a href='/'>Pre-Elementary english</a>}
          </li>
          <li
            className={`flex font-medium text-slate-400 p-3 bg-slate-100 rounded-lg ${
              !isHidden ? 'gap-0 justify-center' : 'gap-3'
            }`}>
            <span className='flex justify-center items-center'>2</span>
            {isHidden && <a href='/'>Elementary english</a>}
          </li>
          <li
            className={`flex font-medium text-slate-400 p-3 bg-slate-100 rounded-lg ${
              !isHidden ? 'gap-0 justify-center' : 'gap-3'
            }`}>
            <span className='flex justify-center items-center'>3</span>
            {isHidden && <a href='/'>Pre-Intermediate english I</a>}
          </li>
          <li
            className={`flex font-medium text-slate-400 p-3 bg-slate-100 rounded-lg ${
              !isHidden ? 'gap-0 justify-center' : 'gap-3'
            }`}>
            <span className='flex justify-center items-center'>4</span>
            {isHidden && <a href='/'>Pre-Intermediate english II</a>}
          </li>
          <li
            className={`flex font-medium text-slate-400 p-3 bg-slate-100 rounded-lg ${
              !isHidden ? 'gap-0 justify-center' : 'gap-3'
            }`}>
            <span className='flex justify-center items-center'>5</span>
            {isHidden && <a href='/'>Intermediate english</a>}
          </li>
        </ul>
      </nav>
      <div className={`w-full flex p-5`}>
        <button
          onClick={toggleHidden}
          className='text-white bg-accent2 w-8 h-8 rounded-full hover:bg-accent1'>
          <i className='fa-solid fa-bars' />
        </button>
      </div>
    </div>
  );
}
