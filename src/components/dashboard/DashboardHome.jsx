import React, { useRef, useState } from 'react';
import mask_bg from '../../image/mask_bg.svg';
import illustration1 from '../../image/illustration1.svg';
import { Card, NewCard } from './Card';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { SplitButton } from 'primereact/splitbutton';

export default function DashboardHome() {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [questionList, setQuestionList] = useState([]);

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

  const items = [
    {
      label: 'Update',
      icon: 'pi pi-refresh',
      command: () => {
        // toast.current.show({
        //   severity: 'success',
        //   summary: 'Updated',
        //   detail: 'Data Updated',
        // });
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-times',
      command: () => {
        // toast.current.show({
        //   severity: 'warn',
        //   summary: 'Delete',
        //   detail: 'Data Deleted',
        // });
      },
    },
  ];
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
                className="rounded-xl shadow-lg bg-whitePlus max-w-md"
              >
                <div className="flex flex-col items-start p-3 w-fit font-Nunito text-black gap-2 max-w-full">
                  <div className="font-bold text-xl self-center ">
                    Create new Exam
                  </div>
                  <div className="text-md self-start font-bold">Exam Label</div>
                  <input
                    type="text"
                    className="bg-white border-2 border-gray rounded-lg w-full"
                    placeholder="exam name..."
                  />
                  <div className="text-md self-start font-bold">
                    Select Question Group
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="shadow-md rounded-xl flex flex-row items-center justify-between px-3 py-2 gap-1 min-w-fit w-full">
                      <p className="text-md font-medium text-black truncate max-w-xxs">
                        Choose question group to
                      </p>
                      <InputText
                        keyfilter={'int'}
                        maxLength="3"
                        placeholder="0"
                        className="bg-white border-2 border-gray rounded-xl w-12 p-1 focus:border-black focus:shadow-md focus:ring-0 flex text-center"
                      />
                    </div>
                    <button className="pi pi-times text-black mx-2.5" />
                  </div>
                  <div className="shadow-md rounded-xl flex flex-row items-center justify-between w-full text-accent1 font-semibold">
                    <button className="flex flex-row items-center gap-2.5 w-full h-12 px-3 hover:bg-blue-50 hover:bg hover:rounded-l-xl active:bg-blue-100 transition ease-in">
                      <i className="pi pi-plus" />
                      <p className="text-md text-left font-Nunito select-none truncate max-w-xxs">
                        Choose question group to
                      </p>
                    </button>
                    <button className="flex items-center justify-center w-10 h-12 px-2 hover:bg-blue-50 hover:bg hover:rounded-r-xl active:bg-blue-100 transition ease-in ">
                      <i className="pi pi-chevron-down" />
                    </button>
                  </div>
                  <div className="flex w-full justify-center gap-4 mt-5">
                    <button
                      className="py-2 w-full bg-white rounded-lg text-black font-semibold shadow-md text-lg select-none"
                      // onClick={() => modal.close()}
                    >
                      Cancel
                    </button>
                    <button
                      className="py-2 w-full bg-accent1 rounded-lg text-white font-semibold shadow-md text-lg select-none"
                      // onClick={handlePositiveOption}
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
