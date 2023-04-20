import React, { useState } from "react";
import { useEffect } from "react";
import api from "../../config";

export default function Sidebar() {
  const [isHidden, setIsHidden] = useState(false);

  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };
  const [exams, setExams] = useState([]);

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

  return (
    <div className="z-20 flex flex-col h-screen bg-white min-w-fit shadow-right">
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
        <ul className="space-y-2 font-Nunito">
          {exams.map((exam, index) => (
            <li
              key={exam._id}
              className={`flex font-bold p-3 bg-accent2 text-white rounded-lg ${
                !isHidden ? "gap-0 justify-center" : "gap-3"
              }`}
            >
              {!isHidden && <a href="/">{index + 1}</a>}
              <span className="flex items-center justify-center">
                {isHidden && exam.examName}
              </span>
            </li>
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
