import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import QuestionEditor from '../../components/dashboard/QuestionEditor';
import classHeader from '../../image/class-header.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from './ProductService';
import AuthContext from '../../contexts/AuthContext';
import api from '../../config/index';
// import TimerSmall from "../../components/TimerSmall";

export default function PageDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [examlist, setExamList] = useState([]);
  const [exam, setExam] = useState({});
  const [dbQuestions, setDbQuestions] = useState([]);
  const [examActive, setExamActive] = useState();
  const [time, setTime] = useState(0);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
    if (Array.isArray(user.role)) {
      for (let i = 0; i < user.role.length; i++) {
        if (user.role[i] === 'admin' || user.role[i] === 'teacher') {
        } else {
          navigate('/');
        }
      }
    }
  }, [user, navigate]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    ProductService.getProductsMini().then((data) => {
      const filteredProducts = data.filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.code.toLowerCase().includes(query)
        );
      });
      setProducts(filteredProducts);
    });
  };

  const fetchTime = async (id) => {
    try {
      const response = await api.get(`time/${id}`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`
        }
      });
      setTime(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartExam = async () => {
    console.log('start exam');
    await api
      .patch(
        `/exam/start/${examActive}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        }
      )
      .then((response) => {
        fetchTime(examActive);
        setToken(response.data.token);
      });
  };
  console.log('time = ' + time);
  console.log('token = ' + exam.token);

  useEffect(() => {
    let intervalId;

    const countDown = () => setTime((prevTime) => prevTime - 1);

    if (time > 0) {
      intervalId = setInterval(countDown, 1000);
    }

    return () => clearInterval(intervalId);
  }, [time]);

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  const hoursStr = hours.toString().length === 1 ? `0${hours}` : hours;
  const minutesStr = minutes.toString().length === 1 ? `0${minutes}` : minutes;
  const secondsStr = seconds.toString().length === 1 ? `0${seconds}` : seconds;

  return (
    <div className='relative flex w-full'>
      <Sidebar
        examlist={examlist}
        setExamList={setExamList}
        setExam={setExam}
        setDbQuestions={setDbQuestions}
        setExamActive={setExamActive}
        examActive={examActive}
        time={time}
        setTime={setTime}
        user={user}
        fetchTime={fetchTime}
        setToken={setToken}
      />
      <div className='container p-4 w-full bg-[#FCF9FF] flex-1'>
        <div className='mb-12'>
          <div className='relative flex flex-row justify-between min-h-[175px] p-4'>
            <img
              src={classHeader}
              alt=''
              className='absolute top-0 left-0 z-0 object-cover w-full h-full rounded-2xl'
            />
            <h1 className='z-10 text-[60px] max-w-xl font-Nunito text-white font-bold leading-tight'>
              {exam.examName}
            </h1>
            <div className='z-10 flex flex-row items-end gap-3'>
              <div className='flex flex-row gap-3  font-Nunito right-4 bottom-4'>
                <button className='px-4 py-2 text-2xl font-bold bg-white text-accent1 rounded-2xl'>
                  <i className='fa-solid fa-bars' />
                </button>
              </div>
              <div className='flex flex-col items-center min-w-[220px] gap-3'>
                <div
                  className={`text-accent2 text-center font-extrabold font-nunito min-w-full text-3xl px-4 py-2 bg-white rounded-2xl ${
                    !(time > 0) && 'hidden'
                  }`}>
                  {hours === 0
                    ? `00:${minutesStr}:${secondsStr}`
                    : `${hoursStr}:${minutesStr}:${secondsStr} `}
                </div>
                {/* <button
                  className={`px-4 py-2 font-bold min-w-full text-accent1 text-3xl bg-white rounded-2xl`}
                  onClick={handleStartExam}
                >
                  {exam.token === undefined || !(time > 0)
                    ? "Click here to start exam"
                    : token}
                </button> */}
                {token === undefined || !(time > 0) ? (
                  <button
                    className='min-w-full px-4 py-2 text-3xl font-bold bg-white text-accent1 rounded-2xl'
                    onClick={handleStartExam}>
                    Click here to start exam
                  </button>
                ) : (
                  <div className='min-w-full px-4 py-2 text-3xl font-bold text-center bg-white text-accent1 rounded-2xl'>
                    {token}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='mb-3 bg-white rounded-lg shadow-md'>
          <div className='relative flex flex-row-reverse flex-wrap items-stretch w-full mb-4'>
            <input
              type='search'
              className='relative m-0 block w-[1px] min-w-0 flex-auto rounded border-none text-base font-normal leading-[1.6] text-black outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:text-neutral-200 dark:placeholder:text-black dark:focus:border-primary'
              placeholder='Search'
              aria-label='Search'
              aria-describedby='button-addon2'
              onChange={handleSearch}
            />
            <span
              className='input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-black dark:text-neutral-200'
              id='basic-addon2'>
              <i className='text-black fa-solid fa-magnifying-glass' />
            </span>
          </div>
        </div>
        <div>
          <DataTable value={products} className='shadow-md'>
            <Column field='noreg' header='Nomor registrasi'></Column>
            <Column field='name' header='Name'></Column>
            <Column field='grade' header='Grade'></Column>
            <Column field='totalScore' header='Total Score'></Column>
            <Column field='vocab' header='Vocab'></Column>
            <Column field='reading' header='Reading'></Column>
            <Column field='listening' header='Listening'></Column>
            <Column field='status' header='Status'></Column>
            <Column field='reset' header='Reset'></Column>
          </DataTable>
        </div>
      </div>
      <QuestionEditor dbQuestions={dbQuestions} />
    </div>
  );
}
