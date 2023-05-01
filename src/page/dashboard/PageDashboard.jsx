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
  const [examActive, setExamActive] = useState();
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(0);
  const [token, setToken] = useState('');
  const [dataGrid, setDataGrid] = useState([
    {
      name: 'MG',
      score: {
        reading: {
          total: 0,
          correct: 0,
          score: 0,
        },
        vocabulary: {
          total: 0,
          correct: 0,
          score: 0,
        },
        listening: {
          total: 0,
          correct: 0,
          score: 0,
        },
        grammar: {
          total: 0,
          correct: 0,
          score: 0,
        },
        totalQuestion: 0,
        totalCorrect: 0,
        totalScore: 0,
        grade: '-',
      },
      noreg: '-',
      status: '-',
    },
  ]);
  const dt = useRef(null);

  useEffect(() => {
    try {
      api
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
  }, [user.access_token, examId, setQuestions, loading]);

  useEffect(() => {
    try {
      api
        .get(`/students/exam/score/${examId}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((response) => {
          setDataGrid(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, [user.access_token, examId, loading]);

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
      formattedItem.vocabulary = item.score.vocabulary?.score || '';
      formattedItem.reading = item.score.reading?.score || '';
      formattedItem.listening = item.score.listening?.score || '';
      formattedItem.grammar = item.score.grammar?.score || '';
    }

    return formattedItem;
  });

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportPdf = () => {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF.default({
          orientation: 'landscape',
        });

        doc.autoTable(exportColumns, dataGrid);
        doc.save(`Exam_export_${exam.examName}_${new Date().getTime()}.pdf`);
      });
    });
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

  // const handleSearch = (event) => {
  //   const query = event.target.value.toLowerCase();
  //   ProductService.getProductsMini().then((data) => {
  //     const filteredProducts = data.filter((product) => {
  //       return (
  //         product.name.toLowerCase().includes(query) ||
  //         product.code.toLowerCase().includes(query)
  //       );
  //     });
  //     setProducts(filteredProducts);
  //   });
  // };

  useEffect(() => {
    try {
      api
        .get(`time/${examId}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        })
        .then((response) => {
          setTime(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, [user.access_token, examId]);

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

  const footer = (
    <div className="flex align-items-center justify-end gap-2">
      <Button
        type="button"
        icon="pi pi-file"
        rounded
        text
        raised
        onClick={() => exportCSV(false)}
        data-pr-tooltip="CSV"
      />
      <Button
        type="button"
        icon="pi pi-file-excel"
        severity="success"
        rounded
        text
        raised
        onClick={exportExcel}
        data-pr-tooltip="XLS"
      />
      <Button
        type="button"
        icon="pi pi-file-pdf"
        severity="warning"
        rounded
        text
        raised
        onClick={exportPdf}
        data-pr-tooltip="PDF"
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
    <div className="relative flex w-full justify-center">
      <Sidebar setToken={setToken} />
      {!loading ? (
        <>
          <div className="container p-4 w-full bg-[#FCF9FF] flex-1">
            <div className="mb-12">
              <div className="relative flex flex-row justify-between min-h-[175px] p-4">
                <img
                  src={classHeader}
                  alt=""
                  className="absolute top-0 left-0 z-0 object-cover w-full h-full rounded-2xl"
                />
                <h1 className="z-10 text-[60px] max-w-xl font-Nunito text-white font-bold leading-tight">
                  {exam.examName}
                </h1>
                <div className="z-10 flex flex-row items-end gap-3">
                  <div className="flex flex-row gap-3  font-Nunito right-4 bottom-4">
                    {/* <form
                  className="px-4 py-2 text-2xl font-bold bg-white text-accent1 rounded-2xl"
                  onSubmit={handleImport}
                >
                  <i className="fa-solid fa-bars" />
                  <label htmlFor="file">Choose a file:</label>
                  <input type="file" id="file" name="file" />
                  <button type="submit">Upload</button>
                </form> */}
                    <button
                      className="px-4 py-2 text-2xl font-bold bg-white text-accent1 rounded-2xl"
                      onClick={handleImport}
                    >
                      <i className="fa-solid fa-bars" />
                    </button>
                  </div>
                  <div className="flex flex-col items-center min-w-[220px] gap-3">
                    <div
                      className={`text-accent2 text-center font-extrabold font-nunito min-w-full text-3xl px-4 py-2 bg-white rounded-2xl ${
                        !(time > 0) && 'hidden'
                      }`}
                    >
                      {hours === 0
                        ? `00:${minutesStr}:${secondsStr}`
                        : `${hoursStr}:${minutesStr}:${secondsStr} `}
                    </div>
                    {token === undefined || !(time > 0) ? (
                      <button
                        className="min-w-full px-4 py-2 text-3xl font-bold bg-white text-accent1 rounded-2xl"
                        onClick={handleStartExam}
                      >
                        Click here to start exam
                      </button>
                    ) : (
                      <div className="min-w-full px-4 py-2 text-3xl font-bold text-center bg-white text-accent1 rounded-2xl">
                        {token}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-3 bg-white rounded-lg shadow-md">
              <div className="relative flex flex-row-reverse flex-wrap items-stretch w-full mb-4">
                <input
                  type="search"
                  className="relative m-0 block w-[1px] min-w-0 flex-auto rounded border-none text-base font-normal leading-[1.6] text-black outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:text-neutral-200 dark:placeholder:text-black dark:focus:border-primary"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="button-addon2"
                  // onChange={handleSearch}
                />
                <span
                  className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-black dark:text-neutral-200"
                  id="basic-addon2"
                >
                  <i className="text-black fa-solid fa-magnifying-glass" />
                </span>
              </div>
            </div>
            <div className="relative rounded-[24px] overflow-hidden shadow-lg border-[#fafafade]">
              <DataTable
                value={dataGrid}
                className="shadow-md"
                ref={dt}
                paginator
                rows={15}
                rowsPerPageOptions={[15, 25, 50]}
                tableStyle={{ minWidth: '50rem' }}
                size="sm"
                sortMode="multiple"
                sortOrder={-1}
                removableSort
                scrollable
                scrollHeight="60vh"
                rounded
                paginatorRight={footer}
                paginatorLeft={<div></div>}
              >
                <Column field="noreg" header="Nomor registrasi"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="score.grade" header="Grade"></Column>
                <Column field="score.totalScore" header="Total Score"></Column>
                <Column field="score.vocabulary.score" header="Vocab"></Column>
                <Column field="score.reading.score" header="Reading"></Column>
                <Column
                  field="score.listening.score"
                  header="Listening"
                ></Column>
                <Column field="score.grammar.score" header="grammar"></Column>
                <Column field="status" header="status"></Column>
              </DataTable>
            </div>
          </div>
          <QuestionEditor />
        </>
      ) : (
        <div className="flex-1 p-3">
          <h1>Welcome to Dashboard</h1>
        </div>
      )}
    </div>
  );
}
