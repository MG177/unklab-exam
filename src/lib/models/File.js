import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    base64: { type: String },
    path: { type: String },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

export const File =
  mongoose.models.Files || mongoose.model('Files', fileSchema);
