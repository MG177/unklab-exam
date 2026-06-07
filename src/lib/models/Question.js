import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    questionName: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    questions: { type: Array, default: null },
  },
  { timestamps: true }
);

questionSchema.index({ createdAt: -1 });

export const Question =
  mongoose.models.Question || mongoose.model('Question', questionSchema);
