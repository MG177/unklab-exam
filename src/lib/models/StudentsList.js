import mongoose from 'mongoose';

const studentEntrySchema = new mongoose.Schema(
  {
    id: { type: String },
    noreg: { type: String },
    name: { type: String },
  },
  { _id: false }
);

const studentsListSchema = new mongoose.Schema(
  {
    examId: { type: String, required: true, unique: true },
    studentList: { type: [studentEntrySchema], required: true },
  },
  { timestamps: true }
);

export const StudentsList =
  mongoose.models.StudentsList ||
  mongoose.model('StudentsList', studentsListSchema);
