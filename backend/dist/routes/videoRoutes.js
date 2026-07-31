"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videoController_1 = require("../controllers/videoController");
const statusController_1 = require("../controllers/statusController");
const downloadController_1 = require("../controllers/downloadController");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: 'temp/uploads/' });
const router = (0, express_1.Router)();
router.post('/generate-video', upload.single('voiceFile'), videoController_1.generateVideo);
router.get('/status/:jobId', statusController_1.getJobStatus);
router.get('/download/:jobId', downloadController_1.downloadVideo);
exports.default = router;
//# sourceMappingURL=videoRoutes.js.map