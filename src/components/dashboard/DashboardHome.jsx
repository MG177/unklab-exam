import React, { useEffect, useRef, useState } from 'react';
import mask_bg from '../../image/mask_bg.svg';
import illustration1 from '../../image/illustration1.svg';
import { Card, NewCard } from './Card';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { ScrollPanel } from 'primereact/scrollpanel';

import api from '../../config';

export default function DashboardHome() {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const examLabelRef = useRef(null);
  const [questionSelected, setQuestionSelected] = useState([]);
  const [questionDB, setQuestionDB] = useState([]);

  const fetchQuestionGroup = async () => {
    const response = await api.get('/questions');
    const filteredData = response.data.filter((item) => item.isVerified);
    setQuestionDB(filteredData);
  };

  useEffect(() => {
    fetchQuestionGroup();
  }, []);

  const handleOpenModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  if (modalRef.current) {
    modalRef.current.addEventListener('click', (e) => {
      const dialogDimensions = modalRef.current.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        modalRef.current.close();
      }
    });
  }

  const handleRemoveQuestion = (item, index) => {
    setQuestionDB((prev) => {
      const newQuestionGroup = [...prev, item];
      newQuestionGroup.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
      return newQuestionGroup;
    });
    setQuestionSelected((prev) => {
      const newQuestionGroup = [...prev];
      newQuestionGroup.splice(index, 1);
      return newQuestionGroup;
    });
  };

  const handleAddQuestion = (item, index) => {
    setQuestionDB((prev) => {
      const newQuestionGroup = [...prev];
      newQuestionGroup.splice(index, 1);
      return newQuestionGroup;
    });
    setQuestionSelected((prev) => {
      const newQuestionGroup = [...prev];
      newQuestionGroup.push(item);
      return newQuestionGroup;
    });
  };

  const handleQuestionQuantity = (index, quantity) => {
    setQuestionSelected((prev) => {
      const newQuestionGroup = [...prev];
      newQuestionGroup[index].quantity = parseInt(quantity, 10); // or parseFloat(quantity) for decimal values
      return newQuestionGroup;
    });
  };

  const totalQuestion = () => {
    let total = 0;
    questionSelected.forEach((item) => {
      total += item.quantity;
    });
    return total;
  };

  const handleCreateExam = async () => {
    const examLabel = examLabelRef.current.value;
    if (examLabel === '') {
      alert('Exam Label cannot be empty');
      return;
    }
    const data = {
      examName: examLabel,
      questionGroup: questionSelected,
    };
    console.log(data);
    const response = await api.post('/exam/' + examLabel, questionSelected);
    // if (response.status === 200) {
    // navigate(`/dashboard/exam/${response.data._id}`);
    // }
  };

  // console.log(questionSelected);

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
              <dialog
                ref={modalRef}
                className="rounded-xl shadow-lg bg-whitePlus max-w-md max-h-[90%]"
              >
                <div className="flex flex-col items-start px-3 w-fit font-Nunito text-black gap-2 max-w-full min-w-[20rem]">
                  <div className="font-bold text-xl self-center">
                    Create new Exam
                  </div>
                  <div className="text-md self-start font-bold">Exam name</div>
                  <input
                    type="text"
                    ref={examLabelRef}
                    className="bg-whitePlus shadow-md border-0 rounded-lg w-full"
                    placeholder="exam name..."
                  />
                  <div className="text-md self-start font-bold">
                    Select Question Group
                  </div>
                  <ul className="shadow-md rounded-xl flex flex-col items-center justify-between h-fit w-full text-black font-semibold">
                    <ScrollPanel style={{ width: '100%', height: '100px' }}>
                      {questionDB.map((item, index) => (
                        <button
                          key={item._id}
                          className="flex flex-row items-center justify-between px-3 py-1 w-full cursor-pointer hover:bg-slate-50 hover:text-accent1"
                          onClick={() => handleAddQuestion(item, index)}
                        >
                          <p className="text-md text-left font-Nunito select-none truncate">
                            {item.questionName}
                          </p>
                          <i
                            className="pi pi-plus mr-2 font-bold"
                            style={{ fontSize: '0.8rem' }}
                          />
                        </button>
                      ))}
                    </ScrollPanel>
                  </ul>
                  <div className="text-md self-start font-bold">
                    Determine how many questions to use
                  </div>
                  <ul className="shadow-md rounded-xl flex flex-col items-center justify-between h-fit w-full text-black font-semibold">
                    <ScrollPanel style={{ width: '100%', height: '100px' }}>
                      {questionSelected.map((item, index) => (
                        <li
                          key={item._id}
                          className="flex flex-row items-center justify-between px-3 py-1 w-full hover:bg-slate-50 "
                        >
                          <p className="text-md text-left font-Nunito select-none truncate">
                            {item.questionName}
                          </p>
                          <div className="flex flex-row">
                            <InputText
                              keyfilter={'int'}
                              maxLength="3"
                              // placeholder={item.questions.length}
                              placeholder="00"
                              className="bg-white border-[0px] w-10 p-0 focus:border-gray focus:shadow-md focus:ring-0 flex text-center"
                              // onChange={(e) => {
                              //   console.log(e.target.value);
                              // }}
                              onChange={(e) =>
                                handleQuestionQuantity(index, e.target.value)
                              }
                            />
                            <button
                              className="pi pi-times text-black mx-2.5"
                              style={{ fontSize: '0.8rem' }}
                              onClick={() => handleRemoveQuestion(item, index)}
                            />
                          </div>
                        </li>
                      ))}
                    </ScrollPanel>
                  </ul>
                  <div className="flex flex-row text-md self-end font-bold items-center">
                    <span>Total Questions:</span>
                    <div className="ml-2 px-2 py-1 flex items-center justify-center bg-white rounded-lg shadow-md">
                      {totalQuestion() || '0'}
                    </div>
                  </div>
                  <div className="flex w-full justify-center gap-4 mt-1">
                    <button
                      className="py-2 w-full bg-white rounded-lg text-black font-semibold shadow-md text-lg select-none"
                      onClick={() => modalRef.current.close()}
                    >
                      Cancel
                    </button>
                    <button
                      className="py-2 w-full bg-accent1 rounded-lg text-white font-semibold shadow-md text-lg select-none"
                      onClick={handleCreateExam}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </dialog>
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
