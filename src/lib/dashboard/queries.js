import { connectDB } from '@/lib/db/connect';
import * as examService from '@/lib/services/exam.service';
import * as questionsService from '@/lib/services/questions.service';
import { serialize } from '@/lib/dashboard/serialize';
import { mergeExamScores } from '@/lib/dashboard/exam-utils';

export async function fetchExamsList() {
  await connectDB();
  const result = await examService.findAll();
  const list = Array.isArray(result) ? result : (result?.data ?? []);
  return serialize(list);
}

export async function fetchExamDetail(examId) {
  await connectDB();
  const exam = await examService.findOneByID(examId);
  if (!exam) return null;

  const [scores, time] = await Promise.all([
    examService.getScoreTable(examId),
    examService.countTime(examId),
  ]);

  const serializedExam = serialize(exam);
  return {
    exam: serializedExam,
    dataGrid: mergeExamScores(scores, serializedExam),
    time,
  };
}

export async function fetchQuestionBanks() {
  await connectDB();
  const result = await questionsService.findAll();
  const list = Array.isArray(result) ? result : (result?.data ?? []);
  return serialize(list);
}

export async function fetchQuestionBank(questionId) {
  await connectDB();
  const bank = await questionsService.findOne(questionId);
  if (!bank) return null;
  return serialize(bank);
}
