"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVideo = void 0;
const jobQueue_1 = require("../services/jobQueue");
const generateVideo = (req, res) => {
    const { title, script, duration, language } = req.body;
    // Add to internal Node.js queue
    const jobId = jobQueue_1.jobQueue.addJob({ title, script, duration, language });
    res.json({
        success: true,
        message: 'Video generation job has been queued successfully.',
        jobId
    });
};
exports.generateVideo = generateVideo;
//# sourceMappingURL=videoController.js.map