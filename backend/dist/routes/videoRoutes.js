"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videoController_1 = require("../controllers/videoController");
const statusController_1 = require("../controllers/statusController");
const downloadController_1 = require("../controllers/downloadController");
const router = (0, express_1.Router)();
router.post('/generate-video', videoController_1.generateVideo);
router.get('/status/:jobId', statusController_1.getJobStatus);
router.get('/download/:jobId', downloadController_1.downloadVideo);
exports.default = router;
//# sourceMappingURL=videoRoutes.js.map