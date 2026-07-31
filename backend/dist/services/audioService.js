"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAudio = void 0;
const googleTTS = __importStar(require("google-tts-api"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateAudio = async (text, language, jobId, sceneNumber) => {
    const tempDir = path_1.default.join(__dirname, '../../temp', jobId);
    if (!fs_1.default.existsSync(tempDir)) {
        fs_1.default.mkdirSync(tempDir, { recursive: true });
    }
    const filePath = path_1.default.join(tempDir, `scene_${sceneNumber}.mp3`);
    try {
        const base64Audio = await googleTTS.getAudioBase64(text, {
            lang: language === 'hi' ? 'hi' : 'en',
            slow: false,
            host: 'https://translate.google.com',
        });
        fs_1.default.writeFileSync(filePath, Buffer.from(base64Audio, 'base64'));
        return filePath;
    }
    catch (error) {
        console.error("TTS Error:", error);
        throw new Error("Failed to generate audio");
    }
};
exports.generateAudio = generateAudio;
//# sourceMappingURL=audioService.js.map