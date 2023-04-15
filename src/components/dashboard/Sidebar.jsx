import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

export default function Sidebar() {
  const [isHidden, setIsHidden] = useState(true);

  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };
  const [exams, setExams] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/exam',{
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5kb2UiLCJzdWIiOiIxMjMiLCJyb2xlIjpbImFkbWluIl0sImlhdCI6MTY4MTU5MTYxMCwiZXhwIjoxNjgxNjc4MDEwfQ.pQn9JHFNo60bOQQboL_V2Jo5frprWUznA8KXtItryBM'
      }
    })
      .then(response => {
        setExams(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  
  return (
    <div className='flex flex-col h-screen min-w-fit bg-white shadow-right z-20'>
      <div className='flex items-center justify-start p-3 h-16'>
        {isHidden ? (
          <h1 className='font-bold text-3xl font-Nunito text-[29px] text-accent1'>
            Unklab <span className='text-black'>Exams</span>
          </h1>
        ) : (
          <h1 className='font-bold text-3xl font-Nunito text-[29px] text-accent1'>
            U<span className='text-black'>E</span>
          </h1>
        )}
      </div>
      <nav className='flex-1 px-4'>
        <ul className='space-y-2 font-Nunito'>
        {exams.map(exam => (
          <li
            key={exam.id}
            className={`flex font-bold p-3 bg-accent2 text-white rounded-lg ${
              !isHidden ? 'gap-0 justify-center' : 'gap-3'
            }`}
          >
            <span className='flex justify-center items-center'>{exam.examName}</span>
            {isHidden && <a href='/'>{exam.examName}</a>}
          </li>
        ))}
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
