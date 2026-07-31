import { Request, Response } from 'express';
import { jobQueue } from '../services/jobQueue';

export const getJobStatus = (req: Request, res: Response) => {
  const { jobId } = req.params;
  
  const job = jobQueue.getJobStatus(jobId);
  
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  res.json({
    success: true,
    job
  });
};
