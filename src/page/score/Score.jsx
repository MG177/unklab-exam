import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import ProgressBar from "../score/progress_bar.svg";
import Footer from "../../components/Footer";
import api from "../../config";
import Answer from "../score/Answer";
import AuthContext from "../../contexts/AuthContext";

export default function Score() {
  const { user } = useContext(AuthContext);
  const [time, setTime] = useState(0);
  const { examId } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState([]);
  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await api.get(
          `time/${JSON.parse(localStorage.getItem("examId"))}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("access_token")
              )}`,
            },
          }
        );
        setTime(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTime();
  }, [examId, navigate]);

  useEffect(() => {
    fetchScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchScore = async () => {
    try {
      const response = await api.get("/students/score/" + user.noreg, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      if (!response.data) {
        localStorage.clear();
        navigate("/started");
      } else {
        setScore(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function convertName(fullName) {
    // check if fullName is a non-empty string and contains a comma
    if (
      typeof fullName !== "string" ||
      fullName.trim().length === 0 ||
      !fullName.includes(",")
    ) {
      return fullName;
    }

    // split the full name into last name and given names
    const nameParts = fullName.split(", ");
    let lastName = nameParts[0];
    let givenNames = nameParts[1];

    // if the left side of the comma is empty, get the last two words of the given names
    if (!lastName) {
      const nameWords = givenNames.split(" ");
      if (nameWords.length === 1) {
        return nameWords[0];
      } else if (nameWords.length >= 2) {
        givenNames = nameWords.slice(-2).join(" ");
      } else {
        return "";
      }
      return givenNames;
    }

    // get the first two words of the given names
    const givenNameWords = givenNames.split(" ");
    if (givenNameWords.length === 1) {
      return fullName;
    } else if (givenNameWords.length >= 2) {
      givenNames = givenNameWords.slice(0, 2).join(" ");
    } else {
      return lastName;
    }

    // combine the modified last name and given names
    return lastName + ", " + givenNames;
  }

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen bg-[#FCF9FF]">
      <Header />
      <p className="mt-[183px] text-black text-6xl font-Nunito font-bold">
        YOUR SCORE
      </p>
      <div className="mb-[30vh] flex flex-col justify-center items-center">
        <div className="bg-taccent1 w-max h-max mt-16 rounded-[37px] flex justify-center items-center p-[22px] shadow-[0_5.95px_29.74px_rgba(0,0,0,0.1)]">
          <div className="bg-white w-max h-max px-[40px] gap-7 py-[27px] rounded-[24px] flex flex-row justify-center items-center shadow-[0_5.95px_29.74px_rgba(0,0,0,0.58)]">
            <div className="relative flex flex-col justify-center items-center drop-shadow-[2px_3px_7px_rgba(0,0,0,0.15)]">
              <img src={ProgressBar} alt="" />
              <div className="absolute flex flex-col items-center justify-center">
                <p className="text-6xl font-bold text-black font-Nunito">
                  {`${score.totalScore}/100`}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-row font-Nunito gap-[10px] ">
                <div className="text-black w-full bg-white shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px] h-[111px] py-4 pl-4">
                  <p className="text-5xl font-bold">
                    {`${score.totalCorrect}/${score.totalQuestion}`}
                  </p>
                  <p className="text-2xl">Right answers</p>
                </div>
                <div className="text-white bg-accent1 shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px] py-4 px-7">
                  <p className="text-5xl text-left font-bold">{score.grade}</p>
                  <p className="text-2xl font-bold">Grade</p>
                </div>
              </div>
              <div className="bg-white shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-3xl w-[350px] h-[111px] flex items-center justify-center px-[16px] py-[30px] leading-[35px]">
                <p className="text-[35px] font-bold font-[Nunito] text-black text-center">
                  {convertName(user.username)}
                </p>
              </div>
            </div>
          </div>
        </div>
        {score.questions &&
          score.questions.map((question) => {
            return <Answer key={question.index} question={question} />;
          })}
      </div>
      <Footer time={time} />
    </div>
  );
}
