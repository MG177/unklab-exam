import { element } from 'prop-types';
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../config';
import AuthContext from '../../contexts/AuthContext';
import QuestionContext from '../../contexts/QuestionContext';

export default function Sidebar({
  setToken,
  setExam,
  examList,
  setExamList,
  setLoading,
}) {
  const { user } = useContext(AuthContext);
  // const { saveStatus } = useContext(QuestionContext);
  const { examId } = useParams();
  const { session } = useParams();
  const navigate = useNavigate();
  const uploadRef = useRef(null);
  const [isHidden, setIsHidden] = useState(false);
  // const [session, setSession] = useState(null);
  const [sessionArray, setSessionArray] = useState([]);
  // const newSessionRef = useRef('');
  const [newSession, setNewSession] = useState('');
  const [isNewSessionSelected, setIsNewSessionSelected] = useState(false);
  const [selectedSession, setSelectedSession] = useState('');

  // const handleSessionChange = (a) => {
  //   fetchDataBySession(a);
  //   setSelectedSession(a);
  //   setLoading(true);
  //   navigate(`/dashboard/${a}/0`);
  // };

  const toggleHidden = useCallback(() => {
    setIsHidden((prevHidden) => !prevHidden);
  }, []);

  const fetchDataBySession = useCallback(
    async (hoo) => {
      try {
        const res = await api.get(`/exam/session/${hoo}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        // console.log('exam list', res.data);
        setExamList(res.data);
        navigate(`/dashboard/${hoo}/0`);
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
      // console.log('exam list', res.data);

      // Sort the array by createdAt
      const sortedArray = res.data.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      const array = sortedArray.reduce((acc, exam) => {
        if (!acc.includes(exam.session)) {
          acc.push(exam.session);
        }
        return acc;
      }, []);

      fetchDataBySession(array[array.length - 1]);
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

  const handleAddExam = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const response = await api.post(`/exam/${newSession}`, formData, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      if (response.status === 201) {
        fetchData();
        fetchDataBySession(newSession);
        setSelectedSession(newSession);
        e.target.value = null;
        newClassDialog.close();
        alert('Exam uploaded successfully');
      } else {
        throw new Error('Something went wrong, please try again later');
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

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

  const handleNewClassDialog = () => {
    setNewSession(session);
    newClassDialog.showModal();
  };

  const consoleLog = (a, b) => {
    console.log(a, b);
  };

  return (
    <div className="relative z-20 flex flex-col h-screen overflow-x-auto bg-whitePlus max-w-fit shadow-right">
      <div
        className={`flex items-center ${
          !isHidden ? 'justify-center' : 'justify-between'
        } p-3 h-16`}
      >
        {isHidden ? (
          <h1 className="mr-4 text-2xl font-bold font-Nunito text-accent1">
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
        <ul className={`space-y-2 font-Nunito`}>
          {/* {examList.map((exam, index) => (
            <button
              type="button"
              key={exam._id}
              onClick={() => {
                navigate(`/dashboard/${session}/${exam._id}`);
                setExam(exam);
              }}
              className={`cursor-pointer flex flex-row items-center font-bold w-full shadow-right rounded-lg p-2 ${
                !isHidden ? 'gap-0 justify-center' : 'gap-4 px-4 justify-start'
              } ${examId === exam._id && `bg-accent2 text-white`}`}
            >
              <p>{index + 1}</p>
              <p>{isHidden && splitExamName(exam.examName)}</p>
            </button>
          ))} */}
          <Link
            className="flex items-center justify-center p-2 text-white rounded-xl w-11 h-fit bg-accent2"
            to="/dashboard/home"
          >
            <i className="pi pi-home" style={{ fontSize: '1.5rem' }} />
          </Link>
          <Link
            className="flex items-center justify-center p-2 text-white rounded-xl w-11 h-fit bg-accent2"
            to="/dashboard/question"
          >
            <i
              className="pi pi-file-edit"
              style={{ fontSize: '1.5rem', marginLeft: '3px' }}
            />
          </Link>
        </ul>
      </nav>
      <div className="sticky bottom-0 right-0 flex justify-end w-full p-4">
        <div className="flex flex-row items-center justify-end w-full">
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
      </div>
    </div>
  );
}
