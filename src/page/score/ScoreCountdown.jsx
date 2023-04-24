import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Timer from "../../components/Timer";
import Footer from "../../components/Footer";
import api from "../../config";
import { useParams, useNavigate } from "react-router-dom";
// import Warning from "../components/Warning"

export default function ScoreCountdown() {
  const [time, setTime] = useState(0);
  const { examId } = useParams();
  const navigate = useNavigate();
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
  return (
    <div className="w-full h-screen justify-center items-center flex flex-col bg-[#FCF9FF]">
      <Header />
      {/* <div className="flex flex-row justify-end">
        <Warning />
      </div> */}
      <div className="flex flex-row justify-center min-h-max">
        <div className="bg-white p-[50px] w-[546px] h-[310px] flex flex-col justify-center items-center gap-[28px] rounded-[24px] shadow-[0_5px_25px_rgba(0,0,0,0.2)]">
          <div className="shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px]">
            <Timer />
          </div>
          <p className="font-Nunito font-bold text-black text-[35px] w-[471px] text-center">
            Wait until the exam time is over to see your score.
          </p>
        </div>
      </div>
      <Footer time={time} />
    </div>
  );
}
