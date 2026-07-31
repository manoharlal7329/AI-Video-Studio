import express from 'express';
import cors from 'cors';
import path from 'path';
import videoRoutes from './routes/videoRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
