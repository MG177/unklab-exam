import mongoose from 'mongoose';
import { parse } from 'csv-parse';
import * as XLSX from 'xlsx';
import { Question } from '@/lib/models/Question';

export const MAX_IMPORT_BYTES = 4 * 1024 * 1024;

const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];
const ALLOWED_MIME_TYPES = [
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/octet-stream',
];

export class QuestionsServiceError extends Error {
  constructor(message, statusCode = 400, body = null) {
    super(message);
    this.name = 'QuestionsServiceError';
    this.statusCode = statusCode;
    this.body = body;
  }
}

export async function create(questionName) {
  try {
    return await Question.create({
      questionName,
      questions: null,
    });
  } catch (error) {
    throw new Error(`Failed to create question: ${error.message}`);
  }
}

export async function findAll(page, limit) {
  if (page !== undefined || limit !== undefined) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, parseInt(limit, 10) || 20);
    const [data, total] = await Promise.all([
      Question.find()
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l)
        .exec(),
      Question.countDocuments().exec(),
    ]);
    return { data, total, page: p, limit: l };
  }
  return Question.find().sort({ createdAt: -1 }).exec();
}

export async function findOne(id) {
  return Question.findOne({ _id: id }).exec();
}

export async function updateQuestionName(id, questionName) {
  try {
    return Question.findOneAndUpdate(
      { _id: id },
      { questionName },
      { new: true }
    ).exec();
  } catch (error) {
    throw new Error(`Failed to update question: ${error.message}`);
  }
}

export async function updateQuestions(id, updateQuestionDto) {
  try {
    return Question.findOneAndUpdate({ _id: id }, updateQuestionDto, {
      new: true,
    }).exec();
  } catch (error) {
    throw new Error(`Failed to update question: ${error.message}`);
  }
}

export async function verify(questions) {
  try {
    questions.forEach((q, index) => {
      if (q.text === undefined || q.text === null || q.text === '') {
        throw new QuestionsServiceError(
          `In Question #${index + 1}, Text is required`,
          400,
          {
            statusCode: 400,
            message: `In Question #${index + 1}, Text is required`,
            error: true,
          }
        );
      }

      q.options.forEach((o) => {
        if (o.text === undefined || o.text === null || o.text === '') {
          throw new QuestionsServiceError(
            `In Question #${index + 1}, Option text is required`,
            400,
            {
              statusCode: 400,
              message: `In Question #${index + 1}, Option text is required`,
              error: true,
            }
          );
        }
      });

      if (q.correctAnswer === undefined || q.correctAnswer === null) {
        throw new QuestionsServiceError(
          `In Question #${index + 1}, Correct Answer is required`,
          400,
          {
            statusCode: 400,
            message: `In Question #${index + 1}, Correct Answer is required`,
            error: true,
          }
        );
      }
    });

    return {
      statusCode: 200,
      message: 'Verified',
      error: false,
    };
  } catch (res) {
    if (res instanceof QuestionsServiceError) {
      return res.body;
    }
    if (res.body) {
      return res.body;
    }
    return {
      statusCode: res.statusCode || 400,
      message: res.message || String(res),
      error: true,
    };
  }
}

export async function remove(id) {
  return Question.findOneAndDelete({ _id: id }).exec();
}

export async function provideQuestionsList(questionId, questionName, quantity) {
  return Question.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(questionId),
      },
    },
    { $project: { questions: 1 } },
    { $unwind: '$questions' },
    { $sample: { size: quantity } },
    { $project: { _id: 0, questions: 1 } },
    { $replaceRoot: { newRoot: '$questions' } },
    {
      $addFields: {
        questionOrigin: {
          questionId,
          questionName,
        },
      },
    },
  ]);
}

function normalizeKey(key) {
  return String(key)
    .toLowerCase()
    .replace(/[\s_]+/g, '');
}

function rowsToQuestions(records) {
  const questions = [];

  records.forEach((rawRow, idx) => {
    const rowNumber = idx + 2;

    const row = {};
    for (const k of Object.keys(rawRow)) {
      row[normalizeKey(k)] = rawRow[k];
    }

    const text = String(row.text ?? row.question ?? '').trim();

    const optionCells = [
      row.option1 ?? row.optiona ?? row.a,
      row.option2 ?? row.optionb ?? row.b,
      row.option3 ?? row.optionc ?? row.c,
      row.option4 ?? row.optiond ?? row.d,
      row.option5 ?? row.optione ?? row.e,
    ];
    const options = optionCells
      .map((v, i) => ({
        id: i + 1,
        text: v == null ? '' : String(v).trim(),
      }))
      .filter((o) => o.text !== '');

    const correctRaw = row.correctanswer ?? row.answer ?? row.correct;
    const correctAnswer = parseInt(String(correctRaw), 10);

    if (text === '' && options.length === 0 && Number.isNaN(correctAnswer)) {
      return;
    }

    if (text === '') {
      throw new QuestionsServiceError(
        `Row ${rowNumber}: question text is required`
      );
    }
    if (options.length < 2) {
      throw new QuestionsServiceError(
        `Row ${rowNumber}: at least 2 options are required`
      );
    }
    if (
      Number.isNaN(correctAnswer) ||
      correctAnswer < 1 ||
      correctAnswer > options.length
    ) {
      throw new QuestionsServiceError(
        `Row ${rowNumber}: correctAnswer must be an option number between 1 and ${options.length}`
      );
    }

    questions.push({
      id: questions.length + 1,
      text,
      correctAnswer,
      options,
      audio: row.audio ? String(row.audio).trim() : null,
      image: row.image ? String(row.image).trim() : null,
    });
  });

  if (questions.length === 0) {
    throw new QuestionsServiceError('No questions found in the uploaded file');
  }

  return questions;
}

async function extractQuestionFromCSV(buffer) {
  const records = await new Promise((resolve, reject) => {
    const out = [];
    const parser = parse({
      columns: true,
      delimiter: [',', ';'],
      trim: true,
      skip_empty_lines: true,
      relax_column_count: true,
      bom: true,
    });
    parser.on('readable', () => {
      let rec;
      while ((rec = parser.read())) out.push(rec);
    });
    parser.on('error', reject);
    parser.on('end', () => resolve(out));
    parser.write(buffer);
    parser.end();
  });
  return rowsToQuestions(records);
}

async function extractQuestionFromXLSX(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const records = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  return rowsToQuestions(records);
}

function assertAllowedUpload(fileName, mimeType) {
  const lower = (fileName || '').toLowerCase();
  const ext = lower.includes('.') ? lower.slice(lower.lastIndexOf('.')) : '';
  if (
    ALLOWED_EXTENSIONS.includes(ext) ||
    ALLOWED_MIME_TYPES.includes(mimeType || '')
  ) {
    return;
  }
  throw new QuestionsServiceError('Only .csv and .xlsx files are allowed');
}

export async function importQuestion(file, id) {
  if (!file) {
    throw new QuestionsServiceError('No file uploaded');
  }

  const name = (file.name || '').toLowerCase();
  assertAllowedUpload(name, file.type);

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_IMPORT_BYTES) {
    throw new QuestionsServiceError('File too large', 413);
  }

  const isXlsx =
    name.endsWith('.xlsx') ||
    name.endsWith('.xls') ||
    (file.type || '').includes('spreadsheet') ||
    (file.type || '').includes('excel');

  const questions = isXlsx
    ? await extractQuestionFromXLSX(buffer)
    : await extractQuestionFromCSV(buffer);

  return updateQuestions(id, {
    questions,
    isVerified: true,
  });
}
