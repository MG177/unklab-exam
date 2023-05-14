import React, { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Timer from '../../components/Timer';
import Footer from '../../components/Footer';
import api from '../../config';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
// import Warning from "../components/Warning"

export default function ScoreCountdown() {
  const { user } = useContext(AuthContext);
  const [time, setTime] = useState(0);
  const { examId } = useParams();
  const navigate = useNavigate();
  // useEffect(() => {
  //   const fetchScore = async () => {
  //     try {
  //       const response = await api.get('/students/score/' + user.noreg, {
  //         headers: {
  //           Authorization: `Bearer ${user.access_token}`,
  //         },
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchScore();
  // }, [examId, navigate]);
  return (
    <div
      style={{ userSelect: 'none' }}
      onCopy={(event) => {
        event.preventDefault();
      }}
      className="w-full h-screen justify-center items-center flex flex-col bg-[#FCF9FF]"
    >
      <Header />
      <div className="bg-white p-[50px] max-w-[100vh] flex flex-col justify-center items-center gap-[28px] rounded-[24px] shadow-[0_5px_25px_rgba(0,0,0,0.2)]">
        <div className="shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px]">
          <Timer />
        </div>
        <p className="font-Nunito font-bold text-black text-[35px] w-full text-center">
          Your score will be visible after the exam duration ends, or you can
          choose to log out at this time.
        </p>
      </div>
      <Footer time={time} />
    </div>
  );
}
