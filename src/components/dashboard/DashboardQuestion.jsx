import React, { useState, useEffect } from 'react';
import mask_bg from '../../image/mask_bg.svg';
import illustration1 from '../../image/illustration1.svg';
import { Card, NewCard } from './Card';
import { useNavigate } from 'react-router-dom';
import api from '../../config';

export default function DashboardQuestion() {
  const navigate = useNavigate();
  const [questionList, setQuestionList] = useState([]);
  const [isCreateNew, setIsCreateNew] = useState(false);

  const fetchQuestionList = async () => {
    const response = await api.get('/questions');
    setQuestionList(response.data);
  };

  const handleCreateNew = () => {
    setIsCreateNew(true);
  };

  const handleNewQuestion = async (data) => {
    try {
      const response = await api.post('/questions', { questionName: data });
      if (response.status >= 200 && response.status < 300) {
        alert('Question Created');
        setIsCreateNew(false);
        fetchQuestionList();
      }
    } catch (error) {
      alert('Faield to create question. Please try again');
    }
  };

  useEffect(() => {
    fetchQuestionList();
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
              <button
                className="px-4 py-2 font-semibold text-black bg-white shadow-md w-fit rounded-xl"
                onClick={() => handleCreateNew()}
              >
                + Create New Question
              </button>
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
                navigate(`/dashboard/question/${question._id}`)
              }
              title={question.questionName}
              date={question.createdAt}
            />
          ))}
          {/* <NewCard /> */}
        </div>
      )}
    </div>
  );
}
