'use client';

import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { ScrollPanel } from 'primereact/scrollpanel';
import api from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';

const totalQuestion = (data) => {
  let total = 0;
  data.forEach((item) => {
    if (typeof item.quantity === 'number' && !isNaN(item.quantity)) {
      total += item.quantity;
    }
  });
  return total;
};

const compressQuestion = (data) => {
  const question = [];
  data.forEach((item) => {
    if (typeof item.quantity === 'number' && !isNaN(item.quantity)) {
      question.push({
        _id: item._id,
        questionName: item.questionName,
        quantity: item.quantity,
        questionLength: item.questions.length,
      });
    }
  });
  return question;
};

export function ExamModalCreator({ modalRef }) {
  const router = useRouter();
  const examLabelRef = useRef(null);
  const [questionSelected, setQuestionSelected] = useState([]);
  const [questionDB, setQuestionDB] = useState([]);
  const toast = useRef(null);

  const fetchQuestionGroup = async () => {
    try {
      const response = await api.get('/questions');
      const filteredData = response.data.filter((item) => item.isVerified);

      const newData = filteredData.filter((item) => {
        return !questionSelected.some((element) => element._id === item._id);
      });

      setQuestionDB(newData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchQuestionGroup();
  }, []);

  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;

    const handleClick = (e) => {
      const dialogDimensions = dialog.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        dialog.close();
      }
    };

    dialog.addEventListener('click', handleClick);
    return () => dialog.removeEventListener('click', handleClick);
  }, [modalRef]);

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

  const handleQuestionQuantity = (index, quantity) => {
    setQuestionSelected((prev) => {
      const newQuestionGroup = [...prev];
      newQuestionGroup[index].quantity = parseInt(quantity, 10);
      return newQuestionGroup;
    });
  };

  const handleCreateExam = async () => {
    try {
      const examLabel = examLabelRef.current.value;
      if (examLabel === '') {
        toast.current.show({
          severity: 'error',
          summary: 'Error when creating exam',
          detail: 'Exam name cannot be empty',
          life: 5000,
        });
        return;
      }
      const response = await api.post(
        '/exam/' + examLabel,
        compressQuestion(questionSelected)
      );
      router.push('/dashboard/exams/' + response.data._id);
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: 'error',
        summary: 'Error when creating exam',
        detail: err.response?.data?.message,
        life: 5000,
      });
    }
  };

  return (
    <dialog
      ref={modalRef}
      className="rounded-xl shadow-lg bg-whitePlus max-w-md max-h-[90%]"
    >
      <Toast
        ref={toast}
        style={{
          borderRadius: '1rem',
          boxShadow: '0 0 #0000',
          paddingInline: '5px',
        }}
        pt={{
          icon: '1rem',
        }}
      />
      <div className="flex flex-col items-start px-3 w-fit font-Nunito text-black gap-2 max-w-full min-w-[20rem]">
        <div className="font-bold text-xl self-center">Create new Exam</div>
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
                    placeholder="00"
                    className="bg-white border-[0px] w-10 p-0 focus:border-gray focus:shadow-md focus:ring-0 flex text-center"
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
            {totalQuestion(questionSelected) || '0'}
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
  );
}
