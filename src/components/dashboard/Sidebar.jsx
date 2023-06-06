import { element } from 'prop-types';
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config';
import AuthContext from '../../contexts/AuthContext';
import QuestionContext from '../../contexts/QuestionContext';

const getYearRangesAndDataArrays = () => {
  const currentYear = new Date().getFullYear();
  const yearRangesArray = [];
  const yearDataArray = [];
  for (let i = currentYear - 3; i <= currentYear + 1; i++) {
    const firstYear = i;
    const secondYear = i + 1;
    const yearRange = `${firstYear}/${secondYear}`;
    const yearData = `${firstYear}_${secondYear}`;
    yearRangesArray.push(yearRange);
    yearDataArray.push(yearData);
  }
  return { yearRangesArray, yearDataArray };
};

export default function Sidebar({ setToken, setExam, examList, setExamList }) {
  const { yearRangesArray, yearDataArray } = useMemo(
    getYearRangesAndDataArrays,
    []
  );

  const { user } = useContext(AuthContext);
  const { saveStatus } = useContext(QuestionContext);
  const { examId } = useParams();
  const navigate = useNavigate();
  const uploadRef = useRef(null);
  const [isHidden, setIsHidden] = useState(false);
  const [session, setSession] = useState(null);
  const [sessionArray, setSessionArray] = useState([]);
  const newSessionRef = useRef('');

  const toggleHidden = useCallback(() => {
    setIsHidden((prevHidden) => !prevHidden);
  }, []);

  const fetchDataBySession = useCallback(
    async (hoo) => {
      setSession(hoo);
      try {
        const res = await api.get(`/exam/session/${hoo}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        console.log('exam list', res.data);
        setExamList(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    [setExamList, user.access_token]
  );

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get(`/exam`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      console.log('exam list', res.data);
      const array = res.data.reduce((acc, exam) => {
        if (!acc.includes(exam.session)) {
          acc.push(exam.session);
        }
        return acc;
      }, []);
      if (session === null) {
        fetchDataBySession(array[0]);
      }
      setSessionArray(array);
    } catch (error) {
      console.log(error);
    }
  }, [fetchDataBySession, setSessionArray, user.access_token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    window.location.href = '/';
  }, []);

  const handleAddExam = useCallback(
    async (e) => {
      let newSession;
      if (session === 'newLumenDevPassCode') {
        newSession = newSessionRef.current;
      } else {
        newSession = session;
      }
      try {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        const response = await api.post(`/exam/${newSession}`, formData, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        console.log(newSession);
        fetchData();
        setSession(newSession);
        fetchDataBySession(newSession);
        newClassDialog.close();
      } catch (error) {
        console.log(error);
      }
    },
    [fetchData, fetchDataBySession, session, user.access_token]
  );

  const splitExamName = useCallback((examName) => {
    const split1 = examName.split('/');
    const split2 = examName.split(' - ');
    return split1[0] + ' - ' + split2[1];
  }, []);

  const newClassDialog = document.getElementById('newClassDialog');
  if (newClassDialog) {
    newClassDialog.addEventListener('click', (e) => {
      const dialogDimensions = newClassDialog.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        newClassDialog.close();
      }
    });
  }

  return (
    <div className="relative z-20 flex flex-col h-screen overflow-x-auto bg-whitePlus min-w-fit shadow-right">
      <div className="flex items-center justify-between h-16 py-3 px-5">
        {isHidden ? (
          <h1 className="text-2xl font-bold font-Nunito mr-4 text-accent1">
            Unklab <span className="text-black">Exams</span>
          </h1>
        ) : (
          <h1 className="text-2xl font-bold text-center font-Nunito text-accent1">
            U<span className="text-black">E</span>
          </h1>
        )}
        {isHidden && (
          <button
            onClick={handleLogout}
            className="items-center w-8 h-8 text-white scale-90 rounded-full bg-accent2"
          >
            <i className="pl-1 pi pi-sign-out" style={{ fontSize: '1rem' }} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4">
        <ul className={`space-y-2 font-Nunito text-gray bg-white`}>
          {examList.map((exam, index) => (
            <button
              type="button"
              key={exam._id}
              onClick={() => {
                if (
                  !saveStatus &&
                  !window.confirm('Changes you made may not be saved.')
                )
                  return;
                navigate(`/dashboard/${exam._id}`);
                setExam(exam);
              }}
              className={`cursor-pointer flex flex-row items-center font-bold w-full shadow-right rounded-lg p-2 ${
                !isHidden ? 'gap-0 justify-center' : 'gap-4 px-4 justify-start'
              } ${examId === exam._id && `bg-accent2 text-white`}`}
            >
              <p>{index + 1}</p>
              <p>{isHidden && splitExamName(exam.examName)}</p>
            </button>
          ))}
          <label
            className={`cursor-pointer flex flex-row justify-center bg-accent2 items-center font-bold w-full shadow-right rounded-lg py-1.5 ${
              !isHidden ? 'gap-0 justify-center' : 'gap-4 px-4 justify-start'
            }`}
          >
            <p className="text-lg text-whitePlus">+</p>
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
      <div className="sticky bottom-0 right-0 flex justify-end w-full p-4">
        <div className="flex flex-row w-full items-center justify-between gap-2">
          {isHidden && (
            <div>
              <select
                className="rounded-full py-1"
                id="session"
                onChange={(e) => fetchDataBySession(e.target.value)}
              >
                {sessionArray.map((session, index) => (
                  <option key={index} value={session}>
                    {session}
                  </option>
                ))}
              </select>
              <button
                className="border-[1px] ml-2 border-black rounded-full w-8 h-8"
                onClick={() => newClassDialog.showModal()}
              >
                <i className="pi pi-plus" />
              </button>
            </div>
          )}
          <button
            onClick={toggleHidden}
            className="w-8 h-8 text-white rounded-full bg-accent2"
          >
            <i
              className={
                isHidden ? 'pi pi-chevron-left' : 'pi pi-chevron-right'
              }
            />
          </button>
        </div>
        <dialog id="newClassDialog" className="rounded-2xl bg-white">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center w-full">
              <h1 className=" whitespace-nowrap font-Nunito mr-10 font-semibold">
                Add new class
              </h1>
              <button
                className="flex items-center"
                onClick={() => newClassDialog.close()}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="font-Nunito">
              Which session do you want to assign classes to?
            </div>
            <select
              className="rounded-full py-1 w-full"
              id="session"
              onChange={(e) => setSession(e.target.value)}
            >
              {sessionArray.map((sessions, index) => (
                <option
                  key={index}
                  value={sessions}
                  selected={sessions === session}
                >
                  {sessions}
                </option>
              ))}
              <option value="newLumenDevPassCode" className="text-gray">
                New session...
              </option>
            </select>
            {session === 'newLumenDevPassCode' && (
              <input
                type="text"
                placeholder="Enter new session"
                className="rounded-full py-1 w-full"
                onChange={(e) => (newSessionRef.current = e.target.value)}
              />
            )}
            <label
              className={`cursor-pointer flex flex-row justify-center bg-accent2 items-center font-bold w-full shadow-right rounded-lg py-1.5`}
            >
              <p className="text-base text-whitePlus">Select class .csv file</p>
              <input
                type="file"
                accept=".csv"
                ref={uploadRef}
                onChange={handleAddExam}
                className="hidden"
              />
            </label>
          </div>
        </dialog>
      </div>
    </div>
  );
}
