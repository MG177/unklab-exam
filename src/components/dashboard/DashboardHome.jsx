import React from 'react';
import mask_bg from '../../image/mask_bg.svg';
import illustration1 from '../../image/illustration1.svg';
import { Card, NewCard } from './Card';
import { useNavigate } from 'react-router-dom';

export default function DashboardHome() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center w-full h-full gap-8 py-10">
      <div
        id="header"
        className="flex flex-col items-center justify-center w-5/6 "
      >
        <div className="relative w-full overflow-hidden h-[200px] rounded-3xl shadow-lg">
          <div
            className="absolute inset-0 w-full h-full bg-left-bottom bg-no-repeat bg-cover"
            style={{ backgroundImage: `url(${mask_bg})` }}
          ></div>
          <img
            src={illustration1}
            alt="illustration1"
            className="absolute z-10 h-full scale-110 right-3"
          />
          <div className="relative z-10 w-3/5 h-full p-5 font-Nunito">
            <div className="flex flex-col justify-between h-full">
              <h1 className="text-5xl font-bold text-white">
                Click Button below to create new exam
              </h1>
              <button className="px-4 py-2 font-semibold text-black bg-white shadow-md w-fit rounded-xl">
                + Create New Exam
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid w-5/6 grid-cols-3 gap-4 text-base">
        <NewCard />
        <Card onClickFunction={() => navigate('/dashboard/question')} />
        <Card />
        <Card />
      </div>
    </div>
  );
}
