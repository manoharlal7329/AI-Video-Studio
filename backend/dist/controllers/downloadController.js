"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadVideo = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const downloadVideo = (req, res) => {
    const { jobId } = req.params;
    // __dirname is backend/src/controllers
    // So ../../temp goes to backend/temp
    const filePath = path_1.default.join(__dirname, '../../temp', `${jobId}.mp4`);
    console.log(`[Download API] Absolute output path requested: ${filePath}`);
    const fileExists = fs_1.default.existsSync(filePath);
    console.log(`[Download API] File exists: ${fileExists}`);
    if (!fileExists) {
        return res.status(404).json({ success: false, message: 'Generated video not found' });
    }
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="generated-video-${jobId}.mp4"`);
    res.download(filePath, `generated-video-${jobId}.mp4`, (err) => {
        if (err) {
            console.error("[Download API] Error streaming file:", err);
            if (!res.headersSent) {
                res.status(500).send("Error downloading file");
            }
        }
    });
};
exports.downloadVideo = downloadVideo;
//# sourceMappingURL=downloadController.js.map