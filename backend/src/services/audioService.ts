import * as googleTTS from 'google-tts-api';
import fs from 'fs';
import path from 'path';

export const generateAudio = async (text: string, language: string, jobId: string, sceneNumber: number, voice = 'male', voiceFile?: string): Promise<string> => {
  const tempDir = path.join(__dirname, '../../temp', jobId);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filePath = path.join(tempDir, `scene_${sceneNumber}.mp3`);
  
  // Note: True voice cloning requires heavy AI. For now, we mock it by using a standard TTS.
  if (voice === 'custom' && voiceFile) {
    console.log(`[AudioService] Custom voice file uploaded at ${voiceFile}. Simulating voice cloning...`);
  }

  // Google TTS doesn't have strict gender controls via this API, but we can simulate different accents.
  let langCode = language === 'hi' ? 'hi' : 'en';
  if (language === 'en' && voice === 'female') langCode = 'en-US';
  if (language === 'en' && voice === 'male') langCode = 'en-GB';

  try {
    const base64Audio = await googleTTS.getAudioBase64(text, {
      lang: langCode,
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
