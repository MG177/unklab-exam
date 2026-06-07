'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import api from '@/lib/api/client';
import { HeaderExamDashboard } from '@/components/Header';
import ScoreCard from '@/components/score/ScoreCard';
import Answer from '@/components/score/Answer';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { Sidebar } from 'primereact/sidebar';
import { ScrollPanel } from 'primereact/scrollpanel';
import { ConfirmPopup } from 'primereact/confirmpopup';
import DownloadCSVTemplate from '@/components/dashboard/CSVDownload';

export default function ExamDetailPage() {
  const params = useParams();
  const examId = params.examId;
  const router = useRouter();

  const [exam, setExam] = useState({});
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(null);
  const [token, setToken] = useState(null);
  const [checked, setChecked] = useState(false);
  const [dataGrid, setDataGrid] = useState([]);
  const [visibleBottom, setVisibleBottom] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentScore, setStudentScore] = useState({});
  const [studentId, setStudentId] = useState('');
  const [questionList, setQuestionList] = useState([]);
  const [confirmResetPopup, setConfirmResetPopup] = useState(false);

  const dt = useRef(null);
  const uploadRef = useRef(null);
  const toast = useRef(null);
  const confirmResetRef = useRef(null);

  const formattedData = (dataGrid ?? []).map((item) => {
    const formattedItem = {
      No: item.number,
      noreg: item.studentId,
      name: item.studentName,
      totalScore: item.totalScore,
    };

    const score = Object.entries(item.score || {});

    score.forEach(([key, value]) => {
      formattedItem[`${key} correct`] = value.correct;
      formattedItem[`${key} total question`] = value.total;
      formattedItem[`${key} score`] = value.score;
    });

    return formattedItem;
  });

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(formattedData);
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
        const EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
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

  const mergeDatagridWithScore = (data, examData) => {
    try {
      const students = examData?.students ?? [];
      const scores = Array.isArray(data) ? data : [];

      return students.map((item) => {
        const scoreItem = scores.find((s) => s.studentId === item.studentId);
        if (!scoreItem) {
          return {
            ...item,
            score: '',
            totalScore: '',
          };
        }
        return {
          ...item,
          isSubmitted: scoreItem.isSubmitted,
          score: scoreItem.score,
          totalScore: Math.round(scoreItem.totalScore),
        };
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchExam = async () => {
    try {
      const response = await api.get(`/exam/${examId}`);
      setExam(response.data);
      setChecked({
        isRandom: response.data.isRandom,
        isShowScore: response.data.isShowScore,
        isShowAnswer: response.data.isShowAnswer,
      });
      setToken(response.data.token);
      fetchDataGrid(response.data);
    } catch (error) {
      console.log(error);
      router.push('/dashboard/exams');
    }
  };

  const fetchDataGrid = async (examData) => {
    try {
      const response = await api.get(`/exam/score/${examId}`);
      const mergedData = mergeDatagridWithScore(response.data, examData);
      setDataGrid(mergedData ?? []);
    } catch (error) {
      console.log(error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to get score data',
        life: 3000,
      });
    }
  };

  const fetchTime = async () => {
    try {
      const response = await api.get(`/exam/time/${examId}`);
      setTime(response.data);
    } catch (error) {
      console.log(error);
      router.push('/dashboard/exams');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchExam();
    fetchTime();
    setLoading(false);

    const intervalId = setInterval(() => {
      fetchTime();
    }, 30000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

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
      <Button
        type="button"
        icon="pi pi-file-excel"
        severity="success"
        rounded
        text
        label="Export to Excel"
        className="mt-2 border shadow-md border-gray/20"
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
        severity="info"
        rounded
        text
        raised
        label="refresh"
        className="mt-2 border shadow-md border-gray/20"
        onClick={fetchExam}
      />
    </div>
  );

  const handleImportStudents = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      e.target.value = '';
      await api.patch('/exam/studentList/' + examId, formData);
      fetchExam();
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Student list uploaded successfully',
        life: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to upload student list',
        life: 3000,
      });
    }
  };

  const handleColumnHeader = (column) => {
    const length = 17;
    if (column.length > length) {
      return (
        <div title={column} className="text-[100%] capitalize">
          {column.substring(0, length) + '...'}
        </div>
      );
    } else {
      return (
        <div title={column} className="text-[100%] capitalize">
          {column}
        </div>
      );
    }
  };

  const handleCell = (rowData, questionName, index) => {
    const score = rowData.score[questionName];
    if (!score) {
      return <div title={questionName} className="text-[100%]"></div>;
    }
    return (
      <>
        <Tooltip target={`#cell_score_${rowData.studentId}_${index}`} />
        <div
          data-pr-position="right"
          className="text-[100%]"
          id={`cell_score_${rowData.studentId}_${index}`}
          data-pr-tooltip={`Correct answer: ${score.correct || ''} / ${
            score.total || ''
          }`}
        >
          {score.score || '0'}
        </div>
      </>
    );
  };

  const fetchScore = async (sid, sname) => {
    try {
      const response = await api.get(`/student/score/${examId}/${sid}`);
      setStudentScore(response.data.score);
      setQuestionList(response.data.questionList);
      setStudentName(sname);
      setStudentId(sid);
      setVisibleBottom(true);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const viewDetailsButton = (rowData) => {
    if (typeof rowData.score === 'object') {
      return (
        <button
          className="w-full px-1 py-1 font-semibold text-blue-500 transition duration-200 ease-in-out scale-90 border rounded-md shadow-md border-gray/20 hover:bg-blue-500 hover:text-white"
          onClick={() => fetchScore(rowData.studentId, rowData.studentName)}
        >
          View Details
        </button>
      );
    } else {
      return (
        <button
          className="w-full px-1 py-1 font-semibold transition duration-200 ease-in-out scale-90 border rounded-md shadow-md border-gray/20 text-gray"
          disabled
        >
          View Details
        </button>
      );
    }
  };

  const handleResetStudent = async () => {
    if (!studentId) {
      return;
    }
    try {
      await api.delete('/student/' + examId + '/' + studentId);
      fetchExam();
      setVisibleBottom(false);
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Student reset successfully',
        life: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to reset student',
        life: 3000,
      });
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
        checked={checked}
        setChecked={setChecked}
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
              <div className="flex flex-row gap-3 text-lg font-bold leading-none font-Nunito text-accent1">
                <label
                  className="z-50 flex items-center self-end justify-center px-10 py-2 border shadow-md cursor-pointer rounded-2xl bg-whitePlus border-accent1 h-fit"
                  htmlFor="uploadCSV"
                >
                  <p>Import</p>
                  <input
                    type="file"
                    id="uploadCSV"
                    accept=".csv"
                    ref={uploadRef}
                    onChange={handleImportStudents}
                    className="hidden"
                  />
                </label>
                <DownloadCSVTemplate />
              </div>
              <div className="flex flex-row gap-3 ">
                <div className="text-accent2 text-center items-end font-extrabold font-nunito min-w-[150px] text-xl px-4 py-2 bg-whitePlus shadow-md rounded-2xl">
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
              <Sidebar
                visible={visibleBottom}
                position="right"
                onHide={() => setVisibleBottom(false)}
                className="relative h-screen bg-white shadow-lg w-fit rounded-l-3xl"
                pt={{
                  content: { className: 'relative' },
                }}
              >
                <ScrollPanel
                  style={{ width: '100%', height: '100%' }}
                  className="px-2"
                >
                  <div className="scale-75">
                    <ScoreCard score={studentScore} user={{ studentName }} />
                  </div>
                  <div className="flex flex-col max-w-2xl gap-5 px-1 pb-3 mt-4 mb-12">
                    {questionList.map((question, index) => (
                      <Answer
                        key={question.id}
                        question={question}
                        index={index}
                        showOrigin={true}
                      />
                    ))}
                  </div>
                </ScrollPanel>
                <ConfirmPopup
                  target={confirmResetRef.current}
                  visible={confirmResetPopup}
                  onHide={() => setConfirmResetPopup(false)}
                  message={`Are you sure you want to reset "${studentName}" ?`}
                  icon="pi pi-exclamation-triangle"
                  accept={handleResetStudent}
                  reject={() => setConfirmResetPopup(false)}
                  className="rounded-2xl w-[300px]"
                  rejectClassName="rounded-xl bg-whitePlus hover:bg-blue-100 text-blue-600 border border-whitePlus hover:border-whitePlus"
                  acceptClassName="rounded-xl bg-red-500 hover:bg-red-600 text-white border border-red-500 hover:border-red-600"
                />
                <div
                  className="absolute bottom-0 left-0 z-10 flex flex-row justify-end w-full px-3 py-2 bg-whitePlus"
                  ref={confirmResetRef}
                >
                  <button
                    className="w-full py-2 text-2xl font-semibold text-red-500 transition duration-200 ease-in-out scale-90 border border-red-400 shadow-lg font-Nunito rounded-2xl hover:bg-red-500 hover:text-white"
                    onClick={() => setConfirmResetPopup(true)}
                  >
                    Reset this student
                  </button>
                </div>
              </Sidebar>
              {(dataGrid ?? []).length > 0 ? (
                <DataTable
                  value={dataGrid ?? []}
                  ref={dt}
                  paginator
                  rows={25}
                  rowsPerPageOptions={[25, 50, 75, 100]}
                  size="sm"
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
                  {exam.questions?.map((question, index) => {
                    return (
                      <Column
                        body={(rowData) =>
                          handleCell(rowData, question.questionName, index)
                        }
                        header={handleColumnHeader(question.questionName)}
                        key={index}
                        sortable
                      ></Column>
                    );
                  })}
                  <Column
                    body={viewDetailsButton}
                    header="View details"
                    headerClassName="text-center justify-center"
                  ></Column>
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
