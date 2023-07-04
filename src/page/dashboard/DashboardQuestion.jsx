import React, { useState, useEffect, useRef } from 'react';
import mask_bg from '../../image/mask_bg.svg';
import illustration1 from '../../image/illustration1.svg';
import { Card, NewCard, EditCard } from '../../components/dashboard/Card';
import { useNavigate } from 'react-router-dom';
import api from '../../config';

export default function DashboardQuestion() {
  const navigate = useNavigate();
  const [questionList, setQuestionList] = useState([]);
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [isEdit, setIsEdit] = useState(true);

  const fetchQuestionList = async () => {
    const response = await api.get('/questions');
    setQuestionList(response.data);
  };

  const handleCreateNew = () => {
    setIsCreateNew(true);
  };

  const handleEdit = () => {
    setIsEdit((prev) => !prev);
  };

  const handleNewQuestion = async (data) => {
    try {
      const response = await api.post('/questions', { questionName: data });
      alert('Question Created');
      setIsCreateNew(false);
      fetchQuestionList();
    } catch (error) {
      alert('Failed to create question. Please try again');
    }
  };

  const handleEditName = async (id, data) => {
    try {
      await api.patch('/questions/name/' + id, { questionName: data });
      alert('Question Edited');
      setIsEdit(false);
      fetchQuestionList();
    } catch (error) {
      console.log(error);
      alert('Failed to edit question. Please try again', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/questions/${id}`);
      alert('Question Deleted');
      fetchQuestionList();
    } catch (error) {
      console.log(error);
      alert('Failed to delete question. Please try again', error);
    }
  };

  useEffect(() => {
    fetchQuestionList();
    setIsEdit(false);
    setIsCreateNew(false);
  }, []);

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
                Click Button below to create new question group
              </h1>
              <div className="flex items-center">
                {isEdit ? (
                  <>
                    <button
                      className={`px-4 py-2 font-semibold bg-white  shadow-md w-fit rounded-xl flex items-center gap-2 text-accent2 `}
                      onClick={() => handleEdit()}
                    >
                      <i className="pi pi-times" />
                      Exit edit mode
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="px-4 py-2 font-semibold text-black bg-white shadow-md w-fit rounded-xl disabled:brightness-90"
                      onClick={() => handleCreateNew()}
                      disabled={isEdit}
                      title="You can't create new question in editing mode"
                    >
                      + Create New Question
                    </button>
                    <button
                      className={`px-4 py-2 font-semibold ml-3 bg-white text-black shadow-md w-fit rounded-xl `}
                      onClick={() => handleEdit()}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {questionList.length === 0 && isCreateNew === false ? (
        <div className="flex flex-col items-center justify-center w-full h-full gap-8 py-10 font-Nunito text-xl font-bold text-gray">
          No Question Found
        </div>
      ) : (
        <div className="grid w-5/6 grid-cols-3 gap-4 text-base">
          {isEdit ? (
            questionList.map((question) => (
              <EditCard
                key={question._id}
                id={question._id}
                title={question.questionName}
                date={question.createdAt}
                handleEditName={handleEditName}
                handleDelete={handleDelete}
              />
            ))
          ) : (
            <>
              {isCreateNew && (
                <NewCard
                  setIsCreateNew={setIsCreateNew}
                  handleNew={handleNewQuestion}
                />
              )}
              {questionList.map((question) => (
                <Card
                  key={question._id}
                  onClickFunction={() =>
                    navigate(`/dashboard/questions/${question._id}`)
                  }
                  title={question.questionName}
                  date={question.createdAt}
                  isVerified={question.isVerified}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
