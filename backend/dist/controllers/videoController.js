"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideo = void 0;
const jobQueue_1 = require("../services/jobQueue");
const generateVideo = (req, res) => {
    const { title, script, duration, language, inputType, format, quality, voice } = req.body;
    const voiceFile = req.file ? req.file.path : undefined;
    // Add to internal Node.js queue
    const jobId = jobQueue_1.jobQueue.addJob({
        title, script, duration, language,
        inputType: inputType || 'prompt',
        format: format || '9:16',
        quality: quality || '1080p',
        voice: voice || 'male',
        voiceFile
    });
    res.json({
        success: true,
        message: 'Video generation job has been queued successfully.',
        jobId
    });
};
exports.generateVideo = generateVideo;
//# sourceMappingURL=videoController.js.map