import mongoose from 'mongoose';
import { extname } from 'path';
import * as XLSX from 'xlsx';
import { Exam } from '@/lib/models/Exam';

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];
const ALLOWED_MIME_TYPES = [
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/octet-stream',
];

const studentSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    studentId: { type: String, required: true },
    examName: { type: String, required: true },
    examId: { type: String, required: true },
    isSubmitted: { type: Boolean, default: false },
    questionList: { type: Array, default: [] },
    score: { type: Array },
  },
  { timestamps: true }
);

studentSchema.index({ studentId: 1, examId: 1 });
studentSchema.index({ examId: 1 });

const Student =
  mongoose.models.Students || mongoose.model('Students', studentSchema);

export class HttpError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function getQuestionType(questionList) {
  if (!questionList?.length) return [];
  const seen = new Set();
  return questionList
    .map((question) => question.questionOrigin)
    .filter((origin) => {
      if (!origin?.questionId || seen.has(origin.questionId)) return false;
      seen.add(origin.questionId);
      return true;
    });
}

async function getStudentScore({ studentId, examId }) {
  const student = await Student.findOne({ studentId, examId }).exec();
  if (!student) {
    const err = new HttpError('Student not found', 404);
    throw err;
  }

  const questionList = student.questionList || [];
  const questionType = getQuestionType(questionList);

  const updatedScore = questionType.map((type) => {
    const questionByType = questionList.filter(
      (question) => question.questionOrigin?.questionId === type.questionId
    );
    const correct = questionByType.filter(
      (question) => question.answer === question.correctAnswer
    ).length;
    const totalQuestion = questionByType.length;
    const score =
      totalQuestion > 0 ? Math.round((correct / totalQuestion) * 100) : 0;

    return {
      questionName: type.questionName,
      total: totalQuestion,
      correct,
      score,
    };
  });

  return Student.findOneAndUpdate(
    { studentId, examId },
    { $set: { score: updatedScore } },
    { new: true }
  ).exec();
}

function extractScore(objArray) {
  const count = { total: 0, correct: 0, score: 0 };
  if (!objArray?.length) return count;

  for (const obj of objArray) {
    count.total += obj.total || 0;
    count.correct += obj.correct || 0;
  }

  if (count.total > 0) {
    count.score = Math.round((count.correct / count.total) * 100);
  }

  return count;
}

async function getStudentByExamId(examId) {
  return Student.find({ examId }).exec();
}

async function validateSpreadsheetFile(file) {
  if (!file) {
    throw new HttpError('File not found', 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new HttpError('File too large', 413);
  }

  const ext = extname(file.name || '').toLowerCase();
  if (
    !ALLOWED_EXTENSIONS.includes(ext) &&
    !ALLOWED_MIME_TYPES.includes(file.type)
  ) {
    throw new HttpError('Only .csv and .xlsx files are allowed', 400);
  }

  return { buffer, ext, name: file.name || '' };
}

function parseSpreadsheetRows(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer', raw: false });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
}

export async function findAll(page, limit) {
  if (page !== undefined || limit !== undefined) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, parseInt(limit, 10) || 20);
    const [data, total] = await Promise.all([
      Exam.find()
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l)
        .exec(),
      Exam.countDocuments().exec(),
    ]);
    return { data, total, page: p, limit: l };
  }
  return Exam.find().sort({ createdAt: -1 }).exec();
}

export async function findOneByID(id) {
  return Exam.findOne({ _id: id }).exec();
}

async function validateQuestion(element) {
  if (
    element.quantity <= 0 ||
    element.quantity == null ||
    element.quantity === undefined
  ) {
    throw new HttpError(
      'One question group must have at least 1 question',
      400
    );
  }

  if (element.questionName === '') {
    throw new HttpError('Question group must have a name', 400);
  }
}

export async function verifyQuestionInfo(data) {
  if (!data?.length) {
    throw new HttpError('Choose at least one question group', 400);
  }

  const newData = [];

  for (const element of data) {
    await validateQuestion(element);
    const questionInfo = {
      _id: element._id,
      questionName: element.questionName,
      quantity: element.quantity,
      questionLength: element.questionLength,
    };
    if (element.quantity > element.questionLength) {
      questionInfo.quantity = element.questionLength;
    }
    newData.push(questionInfo);
  }

  return newData;
}

export async function create(question, examName) {
  try {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const examReq = {
      token,
      examName,
      questions: question,
    };
    return await Exam.create(examReq);
  } catch (err) {
    throw new HttpError(err.message, 400);
  }
}

export async function update(id, body) {
  try {
    return await Exam.findOneAndUpdate({ _id: id }, body).exec();
  } catch (err) {
    throw new HttpError(err.message, 400);
  }
}

