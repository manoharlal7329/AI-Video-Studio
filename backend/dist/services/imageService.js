"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateImage = async (prompt, jobId, sceneNumber) => {
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true`;
    const response = await fetch(url);
    if (!response.ok)
        throw new Error("Failed to fetch image from Pollinations AI");
    const buffer = await response.arrayBuffer();
    const tempDir = path_1.default.join(__dirname, '../../temp', jobId);
    if (!fs_1.default.existsSync(tempDir)) {
        fs_1.default.mkdirSync(tempDir, { recursive: true });
    }
    const filePath = path_1.default.join(tempDir, `scene_${sceneNumber}.jpg`);
    fs_1.default.writeFileSync(filePath, Buffer.from(buffer));
    return filePath;
};
exports.generateImage = generateImage;
//# sourceMappingURL=imageService.js.map