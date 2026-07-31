import { Router } from 'express';
import { generateVideo } from '../controllers/videoController';
import { getJobStatus } from '../controllers/statusController';
import { downloadVideo } from '../controllers/downloadController';

import multer from 'multer';

const upload = multer({ dest: 'temp/uploads/' });
const router = Router();

router.post('/generate-video', upload.single('voiceFile'), generateVideo);
router.get('/status/:jobId', getJobStatus);
router.get('/download/:jobId', downloadVideo);

export default router;
