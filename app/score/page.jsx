'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { FooterCountdown } from '@/components/Footer';
import api from '@/lib/api/client';
import AuthContext from '@/contexts/AuthContext';
import Answer from '@/components/score/Answer';
import ScoreCard from '@/components/score/ScoreCard';
import { Sidebar } from 'primereact/sidebar';
import { ScrollPanel } from 'primereact/scrollpanel';

export default function ScorePage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [time, setTime] = useState();
  const [score, setScore] = useState([]);
  const [questionList, setQeustionList] = useState([]);
  const [visibleBottom, setVisibleBottom] = useState(false);

  const fetchTime = async () => {
    try {
      const response = await api.get(`exam/time/${user.examId}`);
      setTime(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchScore = async () => {
    try {
      const response = await api.get('/student/score');
      setScore(response.data.score);
      setQeustionList(response.data.questionList);
    } catch (error) {
      if (error.response?.status === 403) {
        router.push('/');
      }
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user?.examId) return;
    fetchTime();
    if (time > 0) {
      return;
    } else {
      fetchScore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.examId]);

  useEffect(() => {
    if (time === 0 || (time !== undefined && time <= 0)) {
      fetchScore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return (
    <div className="w-screen h-screen justify-center items-center flex flex-col bg-[#FCF9FF] select-none">
      <Header />
      {time > 0 ? (
        <div className="bg-white h-fit py-8 px-10 max-w-xl flex flex-col justify-center items-center rounded-3xl shadow-xl">
          <p className="font-Nunito font-bold text-black text-4xl w-full text-center">
            Your score will be visible after the exam duration ends, or you can
            choose to log out at this time.
          </p>
        </div>
      ) : (
        <ScrollPanel style={{ width: '100%', height: '100vh' }}>
          <div className="flex flex-col w-full justify-center items-center min-h-screen">
            <ScoreCard user={user} score={score} />
            <Sidebar
              visible={visibleBottom}
              position="right"
              onHide={() => setVisibleBottom(false)}
              className="w-fit h-screen rounded-l-3xl bg-white shadow-lg"
            >
              <ScrollPanel style={{ width: '100%', height: '100%' }}>
                <div className="max-w-lg flex flex-col gap-8">
                  {questionList.map((question, index) => (
                    <Answer
                      key={question.id}
                      question={question}
                      index={index}
                    />
                  ))}
                </div>
              </ScrollPanel>
            </Sidebar>
          </div>
        </ScrollPanel>
      )}
      <FooterCountdown
        setTime={setTime}
        time={time}
        setVisibleBottom={setVisibleBottom}
      />
    </div>
  );
}
