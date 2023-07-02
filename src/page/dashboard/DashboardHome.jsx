import React, { useEffect, useRef, useState } from 'react';
import mask_bg from '../../image/mask_bg.svg';
import illustration1 from '../../image/illustration1.svg';
import { Card, NewCard } from '../../components/dashboard/Card';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { ScrollPanel } from 'primereact/scrollpanel';

import api from '../../config';
import { ExamModalCreator } from '../../components/dashboard/ExamModal';

export default function DashboardHome() {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [exam, setExam] = useState([]);

  const fetchExamList = async () => {
    const response = await api.get('/exam');
    setExam(response.data);
  };

  useEffect(() => {
    fetchExamList();
  }, []);

  const handleOpenModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

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
              <button
                className="px-4 py-2 font-semibold text-black bg-white shadow-md w-fit rounded-xl"
                onClick={() => handleOpenModal()}
              >
                + Create New Exam
              </button>
              <ExamModalCreator modalRef={modalRef} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid w-5/6 grid-cols-3 gap-4 text-base">
        {exam.map((item, index) => (
          <Card
            key={item._id}
            onClickFunction={() => navigate(`/dashboard/exams/${item._id}`)}
            title={item.examName}
            date={item.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