export async function uploadStudentList(file, id) {
  try {
    const { buffer } = await validateSpreadsheetFile(file);
    const rows = parseSpreadsheetRows(buffer);

    const startRow = 1;
    const endRow = rows.length - 1;
    const data = [];
    const badRows = [];

    for (let i = startRow; i <= endRow; i++) {
      const cells = (rows[i] || []).map((cell) =>
        cell == null ? '' : String(cell).trim()
      );
      const [num, idnoreg, name] = cells;
      if (!idnoreg && !name) {
        continue;
      }
      const studentId = (idnoreg || '').split(' / ')[0].trim();
      if (!studentId || !name) {
        badRows.push(i + 1);
        continue;
      }
      data.push({ number: num, studentId, studentName: name });
    }

    if (badRows.length > 0) {
      throw new HttpError(
        `Invalid student rows (each needs an ID and a name): ${badRows.join(', ')}`,
        400
      );
    }
    if (data.length === 0) {
      throw new HttpError('No valid students found in the uploaded file', 400);
    }

    return update(id, { students: data });
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(err.message, 400);
  }
}

function nextStudentNumber(existing) {
  const nums = (existing ?? [])
    .map((s) => parseInt(String(s.number), 10))
    .filter((n) => !Number.isNaN(n));
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

function parseManualStudentEntry({ studentId, studentName, number }) {
  const id = (studentId || '').split(' / ')[0].trim();
  const name = (studentName || '').trim();
  if (!id || !name) {
    throw new HttpError('Each participant needs a student ID and a name', 400);
  }
  const parsedNumber =
    number != null && String(number).trim() ? String(number).trim() : null;
  return { studentId: id, studentName: name, number: parsedNumber };
}

export async function appendStudents(id, entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new HttpError('Add at least one participant', 400);
  }

  try {
    const exam = await Exam.findById(id);
    if (!exam) {
      throw new HttpError('Exam not found', 404);
    }

    const existing = exam.students ?? [];
    const existingIds = new Set(existing.map((s) => s.studentId));
    const batchIds = new Set();
    const parsed = [];
    let nextNum = nextStudentNumber(existing);

    for (const entry of entries) {
      const row = parseManualStudentEntry(entry);
      if (batchIds.has(row.studentId) || existingIds.has(row.studentId)) {
        throw new HttpError(`Duplicate student ID: ${row.studentId}`, 400);
      }
      batchIds.add(row.studentId);
      if (!row.number) {
        row.number = String(nextNum++);
      }
      parsed.push(row);
    }

    return update(id, { students: [...existing, ...parsed] });
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(err.message, 400);
  }
}

export async function start(id, minute, resetToken) {
  try {
    const exam = await Exam.findById(id);
    if (!exam) {
      throw new HttpError('Exam not found', 404);
    }

    exam.startTime = new Date();
    exam.endTime = new Date(Date.now() + minute * 60 * 1000);

    if (resetToken) {
      exam.token = resetToken.toString();
      return await exam.save();
    }

    const MAX_RETRIES = 5;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      exam.token = Math.floor(100000 + Math.random() * 900000).toString();
      try {
        return await exam.save();
      } catch (e) {
        if (e?.code === 11000 && attempt < MAX_RETRIES) {
          continue;
        }
        throw e;
      }
    }
  } catch (error) {
    throw new HttpError(
      error.message || 'An error occurred while starting the exam.',
      error.status || 500
    );
  }
}

export async function countTime(id) {
  const exam = await findOneByID(id);
  if (!exam) {
    throw new Error(`Exam not found for ID ${id}`);
  }

  const end = new Date(exam.endTime);
  const start = new Date();
  const diffSeconds = (end.getTime() - start.getTime()) / 1000;
  return diffSeconds <= 0 ? 0 : diffSeconds;
}

export async function switchExam(id, body) {
  try {
    return await Exam.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true }
    ).exec();
  } catch (err) {
    throw new HttpError(err.message, 400);
  }
}

export async function getScoreTable(id) {
  try {
    const students = await getStudentByExamId(id);
    return students.map((student, index) => {
      const score = {
        no: index + 1,
        studentId: student.studentId,
        studentName: student.studentName,
        isSubmitted: student.isSubmitted,
        totalScore: extractScore(student.score).score,
        score: {},
      };

      if (student.score) {
        for (const item of student.score) {
          score.score[item.questionName.toString()] = {
            score: item.score,
            total: item.total,
            correct: item.correct,
          };
        }
      }

      return score;
    });
  } catch (err) {
    throw new HttpError(err.message, 400);
  }
}

export async function remove(id) {
  try {
    return await Exam.findOneAndDelete({ _id: id }).exec();
  } catch {
    throw new Error('An error occurred while deleting the exam.');
  }
}

export async function updateExamName(id, examName) {
  try {
    return await Exam.findOneAndUpdate(
      { _id: id },
      { examName },
      { new: true }
    ).exec();
  } catch (error) {
    throw new Error(`Failed to update exam: ${error.message}`);
  }
}

export async function updateExamScore(examId) {
  try {
    const students = await getStudentByExamId(examId);
    return Promise.all(
      students.map((student) =>
        getStudentScore({
          studentId: student.studentId,
          examId,
        })
      )
    );
  } catch (err) {
    throw new Error(`Failed to update exam: ${err.message}`);
  }
}

export async function getConfig(examId) {
  const exam = await Exam.findOne({ _id: examId }).exec();
  if (!exam) {
    return {
      isRandom: false,
      isShowScore: false,
      isShowAnswer: false,
    };
  }
  return {
    isRandom: exam.isRandom,
    isShowScore: exam.isShowScore,
    isShowAnswer: exam.isShowAnswer,
  };
}

export async function findOneByToken(token) {
  return Exam.findOne({ token }).exec();
}
