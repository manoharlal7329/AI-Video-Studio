"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobStatus = void 0;
const jobQueue_1 = require("../services/jobQueue");
const getJobStatus = (req, res) => {
    const { jobId } = req.params;
    const job = jobQueue_1.jobQueue.getJobStatus(jobId);
    if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({
        success: true,
        job
    });
};
exports.getJobStatus = getJobStatus;
//# sourceMappingURL=statusController.js.map