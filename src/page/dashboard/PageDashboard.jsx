import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import QuestionEditor from '../../components/dashboard/QuestionEditor';
import classHeader from '../../image/class-header.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import AuthContext from '../../contexts/AuthContext';
import QuestionContext from '../../contexts/QuestionContext';
import api from '../../config/index';
import Media from '../../components/Media';
// import TimerSmall from "../../components/TimerSmall";

export default function PageDashboard() {
  const { examId } = useParams();
  const { user } = useContext(AuthContext);
  const { questions, setQuestions } = useContext(QuestionContext);
  const navigate = useNavigate();
  const [exam, setExam] = useState({});
  const [examActive, setExamActive] = useState('-');
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(0);
  const [token, setToken] = useState('');
  const [examList, setExamList] = useState([]);
  const loadingDataGrid = [
    {
      noreg: 'Loading...',
      status: 'Loading...',
      name: 'Loading...',
      score: {
        reading: {
          total: 'Loading...',
          correct: 'Loading...',
          score: 'Loading...',
          string: 'Loading...',
        },
        vocabulary: {
          total: 'Loading...',
          correct: 'Loading...',
          score: 'Loading...',
          string: 'Loading...',
        },
        listening: {
          total: 'Loading...',
          correct: 'Loading...',
          score: 'Loading...',
          string: 'Loading...',
        },
        grammar: {
          total: 'Loading...',
          correct: 'Loading...',
          score: 'Loading...',
          string: 'Loading...',
        },
        totalQuestion: 'Loading...',
        totalCorrect: 'Loading...',
        totalScore: 'Loading...',
        grade: 'Loading...',
      },
    },
  ];
  const [dataGrid, setDataGrid] = useState(loadingDataGrid);
  const dt = useRef(null);

  const getExamQuestion = async () => {
    try {
      await api
        .get(`/questions/exam/${examId}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((response) => {
          setQuestions(response.data);
          console.log('response.data = ', response.data);
          setLoading(false);
          console.log('loading from Exam = ', loading);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (examId != 0) {
      getExamQuestion();
    }
  }, [examId, loading, setQuestions, user.access_token]);

  const fetchDataGrid = async () => {
    setDataGrid(loadingDataGrid);
    if (examId != 0) {
      try {
        const response = await api.get(`/students/exam/score/${examId}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        setDataGrid(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    // try {
    //   api
    //     .get(`/students/exam/score/${examId}`, {
    //       headers: {
    //         Authorization: `Bearer ${user.access_token}`,
    //       },
    //     })
    //     .then((response) => {
    //       setDataGrid(response.data);
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
    fetchDataGrid();
  }, [user.access_token, examId, loading]);

  const recalculateScore = async () => {
    setDataGrid(loadingDataGrid);

    try {
      await api.post(
        `/students/exam/score/${examId}/recalculate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      fetchDataGrid();
    } catch (error) {
      console.log(error);
    }
  };

  document.body.style.overflow = 'hidden';

  const cols = [
    { field: 'noreg', header: 'Nomor registrasi' },
    { field: 'name', header: 'Name' },
    { field: 'score.grade', header: 'Grade' },
    { field: 'credit', header: 'Total Score' },
    { field: 'score.totalScore', header: 'Vocab' },
    { field: 'score.vocabulary.score', header: 'Reading' },
    { field: 'score.reading.score', header: 'Schedule' },
    { field: 'score.listening.score', header: 'Listening' },
    { field: 'score.grammar.score', header: 'grammar' },
    { field: 'status', header: 'status' },
  ];

  const formattedData = dataGrid.map((item) => {
    const formattedItem = {
      name: item.name,
      noreg: item.noreg,
      status: item.status,
    };

    if (item.score) {
      formattedItem.grade = item.score.grade || '';
      formattedItem.totalScore = item.score.totalScore || '';
      formattedItem.vocabulary = item.score.vocabulary?.string || '';
      formattedItem.reading = item.score.reading?.string || '';
      formattedItem.listening = item.score.listening?.string || '';
      formattedItem.grammar = item.score.grammar?.string || '';
    }

    return formattedItem;
  });

  if (!exam.examName) {
    if (examId != 0) {
      try {
        api
          .get(`/exam/name/${examId}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
            },
          })
          .then((response) => {
            setExam(response.data);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(formattedData);

      // Set the column order
      worksheet['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 30 }];

      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      saveAsExcelFile(excelBuffer, `Exam_export_${exam.examName}`);
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + '_' + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

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

  useEffect(() => {
    const fetchTimeRemaining = async () => {
      try {
        const response = await api.get(`time/${examId}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        setTime(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchToken = async () => {
      try {
        const response = await api.get(`/exam/token/${examId}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        setToken(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (examId) {
      fetchTimeRemaining();
      fetchToken();
    }

    const timeIntervalId = setInterval(() => {
      fetchTimeRemaining();
    }, 30000);

    const tokenIntervalId = setInterval(() => {
      fetchToken();
    }, 3600000); // 1 hour interval

    return () => {
      clearInterval(timeIntervalId);
      clearInterval(tokenIntervalId);
    };
  }, [user.access_token, examId, token]);

  const handleStartExam = async () => {
    console.log('start exam');
    await api
      .patch(
        `/exam/start/${examId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      )
      .then((response) => {
        setToken(response.data.token);
      });
  };

  const handleStopExam = async () => {
    console.log('start exam');
    await api
      .patch(
        `/exam/start/${examId}?minute=0`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      )
      .then((response) => {
        setToken(response.data.token);
      });
  };

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

  const footer = (
    <div className="flex justify-end gap-2 align-items-center">
      {/* <Button
        type="button"
        icon="pi pi-file"
        rounded
        text
        raised
        onClick={() => exportCSV(false)}
        data-pr-tooltip="CSV"
      /> */}
      <Button
        type="button"
        icon="pi pi-file-excel"
        severity="success"
        rounded
        text
        label="Export to Excel"
        onClick={exportExcel}
        data-pr-tooltip="XLS"
      />
    </div>
  );

  const refresh = (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        icon="pi pi-refresh"
        rounded
        text
        raised
        severity="danger"
        onClick={recalculateScore}
      />
      <Button
        type="button"
        icon="pi pi-refresh"
        severity="success"
        rounded
        text
        raised
        label="refresh"
        onClick={fetchDataGrid}
      />
    </div>
  );

  const handleImport = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', event.target.file.files[0]);
    formData.append('examId', examActive);
    api
      .post('/students', formData, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="relative flex justify-center w-screen">
      <Sidebar
        setToken={setToken}
        setExam={setExam}
        examList={examList}
        setExamList={setExamList}
        setLoading={setLoading}
      />

      {!loading ? (
        <>
          <div className="container p-4 w-full bg-[#FCF9FF] flex-1">
            <div className="mb-4">
              <div className="relative flex flex-row justify-between min-h-[175px] p-4">
                <img
                  src={classHeader}
                  alt=""
                  className="absolute top-0 left-0 z-0 object-cover w-full h-full rounded-2xl"
                />
                <div className="z-10 flex flex-row justify-between w-full ">
                  <h1 className="text-4xl font-bold leading-tight text-white h-fit font-Nunito">
                    {exam.examName}
                  </h1>
                  <div className="flex flex-col items-end self-end gap-3 min-w-fit">
                    <div
                      className={`text-accent2 text-center items-end font-extrabold font-nunito min-w-[150px] text-xl px-4 py-2 bg-white rounded-2xl ${
                        !(time > 0) && 'hidden'
                      }`}
                    >
                      {hours === 0
                        ? `00:${minutesStr}:${secondsStr}`
                        : `${hoursStr}:${minutesStr}:${secondsStr} `}
                    </div>
                    <div className="flex flex-row items-center gap-2 min-w-[150px]">
                      <button
                        className="items-center justify-center min-h-full px-3 py-2 font-bold bg-white min-w-fit text-accent1 rounded-2xl"
                        onClick={handleStopExam}
                      >
                        <i
                          className="pi pi-power-off"
                          style={{ fontSize: '1rem', 'font-weight': '600' }}
                        ></i>
                      </button>
                      {token === undefined || !(time > 0) ? (
                        <button
                          className="px-4 py-2 text-xl font-bold bg-white min-w-[150px] text-accent1 rounded-2xl"
                          onClick={handleStartExam}
                        >
                          Click here to start exam
                        </button>
                      ) : (
                        <div className="min-h-full px-4 py-2 text-xl font-bold text-center bg-white min-w-[150px] text-accent1 rounded-2xl">
                          {token}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative rounded-[24px] overflow-hidden shadow-lg border-[#fafafade]">
              <DataTable
                value={dataGrid}
                ref={dt}
                paginator
                rows={15}
                rowsPerPageOptions={[15, 25, 50]}
                size="sm"
                sortMode="multiple"
                sortOrder={-1}
                removableSort
                scrollable
                rounded
                scrollHeight="calc(100vh - 300px)"
                className="shadow-md p-datatable-sm p-paginator-sm p-datatable-striped p-datatable-gridlines-both p-datatable-hoverable-rows"
                paginatorRight={footer}
                paginatorLeft={refresh}
              >
                <Column field="noreg" header="Nomor registrasi"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="score.grade" header="Grade"></Column>
                <Column field="score.totalScore" header="Total Score"></Column>
                <Column field="score.vocabulary.string" header="Vocab"></Column>
                <Column field="score.reading.string" header="Reading"></Column>
                <Column
                  field="score.listening.string"
                  header="Listening"
                ></Column>
                <Column field="score.grammar.string" header="grammar"></Column>
                <Column field="status" header="status"></Column>
              </DataTable>
            </div>
          </div>
          <QuestionEditor
            examList={examList}
            getExamQuestions={getExamQuestion}
          />
        </>
      ) : (
        <div className="flex-1 p-3">
          <h1>Welcome to Dashboard</h1>
        </div>
      )}
    </div>
  );
}
