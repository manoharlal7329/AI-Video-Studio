import { Request, Response } from 'express';
import { jobQueue } from '../services/jobQueue';

export const generateVideo = (req: Request, res: Response) => {
  try {
    const { title, script, duration, language, inputType, format, quality, voice } = req.body;
    const voiceFile = req.file ? req.file.path : undefined;

    // Add to internal Node.js queue
    const jobId = jobQueue.addJob({ 
      title, script, duration, language, 
      inputType: inputType || 'prompt', 
      format: format || '9:16', 
      quality: quality || '1080p', 
      voice: voice || 'male',
      voiceFile
    });

    res.json({
      success: true,
      message: 'Video generation job has been queued successfully.',
      jobId
    });
  } catch (error: any) {
    console.error('Error queuing job:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};
