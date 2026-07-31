import { Router } from 'express';
import { generateVideo } from '../controllers/videoController';
import { getJobStatus } from '../controllers/statusController';
import { downloadVideo } from '../controllers/downloadController';

const router = Router();

router.post('/generate-video', generateVideo);
router.get('/status/:jobId', getJobStatus);
router.get('/download/:jobId', downloadVideo);

export default router;
