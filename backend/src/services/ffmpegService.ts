import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

export const stitchScene = (imagePath: string, audioPath: string, srtPath: string, outputPath: string, durationSeconds: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const frames = durationSeconds * 25; // 25 fps
    
    // Windows paths in FFmpeg filters need special escaping for colons and backslashes
    // e.g. C:\path\to\file.srt -> C\\:/path/to/file.srt
    const escapedSrtPath = srtPath.replace(/\\/g, '/').replace(/:/g, '\\\\:');
    
    ffmpeg()
      .input(imagePath)
      .loop(1)
      .input(audioPath)
      // Apply zoompan and subtitles in a complex filter graph
      .complexFilter([
        `[0:v]zoompan=z='min(zoom+0.0015,1.5)':d=${frames}:s=1280x720[v_zoomed]`,
        `[v_zoomed]subtitles=${escapedSrtPath}[v_final]`
      ])
      .outputOptions([
        '-map [v_final]',
        '-map 1:a',
        '-c:v libx264',
        '-c:a aac',
        '-b:a 192k',
        '-pix_fmt yuv420p',
        `-t ${durationSeconds}` // Force exact duration
      ])
      .save(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err));
  });
};

export const concatScenes = (scenePaths: string[], finalOutputPath: string, jobId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(__dirname, '../../temp', jobId);
    const concatFilePath = path.join(tempDir, 'concat.txt');
    
    const fileContent = scenePaths.map(p => `file '${path.basename(p)}'`).join('\n');
    fs.writeFileSync(concatFilePath, fileContent);

    ffmpeg()
      .input(concatFilePath)
      .inputOptions(['-f concat', '-safe 0'])
      .outputOptions(['-c copy'])
      .save(finalOutputPath)
      .on('end', () => resolve(finalOutputPath))
      .on('error', (err) => reject(err));
  });
};
