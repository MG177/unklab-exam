import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    examName: { type: String, required: true },
    token: { type: String, unique: true },
    questions: { type: Array, default: [] },
    students: { type: Array, default: null },
    isRandom: { type: Boolean, default: false },
    isShowScore: { type: Boolean, default: true },
    isShowAnswer: { type: Boolean, default: false },
    startTime: { type: Date },
    endTime: { type: Date },
  },
  { timestamps: true }
);

examSchema.index({ createdAt: -1 });

export const Exam = mongoose.models.Exam || mongoose.model('Exam', examSchema);
