import * as googleTTS from 'google-tts-api';
import fs from 'fs';
import path from 'path';

export const generateAudio = async (text: string, language: string, jobId: string, sceneNumber: number): Promise<string> => {
  const tempDir = path.join(__dirname, '../../temp', jobId);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filePath = path.join(tempDir, `scene_${sceneNumber}.mp3`);
  
  try {
    const base64Audio = await googleTTS.getAudioBase64(text, {
      lang: language === 'hi' ? 'hi' : 'en',
      slow: false,
      host: 'https://translate.google.com',
    });
    
    fs.writeFileSync(filePath, Buffer.from(base64Audio, 'base64'));
    return filePath;
  } catch (error) {
    console.error("TTS Error:", error);
    throw new Error("Failed to generate audio");
  }
};
