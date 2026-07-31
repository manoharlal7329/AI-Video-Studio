"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSubtitles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateSubtitles = async (text, durationSeconds, jobId, sceneNumber) => {
    const tempDir = path_1.default.join(__dirname, '../../temp', jobId);
    if (!fs_1.default.existsSync(tempDir)) {
        fs_1.default.mkdirSync(tempDir, { recursive: true });
    }
    const srtPath = path_1.default.join(tempDir, `scene_${sceneNumber}.srt`);
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
    fs_1.default.writeFileSync(srtPath, srtContent);
    return srtPath;
};
exports.generateSubtitles = generateSubtitles;
// Format seconds into HH:MM:SS,mmm for SRT
const formatTime = (seconds) => {
    const date = new Date(0);
    date.setSeconds(Math.floor(seconds));
    const timeString = date.toISOString().substring(11, 19);
    const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
    return `${timeString},${ms}`;
};
//# sourceMappingURL=subtitleService.js.map