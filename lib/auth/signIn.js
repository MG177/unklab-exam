import bcrypt from 'bcrypt';
import { connectDB } from '@/lib/db/connect';
import { User } from '@/lib/models/User';
import { Exam } from '@/lib/models/Exam';
import { signJwt } from '@/lib/auth/jwt';

export async function signUp(userData) {
  const { id, name, username, password, role } = userData;

  if (!id || !name || !username || !password) {
    return {
      error: 'bad_request',
      status: 400,
      message: 'Missing required fields',
    };
  }

  await connectDB();

  const existingUser = await User.findOne({ username }).exec();
  if (existingUser) {
    return {
      error: 'conflict',
      status: 500,
      message: 'User already exists',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await User.create({
    id,
    name,
    username,
    password: hashedPassword,
    role: role?.length ? role : ['admin'],
  });

  const obj = createdUser.toObject();
  delete obj.password;

  return { status: 201, body: obj };
}

export async function signInAdmin(username, password) {
  await connectDB();

  const user = await User.findOne({ username }).exec();
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: 'unauthorized', status: 401, message: 'Unauthorized' };
  }

  const payload = {
    username: user.username,
    id: user.id,
    role: [...user.role],
  };
  const access_token = await signJwt(payload);

  return {
    status: 200,
    body: {
      status: 'success',
      msg: 'Login success',
      data: {
        userId: user.id,
        name: user.name,
        username: user.name,
        role: user.role,
        access_token,
      },
    },
  };
}

export async function signInStudent(studentId, token) {
  try {
    await connectDB();

    const exam = await Exam.findOne({ token }).exec();

    if (!exam || exam.token !== token) {
      return { error: 'unauthorized', status: 401, message: '1' };
    }

    const endTime = new Date(exam.endTime);
    const timeNow = new Date();
    if (!exam.endTime || Number.isNaN(endTime.getTime()) || endTime < timeNow) {
      return { error: 'forbidden', status: 403, message: '3' };
    }

    const student = exam.students?.find(
      (s) => s.studentId.toUpperCase() === studentId.toUpperCase()
    );
    if (!student) {
      return { error: 'unauthorized', status: 401, message: '2' };
    }

    const payload = {
      studentName: String(student.studentName),
      studentId: String(student.studentId),
      examName: String(exam.examName),
      examId: exam._id.toString(),
      isRandom: Boolean(exam.isRandom),
      isShowAnswer: Boolean(exam.isShowAnswer),
      isShowScore: Boolean(exam.isShowScore),
      role: ['student'],
    };

    const access_token = await signJwt(payload);
    const splittedExamName = exam.examName.split('/');

    return {
      status: 200,
      body: {
        studentName: student.studentName,
        studentId: student.studentId,
        examId: exam._id,
        examName: splittedExamName[0].trim(),
        isRandom: exam.isRandom,
        isShowAnswer: exam.isShowAnswer,
        isShowScore: exam.isShowScore,
        access_token,
      },
    };
  } catch {
    return { error: 'unauthorized', status: 401, message: '1' };
  }
}
