import mongoose from 'mongoose';
import { connectDB } from '@/lib/db/connect';
import { Exam } from '@/lib/models/Exam';
import { Question } from '@/lib/models/Question';
import { Students } from '@/lib/models/Students';

const SUBMIT_GRACE_MS = 2 * 60 * 1000;

async function findExamById(id) {
  await connectDB();
  return Exam.findOne({ _id: id }).exec();
}

async function provideQuestionsList(questionId, questionName, quantity) {
  await connectDB();
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
          questionId: questionId,
          questionName: questionName,
        },
      },
    },
  ]);
}

export async function getStudentData(user) {
  await connectDB();
  const student = await Students.findOne({
    studentId: user.studentId,
    examId: user.examId,
  }).exec();
  if (!student) {
    throw Object.assign(new Error('Student not found'), { status: 404 });
  }
  return student;
}

export async function startStudent(user) {
  await connectDB();

  try {
    const existingStudent = await Students.findOne({
      studentId: user.studentId,
      examId: user.examId,
    }).exec();

    if (existingStudent) {
      existingStudent.questionList = undefined;
      return existingStudent;
    }

    const student = new Students({
      studentName: user.studentName,
      studentId: user.studentId,
      examName: user.examName,
      examId: user.examId,
      questionList: [],
      score: null,
    });

    const exam = await findExamById(student.examId);
    if (!exam) {
      throw Object.assign(new Error('Exam not found'), { status: 404 });
    }

    const questionsList = await Promise.all(
      exam.questions.map((question) =>
        provideQuestionsList(
          question._id,
          question.questionName,
          question.quantity
        )
      )
    );

    const flattenedQuestionsList = questionsList.flat();

    const arraySort = Array.from(
      { length: flattenedQuestionsList.length },
      (_, i) => i + 1
    );

    if (user.isRandom) {
      arraySort.sort(() => Math.random() - 0.5);
    }

    student.questionList = arraySort.map((index, i) => {
      const question = flattenedQuestionsList[index - 1];
      const randomizedOptions = user.isRandom
        ? [...question.options].sort(() => Math.random() - 0.5)
        : question.options;
      return {
        id: i + 1,
        text: question.text,
        answer: null,
        correctAnswer: question.correctAnswer,
        options: randomizedOptions.map((option) => ({
          id: option.id,
          text: option.text,
        })),
        image: question.image || null,
        audio: question.audio || null,
        questionOrigin: {
          questionId: question.questionOrigin.questionId,
          questionName: question.questionOrigin.questionName,
        },
      };
    });

    const data = await Students.findOneAndUpdate(
      { studentId: user.studentId, examId: user.examId },
      student,
      { upsert: true, new: true }
    );
    data.questionList = undefined;
    return data;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw Object.assign(
      new Error('Error when starting the student exam'),
      { status: 500, cause: error }
    );
  }
}

export async function getStudentQuestion(user) {
  await connectDB();

  try {
    const student = await Students.findOne({
      studentId: user.studentId,
      examId: user.examId,
    }).exec();
    if (!student) {
      throw Object.assign(new Error('Student not found'), { status: 404 });
    }

    return student.questionList.map((question) => {
      const sanitized =
        typeof question.toObject === 'function'
          ? question.toObject()
          : { ...question };
      delete sanitized.correctAnswer;
      delete sanitized.questionOrigin;
      return sanitized;
    });
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw Object.assign(new Error('Error when getting question exam'), {
      status: 500,
      cause: error,
    });
  }
}

async function assertExamOpen(examId, graceMs = 0) {
  await connectDB();
  const exam = await Exam.findById(examId).select('endTime').lean();
  const open =
    exam?.endTime &&
    Date.now() <= new Date(exam.endTime).getTime() + graceMs;
  if (!open) {
    throw Object.assign(new Error('Exam has ended'), { status: 403 });
  }
}

export async function studentAnswer(user, i, newAnswer) {
  if (newAnswer === null || newAnswer === undefined) {
    throw Object.assign(new Error('newAnswer is required'), { status: 400 });
  }
  const idx = Number(i);
  if (!Number.isInteger(idx) || idx < 0) {
    throw Object.assign(new Error('Invalid question index'), { status: 400 });
  }

  await assertExamOpen(user.examId);
  await connectDB();

  const { matchedCount } = await Students.updateOne(
    {
      studentId: user.studentId,
      examId: user.examId,
      [`questionList.${idx}`]: { $exists: true },
    },
    { $set: { [`questionList.${idx}.answer`]: newAnswer } }
  ).exec();

  if (matchedCount === 0) {
    throw Object.assign(new Error('Invalid question index'), { status: 400 });
  }
  return true;
}

export async function studentBookmark(user, i, isBookmark) {
  const idx = Number(i);
  if (!Number.isInteger(idx) || idx < 0) {
    throw Object.assign(new Error('Invalid question index'), { status: 400 });
  }

  await connectDB();

  const { matchedCount } = await Students.updateOne(
    {
      studentId: user.studentId,
      examId: user.examId,
      [`questionList.${idx}`]: { $exists: true },
    },
    { $set: { [`questionList.${idx}.isBookmark`]: isBookmark } }
  ).exec();

  if (matchedCount === 0) {
    throw Object.assign(new Error('Invalid question index'), { status: 400 });
  }

  return isBookmark;
}

function getQuestionType(questionsList) {
  return questionsList
    .map((question) => question.questionOrigin)
    .filter(
      (question, index, self) =>
        index ===
        self.findIndex((t) => t.questionId === question.questionId)
    );
}

export async function getStudentScore(user) {
  await connectDB();

  const student = await Students.findOne({
    studentId: user.studentId,
    examId: user.examId,
  }).exec();
  if (!student) {
    throw Object.assign(new Error('Student not found'), { status: 404 });
  }

  const questionList = student.questionList;
  const questionType = getQuestionType(questionList);

  const updatedScore = questionType.map((type) => {
    const questionByType = questionList.filter(
      (question) => question.questionOrigin.questionId === type.questionId
    );
    const correctAnswer = questionByType.filter(
      (question) => question.answer === question.correctAnswer
    );
    const correct = correctAnswer.length;
    const totalQuestion = questionByType.length;
    const score =
      totalQuestion > 0 ? (correct / totalQuestion) * 100 : 0;

    return {
      questionName: type.questionName,
      total: totalQuestion,
      correct,
      score: Math.round(score),
    };
  });

  return Students.findOneAndUpdate(
    { studentId: user.studentId, examId: user.examId },
    { $set: { score: updatedScore } },
    { new: true }
  );
}

export function extractScore(objArray) {
  const count = { total: 0, correct: 0, score: 0 };
  if (objArray === null || objArray === undefined || objArray.length === 0) {
    return count;
  }

  for (const obj of objArray) {
    count.total += obj.total || 0;
    count.correct += obj.correct || 0;
  }

  if (count.total > 0) {
    count.score = Math.round((count.correct / count.total) * 100);
  }

  return count;
}

export async function submitStudent(user) {
  await assertExamOpen(user.examId, SUBMIT_GRACE_MS);
  await connectDB();

  await Students.findOneAndUpdate(
    { studentId: user.studentId, examId: user.examId },
    { $set: { isSubmitted: true } },
    { new: true }
  ).exec();

  return true;
}

export async function findOne(studentId, examId) {
  await connectDB();
  return Students.findOne({ studentId, examId }).exec();
}

export async function remove(studentId, examId) {
  await connectDB();
  return Students.findOneAndDelete({ studentId, examId }).exec();
}
