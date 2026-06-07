import mongoose from 'mongoose';

const studentsSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    studentId: { type: String, required: true },
    examName: { type: String, required: true },
    examId: { type: String, required: true },
    isSubmitted: { type: Boolean, default: false },
    questionList: { type: Array, required: true },
    score: { type: Array },
  },
  { timestamps: true }
);

studentsSchema.index({ studentId: 1, examId: 1 });
studentsSchema.index({ examId: 1 });

export const Students =
  mongoose.models.Students || mongoose.model('Students', studentsSchema);
