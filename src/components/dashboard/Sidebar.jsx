import React, { useState, useContext } from "react";
import { useEffect } from "react";
import api from "../../config";
import AuthContext from "../../contexts/AuthContext";

export default function Sidebar({
  examlist,
  setExamList,
  setExam,
  setDbQuestions,
  setExamActive,
  examActive,
  fetchTime,
  setToken,
  setDataGrid,
}) {
  const { user } = useContext(AuthContext);
  const [isHidden, setIsHidden] = useState(false);

  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/exam`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        fetchTime(response.data[0]._id);
        setExamList(response.data);
        setExamActive(response.data[0]._id);
        setToken(response.data[0].token);
        handleSidebarButton(response.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const getDbQuestions = async (id) => {
    try {
      await api
        .get(`/questions/exam/${id}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((response) => {
          setDbQuestions(response.data);
          setExamActive(id);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getDataGrid = async (id) => {
    try {
      await api
        .get(`/students/exam/score/${id}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((response) => {
          setDataGrid(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSidebarButton = (exam) => {
    fetchTime(exam._id);
    setExam(exam);
    setToken(exam.token);
    getDataGrid(exam._id);
    getDbQuestions(exam._id);
  };

  const handleLogout = () => {
    //clear local storage
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="z-20 flex flex-col h-screen bg-whitePlus min-w-fit shadow-right">
      <div className="flex items-center justify-center h-16 p-3">
        {isHidden ? (
          <h1 className="font-bold text-3xl font-Nunito text-[29px] text-accent1">
            Unklab <span className="text-black">Exams</span>
          </h1>
        ) : (
          <h1 className="font-bold text-3xl font-Nunito text-center text-[29px] text-accent1">
            U<span className="text-black">E</span>
          </h1>
        )}
        {isHidden && (
          <button
            onClick={handleLogout}
            className="w-8 h-8 text-white items-center rounded-full bg-accent2 ml-5"
          >
            <i className="pi pi-sign-out " style={{ fontSize: "1rem" }} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4">
        <ul className={`space-y-2 font-Nunito text-gray bg-white`}>
          {examlist.map((exam, index) => (
            <button
              key={exam._id}
              onClick={() => {
                handleSidebarButton(exam);
              }}
              className={`cursor-pointer flex flex-row items-center font-bold w-full shadow-right rounded-lg p-3 ${
                !isHidden ? "gap-0 justify-center" : "gap-4 px-4 justify-start"
              } ${examActive === exam._id && `bg-accent2 text-white`}`}
            >
              <p>{index + 1}</p>
              <p>{isHidden && exam.examName}</p>
            </button>
          ))}
        </ul>
      </nav>
      <div className="flex justify-end w-full p-5">
        <button
          onClick={toggleHidden}
          className="w-8 h-8 text-white rounded-full bg-accent2"
        >
          <i
            className={isHidden ? "pi pi-chevron-left" : "pi pi-chevron-right"}
          />
        </button>
      </div>
    </div>
  );
}
