"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatScenes = exports.stitchScene = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
if (ffmpeg_static_1.default) {
    fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
}
const stitchScene = (imagePath, audioPath, srtPath, outputPath, durationSeconds) => {
    return new Promise((resolve, reject) => {
        const frames = durationSeconds * 25; // 25 fps
        // Windows paths in FFmpeg filters need special escaping for colons and backslashes
        // e.g. C:\path\to\file.srt -> C\\:/path/to/file.srt
        const escapedSrtPath = srtPath.replace(/\\/g, '/').replace(/:/g, '\\\\:');
        (0, fluent_ffmpeg_1.default)()
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
exports.stitchScene = stitchScene;
const concatScenes = (scenePaths, finalOutputPath, jobId) => {
    return new Promise((resolve, reject) => {
        const tempDir = path_1.default.join(__dirname, '../../temp', jobId);
        const concatFilePath = path_1.default.join(tempDir, 'concat.txt');
        const fileContent = scenePaths.map(p => `file '${path_1.default.basename(p)}'`).join('\n');
        fs_1.default.writeFileSync(concatFilePath, fileContent);
        (0, fluent_ffmpeg_1.default)()
            .input(concatFilePath)
            .inputOptions(['-f concat', '-safe 0'])
            .outputOptions(['-c copy'])
            .save(finalOutputPath)
            .on('end', () => resolve(finalOutputPath))
            .on('error', (err) => reject(err));
    });
};
exports.concatScenes = concatScenes;
//# sourceMappingURL=ffmpegService.js.map