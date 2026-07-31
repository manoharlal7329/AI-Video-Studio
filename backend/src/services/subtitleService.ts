import fs from 'fs';
import path from 'path';

export const generateSubtitles = async (text: string, durationSeconds: number, jobId: string, sceneNumber: number): Promise<string> => {
  const tempDir = path.join(__dirname, '../../temp', jobId);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const srtPath = path.join(tempDir, `scene_${sceneNumber}.srt`);

  // Basic word-level chunking to simulate subtitles
  const words = text.split(' ');
  const totalWords = words.length;
  const timePerWord = durationSeconds / totalWords;
  
  let srtContent = '';
  let currentTime = 0;

  // We group words into chunks of 4 for subtitles
  const chunkSize = 4;
  let subIndex = 1;

  for (let i = 0; i < totalWords; i += chunkSize) {
    const chunkWords = words.slice(i, i + chunkSize);
    const chunkDuration = timePerWord * chunkWords.length;
    const endTime = currentTime + chunkDuration;

    srtContent += `${subIndex}\n`;
    srtContent += `${formatTime(currentTime)} --> ${formatTime(endTime)}\n`;
    srtContent += `${chunkWords.join(' ')}\n\n`;

    currentTime = endTime;
    subIndex++;
  }

  fs.writeFileSync(srtPath, srtContent);
  return srtPath;
};

// Format seconds into HH:MM:SS,mmm for SRT
const formatTime = (seconds: number): string => {
  const date = new Date(0);
  date.setSeconds(Math.floor(seconds));
  const timeString = date.toISOString().substring(11, 19);
  const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
  return `${timeString},${ms}`;
};
