import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
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
  console.log(user.access_token);

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
        console.log(user.access_token);
        window.location.reload();
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
        .then((res) => {
          console.log("exam list", res.data);
          setExamList(res.data);
          setToken(res.data[0].token);
          uploadRef.current.value = "";
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [setToken, user.access_token]);

  // const handleSidebarButton = (exam) => {
  //   fetchTime(exam._id);
  //   setExam(exam);
  //   setToken(exam.token);
  // getDataGrid(exam._id);
  // getDbQuestions(exam._id);
  // };

  const handleLogout = () => {
    //clear local storage
    localStorage.clear();
    window.location.href = "/";
  };

  const handleAddExam = async (e) => {
    console.log("add exam");
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      console.log("user access token", user.access_token);
      const response = await api.post(`/exam`, formData, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      fetchData();

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const splitExamName = (examName) => {
    const split1 = examName.split(" ");
    const split2 = examName.split(" - ");
    return split1[0] + " - " + split2[1];
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
              } ${examId === exam._id && `bg-accent2 text-white`}`}
            >
              <p>{index + 1}</p>
              <p>{isHidden && splitExamName(exam.examName)}</p>
            </Link>
          ))}
          <label
            className={`cursor-pointer flex flex-row justify-center bg-accent2 items-center font-bold w-full shadow-right rounded-lg p-3 ${
              !isHidden ? "gap-0 justify-center" : "gap-4 px-4 justify-start"
            }`}
          >
            <p className="text-whitePlus text-lg">+</p>
            <input
              type="file"
              accept=".csv"
              ref={uploadRef}
              onChange={handleAddExam}
              className="hidden"
            />
          </label>
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
