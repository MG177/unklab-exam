import React, { useContext, useEffect, useState } from 'react';
import QuestionEditorItem from './QuestionEditorItem';
import QuestionContext from '../../contexts/QuestionContext';
import api from '../../config';
import AuthContext from '../../contexts/AuthContext';
import { useParams } from 'react-router-dom';

export default function QuestionEditor({ examList, getExamQuestions }) {
  const { handleSave, questions, setQuestions, setSaveStatus, saveStatus } =
    useContext(QuestionContext);

  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const { examId } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (questions.length !== 0) {
      setLoading(false);
    }
  }, [questions]);

  useEffect(() => {
    setSaveButtonDisabled(saveStatus);
  }, [saveStatus]);

  const handleAddQuestion = () => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      let newId = newData.length + 1;
      // eslint-disable-next-line no-loop-func
      while (newData.some((question) => question.id === newId)) {
        newId++;
      }
      newData.push({
        id: newId,
        options: [
          {
            id: 1,
            text: '',
          },
        ],
        answer: 1,
        audio: null,
        image: null,
        type: 'grammar',
      });
      return newData;
    });
    setSaveStatus(false);
  };

  console.log('saveStatus QuestionEditor', saveStatus);

  if (loading) {
    return <div>Loading...</div>;
  }

  const chooseSession = document.getElementById('chooseSession');
  if (chooseSession) {
    chooseSession.addEventListener('click', (e) => {
      const dialogDimensions = chooseSession.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        chooseSession.close();
      }
    });
  }

  const duplicateQuestion = async (id) => {
    try {
      const res = await api.patch(
        `/questions/duplicate/${id}/${examId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      if (res.data === true) {
        getExamQuestions();
        chooseSession.close();
        alert('Import question successfully');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative z-20 flex flex-col h-screen overflow-x-hidden overflow-y-scroll bg-white font-Nunito min-w-fit shadow-right scroll-smooth">
      <dialog id="chooseSession" className="rounded-2xl bg-white">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className=" whitespace-nowrap font-Nunito mr-10 font-semibold">
              Import session question
            </h1>
            <button
              className="flex items-center"
              onClick={() => chooseSession.close()}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          {examList.map((exam) => {
            if (exam._id != examId) {
              return (
                <button
                  className="shadow-md  bg-white font-Nunito font-semibold rounded-xl text-accent2 text-left px-3 py-2"
                  key={exam.id}
                  onClick={() => duplicateQuestion(exam._id)}
                >
                  {exam.examName}
                </button>
              );
            }
          })}
        </div>
      </dialog>
      <div className="flex flex-col items-center justify-start p-3 2xl:w-[480px] w-[400px] w-fit ">
        <div className="flex items-center justify-between w-full p-2 mb-3 text-2xl font-bold text-center text-white bg-accent1 rounded-2xl">
          <button
            onClick={() => chooseSession.showModal()}
            className="px-3 py-2 bg-white rounded-2xl text-accent2 h-full flex items-center justify-center"
          >
            <i
              className="pi pi-file-import mr-1"
              style={{ fontSize: '1.3rem' }}
            />
          </button>
          <span className="flex-1"> QUESTION EDITOR </span>
          <span className="px-3 py-2 bg-white rounded-2xl text-accent2">{`${questions.length}`}</span>
        </div>
        {questions.map((question, index) => (
          <QuestionEditorItem
            key={index}
            question={question}
            currentQuestion={index}
          />
        ))}
      </div>
      <div className="sticky bottom-0 flex gap-3 p-3 bg-opacity-25 rounded bg-whitePlus backdrop-blur-sm backdrop-filter">
        <button
          className="flex items-center justify-center w-full font-medium text-white rounded-full min-w-fit bg-accent1 text-3 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSave}
          disabled={saveButtonDisabled}
        >
          Save
        </button>
        <button
          className="w-12 py-3 font-medium text-white rounded-full bg-accent1 text-3"
          onClick={handleAddQuestion}
        >
          <i className="fa-solid fa-plus" />
        </button>
      </div>
    </div>
  );
}
