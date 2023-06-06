import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import ProgressBar from '../score/progress_bar.svg';
import Footer from '../../components/Footer';
import api from '../../config';
import Answer from '../score/Answer';
import AuthContext from '../../contexts/AuthContext';
import Timer from '../../components/Timer';

export default function Score() {
  const { user } = useContext(AuthContext);
  const [time, setTime] = useState(0);
  const { examId } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState({
    totalScore: 0,
    totalCorrect: 0,
    totalQuestion: 0,
    grade: 'null',
  });
  console.log(score);
  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await api.get(
          `time/${JSON.parse(localStorage.getItem('examId'))}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem('access_token')
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
      const response = await api.get('/students/score/' + user.noreg, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      if (!response.data) {
        localStorage.clear();
        navigate('/started');
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
      typeof fullName !== 'string' ||
      fullName.trim().length === 0 ||
      !fullName.includes(',')
    ) {
      return fullName;
    }

    // split the full name into last name and given names
    const nameParts = fullName.split(', ');
    let lastName = nameParts[0];
    let givenNames = nameParts[1];

    // if the left side of the comma is empty, get the last two words of the given names
    if (!lastName) {
      const nameWords = givenNames.split(' ');
      if (nameWords.length === 1) {
        return nameWords[0];
      } else if (nameWords.length >= 2) {
        givenNames = nameWords.slice(-2).join(' ');
      } else {
        return '';
      }
      return givenNames;
    }

    // get the first two words of the given names
    const givenNameWords = givenNames.split(' ');
    if (givenNameWords.length === 1) {
      return fullName;
    } else if (givenNameWords.length >= 2) {
      givenNames = givenNameWords.slice(0, 2).join(' ');
    } else {
      return lastName;
    }

    // combine the modified last name and given names
    return lastName + ', ' + givenNames;
  }

  if (time > 0) {
    return (
      <div
        style={{ userSelect: 'none' }}
        onCopy={(event) => {
          event.preventDefault();
        }}
        className="w-full h-screen justify-center items-center flex flex-col bg-[#FCF9FF]"
      >
        <Header />
        <div className="bg-white p-[50px] max-[960px]:p-[20px] max-[960px]:max-w-[80vh] max-w-[100vh] flex flex-col justify-center items-center gap-[28px] rounded-[24px] shadow-[0_5px_25px_rgba(0,0,0,0.2)]">
          <div className="shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px]">
            <Timer />
          </div>
          <p className="font-Nunito font-bold text-black text-[35px] max-[960px]:text-[26px] w-full text-center min-[720px]:">
            Your score will be visible after the exam duration ends, or you can
            choose to log out at this time.
          </p>
        </div>
        <Footer time={time} />
      </div>
    );
  } else {
    return (
      <div
        style={{ userSelect: 'none' }}
        onCopy={(event) => {
          event.preventDefault();
        }}
        className="relative flex flex-col items-center w-full min-h-screen bg-[#FCF9FF]"
      >
        <Header />
        <p className="mt-[183px] max-[960px]:text-4xl max-[960px]:mt-[120px] text-black text-6xl font-Nunito font-bold">
          YOUR SCORE
        </p>
        <div className="mb-[30vh] flex flex-col justify-center items-center max-[960px]:-mt-[30px]">
          <div className="bg-taccent1 w-max h-max mt-16 rounded-[37px] flex justify-center items-center p-[22px] shadow-[0_5.95px_29.74px_rgba(0,0,0,0.1)]">
            <div className="bg-white w-max h-max max-[960px]:py-[0px] px-[40px] gap-7 py-[27px] rounded-[24px] flex flex-row justify-center items-center shadow-[0_5.95px_29.74px_rgba(0,0,0,0.58)] ">
              <main>
                <div className="flex flex-col justify-center mt-10 items-center drop-shadow-[2px_3px_7px_rgba(0,0,0,0.15)]">
                  <img src={ProgressBar} alt="" />
                  <div className="-mt-[180px] flex flex-col items-center justify-center mb-[120px]">
                    <p className="text-6xl max-[960px]:text-3xl font-bold text-black font-Nunito max-[960px]:mt-[83px]">
                      {`${score.totalScore}/100`}
                    </p>
                  </div>
                </div>
              </main>

              <div className="flex flex-col gap-6">
                <div className="flex flex-row font-Nunito gap-[10px] ">
                  <div className="text-black w-fit bg-white shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px] h-fit max-[960px]:py-[8px] max-[960px]:px-20 py-4 px-5 max-[960px]:w-[40px]">
                    <p className="text-5xl max-[960px]:text-xl font-bold max-[960px]:-ml-[53px]">
                      {`${score.totalCorrect}/${score.totalQuestion}`}
                    </p>
                    <span className="text-2xl max-[960px]:text-lg whitespace-nowrap max-[960px]:-ml-[53px]">
                      Right answers
                    </span>
                  </div>
                  <div className="text-white bg-accent1 shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px] max-[960px]:py-2 max-[960px]:px-5 py-4 px-7 w-full">
                    <p className="text-5xl max-[960px]:text-lg font-bold text-left">
                      {score.grade}
                    </p>
                    <p className="text-2xl max-[960px]:text-lg font-bold">
                      Grade
                    </p>
                  </div>
                </div>
                <div className="bg-white shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-3xl max-w-[350px] h-fit flex items-center justify-center max-[960px]:px-[8px] max-[960px]:py-[4px] px-[16px] py-[30px] leading-[35px]">
                  <p className="text-[35px] max-[960px]:text-[20px] font-bold font-[Nunito] text-black text-center">
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
        <Footer />
      </div>
    );
  }
}
