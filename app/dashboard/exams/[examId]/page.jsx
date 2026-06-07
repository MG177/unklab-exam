'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Upload,
  Download,
  RefreshCw,
  Play,
  Square,
  Settings,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api/client';
import { Topbar, Stats, StatCard, StatusBadge, TokenStrip } from '@/components/dashboard/shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConfirmDialog } from '@/components/dashboard/dialogs';
import DownloadCSVTemplate from '@/components/dashboard/CSVDownload';
import ScoreCard from '@/components/score/ScoreCard';
import Answer from '@/components/score/Answer';
import { cn } from '@/lib/utils';

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(time) {
  if (time === null || time === undefined || isNaN(time) || time <= 0) {
    return '00:00:00';
  }
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = Math.floor(time % 60);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function rowStatus(row) {
  if (row.isSubmitted) return 'Submitted';
  if (typeof row.score === 'object') return 'In progress';
  return 'Not started';
}

export default function ExamDetailPage() {
  const params = useParams();
  const examId = params.examId;
  const router = useRouter();

  const [exam, setExam] = useState({});
  const [time, setTime] = useState(null);
  const [token, setToken] = useState(null);
  const [checked, setChecked] = useState({});
  const [dataGrid, setDataGrid] = useState([]);
  const [minute, setMinute] = useState(90);

  // student score sheet
  const [sheetOpen, setSheetOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentScore, setStudentScore] = useState({});
  const [questionList, setQuestionList] = useState([]);
  const [resetOpen, setResetOpen] = useState(false);

  const uploadRef = useRef(null);

  const isLive = time > 0;

  /* ── data ── */
  const mergeScores = (scores, examData) => {
    const students = examData?.students ?? [];
    const list = Array.isArray(scores) ? scores : [];
    return students.map((item) => {
      const s = list.find((x) => x.studentId === item.studentId);
      if (!s) return { ...item, score: '', totalScore: '' };
      return {
        ...item,
        isSubmitted: s.isSubmitted,
        score: s.score,
        totalScore: Math.round(s.totalScore),
      };
    });
  };

  const fetchDataGrid = async (examData) => {
    try {
      const res = await api.get(`/exam/score/${examId}`);
      setDataGrid(mergeScores(res.data, examData));
    } catch (err) {
      console.log(err);
      toast.error('Failed to get score data');
    }
  };

  const fetchExam = async () => {
    try {
      const res = await api.get(`/exam/${examId}`);
      setExam(res.data);
      setChecked({
        isRandom: res.data.isRandom,
        isShowScore: res.data.isShowScore,
        isShowAnswer: res.data.isShowAnswer,
      });
      setToken(res.data.token);
      fetchDataGrid(res.data);
    } catch (err) {
      console.log(err);
      router.push('/dashboard/exams');
    }
  };

  const fetchTime = async () => {
    try {
      const res = await api.get(`/exam/time/${examId}`);
      setTime(res.data);
    } catch (err) {
      console.log(err);
      router.push('/dashboard/exams');
    }
  };

  useEffect(() => {
    fetchExam();
    fetchTime();
    const id = setInterval(fetchTime, 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  useEffect(() => {
    if (time > 0) {
      const id = setInterval(() => setTime((t) => t - 1), 1000);
      return () => clearInterval(id);
    }
  }, [time]);

  /* ── actions ── */
  const handleStart = async () => {
    try {
      const res = await api.patch(`/exam/start/${examId}?minute=${minute}`);
      setTime(res.data.time);
      setToken(res.data.token);
      toast.success('Exam started');
    } catch (err) {
      console.log(err);
      toast.error('Could not start exam', { description: err.response?.data?.message });
    }
  };

  const handleStop = async () => {
    try {
      const res = await api.patch(`/exam/start/${examId}?minute=0`);
      setTime(res.data.time);
      toast.success('Exam stopped');
    } catch (err) {
      console.log(err);
      toast.error('Could not stop exam', { description: err.response?.data?.message });
    }
  };

  const handleSwitch = async (key) => {
    try {
      const change = { [key]: !checked[key] };
      if (change.isShowAnswer) change.isShowScore = true;
      if (change.isShowScore === false) change.isShowAnswer = false;
      const res = await api.patch(`/exam/switch/${examId}`, change);
      setChecked({
        isShowScore: res.data.isShowScore,
        isShowAnswer: res.data.isShowAnswer,
        isRandom: res.data.isRandom,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      e.target.value = '';
      await api.patch(`/exam/studentList/${examId}`, formData);
      fetchExam();
      toast.success('Student list uploaded');
    } catch (err) {
      console.log(err);
      toast.error('Failed to upload student list');
    }
  };

  const fetchScore = async (sid, sname) => {
    try {
      const res = await api.get(`/student/score/${examId}/${sid}`);
      setStudentScore(res.data.score);
      setQuestionList(res.data.questionList);
      setStudentName(sname);
      setStudentId(sid);
      setSheetOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReset = async () => {
    if (!studentId) return;
    try {
      await api.delete(`/student/${examId}/${studentId}`);
      fetchExam();
      setSheetOpen(false);
      toast.success('Student reset');
    } catch (err) {
      console.log(err);
      toast.error('Failed to reset student');
    }
  };

  /* ── export ── */
  const exportExcel = () => {
    const formatted = (dataGrid ?? []).map((item) => {
      const row = {
        No: item.number,
        noreg: item.studentId,
        name: item.studentName,
        totalScore: item.totalScore,
      };
      Object.entries(item.score || {}).forEach(([key, value]) => {
        row[`${key} correct`] = value.correct;
        row[`${key} total question`] = value.total;
        row[`${key} score`] = value.score;
      });
      return row;
    });
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(formatted);
      worksheet['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 30 }];
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      import('file-saver').then((mod) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        });
        mod.default.saveAs(blob, `Exam_export_${exam.examName}_${Date.now()}.xlsx`);
      });
    });
  };

  /* ── derived ── */
  const rosterCount = exam.students?.length ?? 0;
  const submittedCount = useMemo(
    () => (dataGrid ?? []).filter((r) => r.isSubmitted).length,
    [dataGrid]
  );
  const questionCols = exam.questions ?? [];
  const status = isLive ? 'live' : exam.endTime ? 'ended' : 'draft';

  return (
    <>
      <Topbar
        crumbs={[
          { label: 'Exams', href: '/dashboard/exams' },
          { label: exam.examName || 'Exam' },
        ]}
        center={isLive ? <TokenStrip token={token} live /> : null}
      >
        {/* settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="h-9 w-9" aria-label="Exam settings">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-3">
            <DropdownMenuLabel className="px-0 pb-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink-faint">
              Student visibility
            </DropdownMenuLabel>
            <div className="space-y-3 text-sm">
              <label className="flex items-center justify-between gap-3">
                <span>Show score to student</span>
                <Switch
                  checked={!!checked.isShowScore}
                  onCheckedChange={() => handleSwitch('isShowScore')}
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Show correct answers</span>
                <Switch
                  checked={!!checked.isShowAnswer}
                  onCheckedChange={() => handleSwitch('isShowAnswer')}
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Randomize questions &amp; options</span>
                <Switch
                  checked={!!checked.isRandom}
                  onCheckedChange={() => handleSwitch('isRandom')}
                />
              </label>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {isLive ? (
          <Button variant="destructive" size="sm" onClick={handleStop}>
            <Square className="h-4 w-4" /> Stop exam
          </Button>
        ) : (
          <div className="flex items-center gap-1.5">
            <Input
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              inputMode="numeric"
              className="h-9 w-16 text-center font-mono text-xs tabular-nums"
              aria-label="Duration in minutes"
            />
            <Button size="sm" onClick={handleStart}>
              <Play className="h-4 w-4" /> Start
            </Button>
          </div>
        )}
      </Topbar>

      <div className="flex-1 overflow-auto p-5">
        {/* status line */}
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-[1.45rem] font-extrabold leading-tight tracking-[-0.02em] text-ink">
            {exam.examName || 'Exam'}
          </h1>
          <StatusBadge status={status}>
            {status === 'live' ? 'Live' : status === 'ended' ? 'Ended' : 'Draft'}
          </StatusBadge>
        </div>

        {/* stats */}
        <Stats className="mb-4">
          <StatCard
            label="Remaining"
            value={isLive ? formatTime(time) : '—'}
            hint={isLive ? 'Session in progress' : 'Set duration and start'}
            timer={isLive}
          />
          <StatCard
            label="Token"
            value={isLive ? token || '—' : '—'}
            hint={isLive ? 'Share at student login' : 'Issued on start'}
          />
          <StatCard
            label="Submitted"
            value={`${submittedCount}/${rosterCount}`}
            hint={
              rosterCount
                ? `${Math.round((submittedCount / rosterCount) * 100)}% of roster`
                : 'Import roster'
            }
          />
        </Stats>

        {/* controls */}
        <div className="mb-3.5 flex flex-wrap items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <label className="cursor-pointer">
              <Upload className="h-4 w-4" /> Import CSV
              <input
                ref={uploadRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleImport}
              />
            </label>
          </Button>
          <DownloadCSVTemplate />
          <Button variant="secondary" size="sm" onClick={exportExcel}>
            <FileSpreadsheet className="h-4 w-4" /> Export XLSX
          </Button>
          <Button variant="ghost" size="sm" onClick={fetchExam}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        {/* roster */}
        {(dataGrid ?? []).length > 0 ? (
          <TooltipProvider delayDuration={100}>
            <div className="overflow-hidden rounded-lg border border-line bg-surface">
              <div className="max-h-[calc(100vh-320px)] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      {questionCols.map((q, i) => (
                        <TableHead key={i} title={q.questionName} className="text-right">
                          <span className="block max-w-[120px] truncate">{q.questionName}</span>
                        </TableHead>
                      ))}
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataGrid.map((row, idx) => {
                      const st = rowStatus(row);
                      const started = typeof row.score === 'object';
                      return (
                        <TableRow key={row.studentId || idx}>
                          <TableCell className="font-mono text-xs tabular-nums">{row.number}</TableCell>
                          <TableCell className="font-mono text-xs tabular-nums">{row.studentId}</TableCell>
                          <TableCell className="font-medium text-ink">{row.studentName}</TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                'text-xs font-semibold',
                                st === 'Submitted' && 'text-live',
                                st === 'In progress' && 'text-warn-ink',
                                st === 'Not started' && 'text-ink-faint'
                              )}
                            >
                              {st}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs font-bold tabular-nums">
                            {row.totalScore !== '' ? row.totalScore : '—'}
                          </TableCell>
                          {questionCols.map((q, i) => {
                            const cell = started ? row.score?.[q.questionName] : null;
                            if (!cell) {
                              return (
                                <TableCell key={i} className="text-right font-mono text-xs text-ink-faint">
                                  —
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell key={i} className="text-right">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="font-mono text-xs tabular-nums">
                                      {cell.score ?? 0}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Correct {cell.correct ?? 0} / {cell.total ?? 0}
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-right">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-7"
                              disabled={!started}
                              onClick={() => fetchScore(row.studentId, row.studentName)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TooltipProvider>
        ) : (
          <div className="flex items-start gap-5 rounded-lg border border-line bg-surface p-7">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-line bg-paper text-ink-muted">
              <Upload className="h-[22px] w-[22px]" />
            </div>
            <div>
              <h3 className="mb-1.5 text-base font-extrabold text-ink">
                No students on this roster
              </h3>
              <p className="mb-3.5 max-w-[42ch] text-[13px] leading-relaxed text-ink-muted">
                Upload a CSV with <code className="rounded border border-line bg-paper px-1 py-0.5 font-mono text-xs">No.</code>,{' '}
                <code className="rounded border border-line bg-paper px-1 py-0.5 font-mono text-xs">Id</code>, and{' '}
                <code className="rounded border border-line bg-paper px-1 py-0.5 font-mono text-xs">Name</code> columns. Students appear here after import.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4" /> Import CSV
                    <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
                  </label>
                </Button>
                <DownloadCSVTemplate />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* student score sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b border-line px-5 py-4 text-left">
            <SheetTitle className="truncate">{studentName || 'Student'}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1">
            <div className="px-5 py-6">
              <div className="origin-top scale-[0.85]">
                <ScoreCard score={studentScore} user={{ studentName }} />
              </div>
              <div className="mt-8 flex max-w-2xl flex-col gap-5">
                {questionList.map((question, index) => (
                  <Answer key={question.id} question={question} index={index} showOrigin />
                ))}
              </div>
            </div>
          </ScrollArea>
          <div className="border-t border-line p-3">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setResetOpen(true)}
            >
              Reset this student
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Reset this student?"
        description={`"${studentName}" will be able to retake the exam. Their current answers will be cleared.`}
        confirmLabel="Reset"
        destructive
        onConfirm={handleReset}
      />
    </>
  );
}
