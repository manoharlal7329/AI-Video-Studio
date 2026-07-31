import fs from 'fs';
import path from 'path';

export const generateImage = async (prompt: string, jobId: string, sceneNumber: number, format = "9:16", quality = "1080p"): Promise<string> => {
  const encodedPrompt = encodeURIComponent(prompt);
  
  let width = 720;
  let height = 1280;

  if (format === "16:9") {
    width = quality === "1080p" ? 1920 : 1280;
    height = quality === "1080p" ? 1080 : 720;
  } else {
    // 9:16
    width = quality === "1080p" ? 1080 : 720;
    height = quality === "1080p" ? 1920 : 1280;
  }

  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random()*10000)}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch image from Pollinations AI");
  
  const buffer = await response.arrayBuffer();
  
  const tempDir = path.join(__dirname, '../../temp', jobId);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filePath = path.join(tempDir, `scene_${sceneNumber}.jpg`);
  fs.writeFileSync(filePath, Buffer.from(buffer));
  
  return filePath;
};
