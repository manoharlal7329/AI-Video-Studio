import fs from 'fs';
import path from 'path';

export const generateImage = async (prompt: string, jobId: string, sceneNumber: number): Promise<string> => {
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true`;
  
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
