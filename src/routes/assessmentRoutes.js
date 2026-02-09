
import express from 'express';
import { syncLogs, submitAssessment } from '../controllers/assessmentController.js';

const router = express.Router();

// Route for real-time log synchronization
router.post('/sync', syncLogs);

// Route for final test submission
router.post('/submit', submitAssessment);

export default router;
