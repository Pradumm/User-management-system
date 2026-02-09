
import Assessment from '../models/Assessment.js';

/**
 * Syncs security logs in real-time as they occur in the frontend.
 */
export const syncLogs = async (req, res) => {
  const { attemptId, logs } = req.body;
  
  try {
    let assessment = await Assessment.findOne({ attemptId });
    
    if (!assessment) {
      assessment = new Assessment({ attemptId, logs });
    } else {
      // Append only new logs to prevent duplicates in the audit trail
      const existingIds = assessment.logs.map(l => l.id);
      const newLogs = logs.filter(l => !existingIds.includes(l.id));
      assessment.logs.push(...newLogs);
    }
    
    await assessment.save();
    res.status(200).json({ success: true, message: 'Logs synced successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Finalizes the assessment with answers and marks it as submitted.
 */
export const submitAssessment = async (req, res) => {
  const { attemptId, answers, logs } = req.body;
  
  try {
    const assessment = await Assessment.findOneAndUpdate(
      { attemptId },
      { 
        status: 'submitted', 
        answers, 
        logs, 
        submittedAt: new Date() 
      },
      { upsert: true, new: true }
    );
    
    res.status(200).json({ success: true, assessment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
