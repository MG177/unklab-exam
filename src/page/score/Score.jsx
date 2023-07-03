import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
// import ProgressBar from '../score/progress_bar.svg';
import Footer, { FooterCountdown } from '../../components/Footer';
import api from '../../config';
import AuthContext from '../../contexts/AuthContext';
import Answer from './Answer';
import { Sidebar } from 'primereact/sidebar';
import { ScrollPanel } from 'primereact/scrollpanel';

function convertName(fullName) {
  // check if fullName is a non-empty string and contains a comma
  if (
    typeof fullName !== 'string' ||
    fullName.trim().length === 0 ||
    !fullName.includes(',')
  ) {
    const nameParts = fullName.split(' ');
    // if fullName is a single word, return it
    if (nameParts.length === 1) {
      return fullName;
    }
    // if fullName is morethan one word, return the first and the last word
    return nameParts[0] + ' ' + nameParts[nameParts.length - 1];
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

export default function Score() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
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
      setScore(extractScore(response.data.score));
      setQeustionList(response.data.questionList);
    } catch (error) {
      if (error.response.status === 403) {
        navigate('/');
      }
      console.log(error);
    }
  };

  const extractScore = (objArray) => {
    let count = {
      total: 0,
      correct: 0,
      score: 0,
    };

    for (let i = 0; i < objArray.length; i++) {
      const obj = objArray[i];
      const keys = Object.keys(obj);

      for (let j = 0; j < keys.length; j++) {
        const field = keys[j];
        const fieldValue = obj[field];

        count.total += fieldValue.total || 0;
        count.correct += fieldValue.correct || 0;
      }
    }
    count.score = (count.correct / count.total) * 100;

    return count;
  };

  useEffect(() => {
    fetchTime();
    if (time > 0) {
      return;
    } else {
      fetchScore();
    }
  }, []);

  return (
    <div className="w-screen h-full justify-center items-center flex flex-col bg-[#FCF9FF] select-none">
      <Header />
      {time > 0 ? (
        <div className="bg-white p-[50px] max-w-[100vh] flex flex-col justify-center items-center gap-[28px] rounded-[24px] shadow-[0_5px_25px_rgba(0,0,0,0.2)]">
          <p className="font-Nunito font-bold text-black text-[35px] w-full text-center">
            Your score will be visible after the exam duration ends, or you can
            choose to log out at this time.
          </p>
        </div>
      ) : (
        <ScrollPanel style={{ width: '100%', height: '100vh' }}>
          <div className="flex flex-col w-full justify-center items-center min-h-screen">
            <div className="relative flex flex-col justify-center items-center bg-accent1/70 rounded-3xl p-4 shadow-lg md:scale-125">
              <div className="flex flex-row justify-center items-center bg-white rounded-3xl py-4 px-6 gap-4 w-[400px] h-[200px]">
                <div className="flex flex-col border-[14px] min-h-[170px] min-w-[170px] border-accent2 rounded-full shadow-lg justify-center items-center">
                  <p className="text-3xl indent-tight font-bold text-black font-Nunito z-10">
                    {`${score.score || 'Error'}/100`}
                  </p>
                </div>
                <div className="flex flex-col justify-center h-full font-Nunito gap-3 max-w-[13rem]">
                  <div className="w-fit bg-white shadow-lg rounded-3xl h-fit w-full py-2 px-4 min-h-[2.5rem] border border-gray/20">
                    <p className="text-lg font-bold font-Nunito text-black text-center leading-tight">
                      {convertName(user.studentName) ||
                        'Mangerongkoda Jason Timothy'}
                      {/* {convertName('Jason Timothy asfdsadgsdfg Mangerongkoda')} */}
                    </p>
                  </div>
                  <div className="text-black w-fit bg-white shadow-lg rounded-3xl w-full h-fit py-3 px-4 border border-gray/20 leading-none">
                    <p className="text-3xl font-bold leading-none">
                      {`${score.correct || 'Error'}/${score.total || 'Error'}`}
                    </p>
                    <span className="text-lg whitespace-nowrap leading-none">
                      Right answers
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
