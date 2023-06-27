import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { ScrollPanel } from 'primereact/scrollpanel';
import api from '../../config';
import { useNavigate } from 'react-router-dom';
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

export function ExamModalCreator({ modalRef }) {
  const navigate = useNavigate();
  const examLabelRef = useRef(null);
  const [questionSelected, setQuestionSelected] = useState([]);
  const [questionDB, setQuestionDB] = useState([]);
  const toast = useRef(null);

  const fetchQuestionGroup = async () => {
    try {
      const response = await api.get('/questions');
      console.log(response.data);
      const filteredData = response.data.filter((item) => item.isVerified);

      const newData = filteredData.filter((item) => {
        return !questionSelected.some((element) => element._id === item._id);
      });

      setQuestionDB(newData);
    } catch (err) {
      console.log(err);
      // toast.current.show({
      //   severity: 'error',
      //   summary: 'Error',
      //   detail: 'Cannot fetch question group',
      //   life: 3000,
      // });
    }
  };

  useEffect(() => {
    fetchQuestionGroup();
  }, []);

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
      newQuestionGroup[index].quantity = parseInt(quantity, 10); // or parseFloat(quantity) for decimal values
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
          // sticky: true,
        });
        return;
      }
      //   console.log(data);
      const response = await api.post('/exam/' + examLabel, questionSelected);
      navigate('/dashboard/exam/' + response.data._id);
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: 'error',
        summary: 'Error when creating exam',
        detail: err.response.data.message,
        life: 5000,
        // sticky: true,
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
          // marginTop: '4rem',
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

export function ExamModalEditor({ modalRef, examId, examName }) {
  const navigate = useNavigate();
  const examLabelRef = useRef(null);
  const [questionSelected, setQuestionSelected] = useState([]);
  const [questionDB, setQuestionDB] = useState([]);
  const toast = useRef(null);

  const fetchQuestionGroup = async () => {
    try {
      const questionResponse = await api.get('/questions');
      const questionFromExamResponse = await api.get('/exam/' + examId);

      const questionData = questionResponse.data;
      const questionFromExamData = questionFromExamResponse.data;

      // console.log('questionData', questionData);
      // console.log('questionFromExamData', questionFromExamData);

      const filteredData = questionData.filter((item) => item.isVerified);

      const newData = filteredData.filter((item) => {
        const examQuestions = questionFromExamData.questions;
        return !examQuestions.some((element) => element.id === item._id);
      });

      const newDataSelected = filteredData.filter((item) => {
        const examQuestions = questionFromExamData.questions;
        return examQuestions.some((element) => element.id === item._id);
      });

      newDataSelected.forEach((item) => {
        const examQuestions = questionFromExamData.questions;
        const question = examQuestions.find(
          (element) => element.id === item._id
        );
        item.quantity = question.quantity;
      });

      console.log('newData', newData);
      console.log('newDataSelected', newDataSelected);

      // console.log('examQuestions', questionFromExamData.questions);
      // console.log('newData', newData);

      // setQuestionSelected(questionFromExamData.questions);
      setQuestionSelected(newDataSelected);
      setQuestionDB(newData);
    } catch (error) {
      console.log(error);
      // toast.current.show({
      //   severity: 'error',
      //   summary: 'Error',
      //   detail: 'Cannot fetch question group',
      //   life: 3000,
      // });
    }
  };

  useEffect(() => {
    fetchQuestionGroup();
  }, [modalRef]);

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
      newQuestionGroup[index].quantity = parseInt(quantity, 10); // or parseFloat(quantity) for decimal values
      return newQuestionGroup;
    });
  };

  const handleEditExam = async () => {
    try {
      const examLabel = examLabelRef.current.value;
      if (examLabel === '') {
        toast.current.show({
          severity: 'error',
          summary: 'Error when editing exam',
          detail: 'Exam name cannot be empty',
          life: 5000,
          // sticky: true,
        });
        return;
      }
      const data = {
        examName: examLabel,
        questions: questionSelected,
      };
      const response = await api.patch('/exam/' + examId, data);
      fetchQuestionGroup();
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Exam edited successfully',
        life: 3000,
        // sticky: true,
      });
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: 'error',
        summary: 'Error when editing exam',
        detail: err.response.data.message,
        life: 5000,
        // sticky: true,
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
          marginTop: '4rem',
          borderRadius: '1rem',
          boxShadow: '0 0 #0000',
          paddingInline: '5px',
        }}
        pt={{
          icon: '1rem',
        }}
      />
      <div className="flex flex-col items-start px-3 w-fit font-Nunito text-black gap-2 max-w-full min-w-[20rem]">
        <div className="font-bold text-xl self-center">Edit Exam</div>
        <div className="text-md self-start font-bold">Exam name</div>
        <input
          type="text"
          defaultValue={examName}
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
                    placeholder={item.quantity || 0}
                    className="bg-white border-[0px] w-10 p-0 focus:border-gray focus:shadow-md focus:ring-0 flex text-center"
                    // onChange={(e) => {
                    //   console.log(e.target.value);
                    // }}
                    value={item.quantity || ''}
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
            onClick={handleEditExam}
          >
            Add
          </button>
        </div>
      </div>
    </dialog>
  );
}
