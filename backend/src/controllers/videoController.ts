import { Request, Response } from 'express';
import { jobQueue } from '../services/jobQueue';

export const generateVideo = (req: Request, res: Response) => {
  const { title, script, duration, language } = req.body;

  // Add to internal Node.js queue
  const jobId = jobQueue.addJob({ title, script, duration, language });

  res.json({
    success: true,
    message: 'Video generation job has been queued successfully.',
    jobId
  });
};
