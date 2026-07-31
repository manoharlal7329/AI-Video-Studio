import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export const downloadVideo = (req: Request<{ jobId: string }>, res: Response) => {
  const { jobId } = req.params;
  
  // __dirname is backend/src/controllers
  // So ../../temp goes to backend/temp
  const filePath = path.join(__dirname, '../../temp', `${jobId}.mp4`);

  console.log(`[Download API] Absolute output path requested: ${filePath}`);
  
  const fileExists = fs.existsSync(filePath);
  console.log(`[Download API] File exists: ${fileExists}`);

  if (!fileExists) {
    return res.status(404).json({ success: false, message: 'Generated video not found' });
  }

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Disposition', `attachment; filename="generated-video-${jobId}.mp4"`);

  res.download(filePath, `generated-video-${jobId}.mp4`, (err) => {
    if (err) {
      console.error("[Download API] Error streaming file:", err);
      if (!res.headersSent) {
        res.status(500).send("Error downloading file");
      }
    }
  });
};
