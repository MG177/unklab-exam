import React, { useState } from "react";
import { useEffect } from "react";
import api from "../../config";

export default function Sidebar({ exams, setExams, setDbQuestions }) {
  const [isHidden, setIsHidden] = useState(false);
  const [examActive, setExamActive] = useState();

  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };

  useEffect(() => {
    api
      .get(`/exam`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("access_token")
          )}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setExams(response.data);
      });
  }, []);

  const getDbQuestions = async (id) => {
    try {
      await api
        .get(`/questions/exam/${id}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("access_token")
            )}`,
          },
        })
        .then((response) => {
          console.log("/exam/id = " + response.data);
          setDbQuestions(response.data);
          setExamActive(id);
        });
    } catch (error) {
      console.log(error);
    }
  };
  console.log(examActive);
  const isExamActive = (id) => {
    if (examActive === id) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="z-20 flex flex-col h-screen bg-whitePlus min-w-fit shadow-right">
      <div className="flex items-center justify-start h-16 p-3">
        {isHidden ? (
          <h1 className="font-bold text-3xl font-Nunito text-[29px] text-accent1">
            Unklab <span className="text-black">Exams</span>
          </h1>
        ) : (
          <h1 className="font-bold text-3xl font-Nunito text-[29px] text-accent1">
            U<span className="text-black">E</span>
          </h1>
        )}
      </div>
      <nav className="flex-1 px-4">
        <ul
          className={`space-y-2 font-Nunito ${
            examActive === "exam._id" ? "text-black" : "text-white"
          }`}
        >
          {exams.map((exam, index) => (
            <button
              key={exam._id}
              className={`cursor-pointer flex font-bold w-full p-3 shadow-right rounded-lg ${
                !isHidden ? "gap-0 justify-center" : "gap-3"
              } ${
                examActive === exam._id
                  ? "bg-white text-black"
                  : "bg-accent2 text-white"
              }}`}
              onClick={() => {
                getDbQuestions(exam._id);
              }}
            >
              <a>{index + 1}</a>
              <span className="flex items-center justify-center">
                {isHidden && exam.examName}
              </span>
            </button>
          ))}
        </ul>
      </nav>
      <div className={`w-full flex p-5`}>
        <button
          onClick={toggleHidden}
          className="w-8 h-8 text-white rounded-full bg-accent2 hover:bg-accent1"
        >
          <i className="fa-solid fa-bars" />
        </button>
      </div>
    </div>
  );
}
