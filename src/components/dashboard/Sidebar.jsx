import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config';
import AuthContext from '../../contexts/AuthContext';
import QuestionContext from '../../contexts/QuestionContext';

export default function Sidebar({ setToken, setExam }) {
  const { user } = useContext(AuthContext);
  const { saveStatus } = useContext(QuestionContext);
  const { examId } = useParams();
  const navigate = useNavigate();
  const uploadRef = useRef(null);
  const [isHidden, setIsHidden] = useState(false);
  const [examList, setExamList] = useState([]);

  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };

  const fetchData = async () => {
    try {
      await api
        .get(`/exam`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((res) => {
          console.log('exam list', res.data);
          setExamList(res.data);
          // uploadRef.current.value = '';
        });
    } catch (error) {
      console.log(error);
      // console.log(user.access_token);
      // window.location.reload();
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setToken, user.access_token]);

  const handleLogout = () => {
    //clear local storage
    localStorage.clear();
    window.location.href = '/';
  };

  const handleAddExam = async (e) => {
    console.log('add exam');
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      console.log('user access token', user.access_token);
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
    const split1 = examName.split('/');
    const split2 = examName.split(' - ');
    return split1[0] + ' - ' + split2[1];
  };

  return (
    <div className="relative z-20 flex flex-col h-screen overflow-x-auto bg-whitePlus min-w-fit shadow-right">
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
            className="items-center w-8 h-8 ml-5 text-white rounded-full bg-accent2"
          >
            <i className="pi pi-sign-out " style={{ fontSize: '1rem' }} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4">
        <ul className={`space-y-2 font-Nunito text-gray bg-white`}>
          {examList.map((exam, index) => (
            <button
              // href={`/dashboard/${exam._id}`}
              type="button"
              key={exam._id}
              onClick={() => {
                if (!saveStatus) {
                  // eslint-disable-next-line no-restricted-globals
                  if (!confirm('Changes you made may not be saved.')) return;
                }
                navigate(`/dashboard/${exam._id}`);
                setExam(exam);
              }}
              className={`cursor-pointer flex flex-row items-center font-bold w-full shadow-right rounded-lg p-3 ${
                !isHidden ? 'gap-0 justify-center' : 'gap-4 px-4 justify-start'
              } ${examId === exam._id && `bg-accent2 text-white`}`}
            >
              <p>{index + 1}</p>
              <p>{isHidden && splitExamName(exam.examName)}</p>
            </button>
          ))}
          <label
            className={`cursor-pointer flex flex-row justify-center bg-accent2 items-center font-bold w-full shadow-right rounded-lg p-3 ${
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
      <div className="sticky bottom-0 right-0 flex justify-end w-full p-5">
        <button
          onClick={toggleHidden}
          className="w-8 h-8 text-white rounded-full bg-accent2"
        >
          <i
            className={isHidden ? 'pi pi-chevron-left' : 'pi pi-chevron-right'}
          />
        </button>
      </div>
    </div>
  );
}
