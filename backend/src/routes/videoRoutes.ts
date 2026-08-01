import { Router } from 'express';
import { generateVideo } from '../controllers/videoController';
import { getJobStatus } from '../controllers/statusController';
import { downloadVideo } from '../controllers/downloadController';
import fs from 'fs';
import path from 'path';

import multer from 'multer';

const uploadDir = path.join(process.cwd(), 'temp', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

const router = Router();

router.post('/generate-video', upload.single('voiceFile'), generateVideo);
router.get('/status/:jobId', getJobStatus);
router.get('/download/:jobId', downloadVideo);

export default router;
