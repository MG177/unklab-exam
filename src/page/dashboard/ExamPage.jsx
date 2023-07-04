import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classHeader from '../../image/class-header.svg';
import { DataTable } from 'primereact/datatable';
import api from '../../config/index';
import { HeaderExamDashboard } from '../../components/Header';

import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';

export default function PageDashboard() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState({});
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(null);
  const [token, setToken] = useState(null);
  const [dataGrid, setDataGrid] = useState([]);
  const dt = useRef(null);
  const uploadRef = useRef(null);
  const toast = useRef(null);

  // const formattedData = dataGrid.map((item) => {
  //   const formattedItem = {
  //     name: item.name,
  //     noreg: item.noreg,
  //     status: item.status,
  //   };

  //   if (item.score) {
  //     formattedItem.grade = item.score.grade || '';
  //     formattedItem.totalScore = item.score.totalScore || '';
  //     formattedItem.vocabulary = item.score.vocabulary?.string || '';
  //     formattedItem.reading = item.score.reading?.string || '';
  //     formattedItem.listening = item.score.listening?.string || '';
  //     formattedItem.grammar = item.score.grammar?.string || '';
  //   }

  //   return formattedItem;
  // });

  // const exportExcel = () => {
  //   import('xlsx').then((xlsx) => {
  //     const worksheet = xlsx.utils.json_to_sheet(formattedData);

  //     // Set the column order
  //     worksheet['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 30 }];

  //     const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  //     const excelBuffer = xlsx.write(workbook, {
  //       bookType: 'xlsx',
  //       type: 'array',
  //     });

  //     saveAsExcelFile(excelBuffer, `Exam_export_${exam.examName}`);
  //   });
  // };

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

  const fetchExam = async () => {
    try {
      const response = await api.get(`/exam/${examId}`);
      setExam(response.data);
      // console.log('exam fetch', response.data);
      // setDataGrid(response.data.students);
      setToken(response.data.token);
      fetchDataGrid(response.data);
    } catch (error) {
      console.log(error);
      navigate('/dashboard');
    }
  };

  const fetchDataGrid = async (exam) => {
    try {
      const response = await api.get(`/exam/score/${examId}`);
      console.log('student score', response.data);
      console.log('exam', exam);
      // setDataGrid(response.data);
      const mergedData = await mergeDatagridWithScore(response.data, exam);
      // if (mergedData) {
      setDataGrid(mergedData);
      // }
      // console.log('data grid', mergedData);
      // console.log('data grid', response.data);
      // console.log('data grid', mergeDatagridWithScore(response.data));
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to get score data',
        life: 3000,
      });
    }
  };

  const mergeDatagridWithScore = (data, exam) => {
    try {
      const mergedData = exam.students.map((item) => {
        const scoreItem = data.find(
          (scoreItem) => scoreItem.studentId === item.studentId
        );
        if (!scoreItem) {
          return {
            ...item,
            score: {
              score: '',
              correct: '',
              total: '',
            },
            totalScore: '',
          };
        } else {
          return {
            ...item,
            isSubmitted: scoreItem.isSubmitted,
            score: scoreItem.score,
            totalScore: scoreItem.totalScore,
          };
        }
      });
      console.log('merged data', mergedData);

      return mergedData;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTime = async () => {
    try {
      const response = await api.get(`/exam/time/${examId}`);
      setTime(response.data);
    } catch (error) {
      console.log(error);
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchExam();
    fetchTime(); // Fetch time once when component mounts
    setLoading(false);

    const intervalId = setInterval(() => {
      fetchTime();
    }, 30000); // Send request every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let intervalId;

    const countDown = () => setTime((prevTime) => prevTime - 1);

    if (time > 0) {
      intervalId = setInterval(countDown, 1000);
    }
    console.log(time);
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
      <Button
        type="button"
        icon="pi pi-file-excel"
        severity="success"
        rounded
        text
        label="Export to Excel"
        className="shadow-md border border-gray/20 mt-2"
        // onClick={exportExcel}
        data-pr-tooltip="XLS"
      />
    </div>
  );

  const refresh = (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        icon="pi pi-refresh"
        severity="info"
        rounded
        text
        raised
        label="refresh"
        className="shadow-md border border-gray/20 mt-2"
        onClick={fetchExam}
      />
    </div>
  );

  const handleImportStudents = async (e) => {
    e.preventDefault();
    console.log('tes');
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const response = await api.patch('/exam/studentList/' + examId, formData);
      // if (response.status === 201) {
      //   // fetchData();
      //   // fetchDataBySession(newSession);
      //   // setSelectedSession(newSession);
      //   // newClassDialog.close();
      //   alert('Exam uploaded successfully');
      // } else {
      //   throw new Error('Something went wrong, please try again later');
      // }
      e.target.value = '';
      fetchExam();
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Student list uploaded successfully',
        life: 3000,
      });
      // e.target.value = null;
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to upload student list',
        life: 3000,
      });
      // alert(error.message);
    }
  };

  const handleColumnHeader = (column) => {
    if (column.length > 17) {
      return (
        <div title={column} className="text-[100%]">
          {column.substring(0, 17) + '...'}
        </div>
      );
    } else {
      return (
        <div title={column} className="text-[100%]">
          {column}
        </div>
      );
      return column;
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full ">
      <HeaderExamDashboard
        examName={exam.examName}
        setTime={setTime}
        time={time}
        setToken={setToken}
        fetchExam={fetchExam}
      />
      {!loading ? (
        <>
          <div className="container p-4 bg-[#FCF9FF] flex flex-col mt-[70px] w-5/6 gap-4">
            <Toast
              ref={toast}
              style={{
                marginTop: '4rem',
                borderRadius: '1rem',
                boxShadow: '0 0 #0000',
                paddingInline: '5px',
              }}
              pt={{
                icon: '1rem',
              }}
            />
            <div className="flex flex-row justify-between gap-3 min-w-fit">
              <label
                className="cursor-pointer flex items-center justify-center font-bold text-accent1 py-2 px-10 rounded-2xl font-Nunito bg-whitePlus border border-accent1 shadow-md z-50 h-fit self-end"
                htmlFor="uploadCSV"
              >
                <p className="text-base leading-none">Import</p>
                <input
                  type="file"
                  id="uploadCSV"
                  accept=".csv"
                  ref={uploadRef}
                  onChange={handleImportStudents}
                  className="hidden"
                />
              </label>
              <div className="flex flex-row gap-3 ">
                <div
                  className={`text-accent2 text-center items-end font-extrabold font-nunito min-w-[150px] text-xl px-4 py-2 bg-whitePlus shadow-md rounded-2xl `}
                >
                  {hours === 0
                    ? `00:${minutesStr}:${secondsStr}`
                    : time != 'NaN'
                    ? `${hoursStr}:${minutesStr}:${secondsStr}`
                    : '00:00:00'}
                </div>
                <div className="flex flex-row items-center gap-2 min-w-[150px]">
                  <div className="h-full px-4 py-2 text-xl font-bold text-center bg-whitePlus shadow-md min-w-[150px] text-accent1 rounded-2xl">
                    {token || 'null'}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden border-white shadow-lg rounded-2xl">
              {dataGrid.length > 0 ? (
                <DataTable
                  value={dataGrid}
                  ref={dt}
                  paginator
                  rows={25}
                  rowsPerPageOptions={[25, 50, 75, 100]}
                  size="sm"
                  // sortField="number"
                  // sortOrder={-1}
                  removableSort
                  scrollable
                  rounded
                  scrollHeight="calc(100vh - 250px)"
                  className="p-2 shadow-md bg-whitePlus p-datatable-sm p-paginator-sm p-datatable-striped p-datatable-gridlines-both p-datatable-hoverable-rows"
                  paginatorRight={footer}
                  paginatorLeft={refresh}
                >
                  <Column field="number" header="No." sortable></Column>
                  <Column field="studentId" header="ID" sortable></Column>
                  <Column field="studentName" header="Name" sortable></Column>
                  <Column
                    field="totalScore"
                    header="Total Score"
                    sortable
                  ></Column>
                  {exam.questions.map((question, index) => {
                    return (
                      <Column
                        // field={`score.${question.questionName}.correct`}
                        field={`score.${question.questionName}.score`}
                        // header={`${question.questionName}`}
                        header={handleColumnHeader(question.questionName)}
                        key={index}
                        sortable
                      ></Column>
                    );
                  })}
                  <Column field="isSubmitted" header="status"></Column>
                </DataTable>
              ) : (
                <div className="flex flex-col items-center justify-center w-full max-h-full p-3 text-2xl font-Nunito text-gray">
                  <div>No student data available</div>
                  <div>Please import .csv file that contains student list.</div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-screen p-3 text-2xl font-Nunito">
          <div>Welcome to Dashboard</div>
          <div>To choose a class, please use the sidebar on the left.</div>
        </div>
      )}
    </div>
  );
}
