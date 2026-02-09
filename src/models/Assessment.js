
import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  id: String,
  type: String,
  timestamp: Number,
  questionId: String,
  metadata: Object
});

const assessmentSchema = new mongoose.Schema({
  attemptId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'submitted'], default: 'active' },
  logs: [logSchema],
  answers: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  submittedAt: Date
});

export default mongoose.model('Assessment', assessmentSchema);
