import express from 'express';
import cors from 'cors';
import path from 'path';
import videoRoutes from './routes/videoRoutes';

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files (Generated videos) from temp directory
// __dirname is src/
app.use('/temp', express.static(path.join(__dirname, '../temp')));

// Health API
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Video APIs
app.use('/api/videos', videoRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: err.toString()
  });
});

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Backend server is running on http://127.0.0.1:${PORT}`);
});
