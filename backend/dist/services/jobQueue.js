"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobQueue = void 0;
const events_1 = require("events");
const geminiService_1 = require("./geminiService");
const imageService_1 = require("./imageService");
const audioService_1 = require("./audioService");
const subtitleService_1 = require("./subtitleService");
const ffmpegService_1 = require("./ffmpegService");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class JobQueue extends events_1.EventEmitter {
    jobs = new Map();
    constructor() {
        super();
        this.on('newJob', this.processJob.bind(this));
    }
    addJob(jobDetails) {
        const jobId = `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const newJob = {
            ...jobDetails,
            id: jobId,
            status: 'queued',
            progress: 0,
            currentTask: 'Waiting in queue...'
        };
        this.jobs.set(jobId, newJob);
        this.emit('newJob', jobId);
        return jobId;
    }
    getJobStatus(jobId) {
        return this.jobs.get(jobId);
    }
    updateJobProgress(jobId, progress, task, status = 'processing', videoUrl, error) {
        const job = this.jobs.get(jobId);
        if (job) {
            job.progress = progress;
            job.currentTask = task;
            job.status = status;
            if (videoUrl)
                job.videoUrl = videoUrl;
            if (error)
                job.error = error;
            this.jobs.set(jobId, job);
        }
    }
    async processJob(jobId) {
        const job = this.jobs.get(jobId);
        if (!job)
            return;
        console.log(`\n==============================================`);
        console.log(`[JobQueue] Starting Pipeline for Job: ${jobId}`);
        console.log(`[JobQueue] Title: ${job.title}`);
        console.log(`[JobQueue] Script: ${job.script}`);
        console.log(`[JobQueue] Target Duration: ${job.duration}s`);
        console.log(`[JobQueue] Language: ${job.language}`);
        console.log(`==============================================\n`);
        try {
            this.updateJobProgress(jobId, 10, 'Generating Script and Scenes (Gemini API)...');
            console.log(`[JobQueue Stage 1] Fetching AI Scenes from Gemini...`);
            const scenes = await (0, geminiService_1.generateScenes)(job.script, job.language, job.duration);
            if (!scenes || scenes.length === 0)
                throw new Error("No scenes generated from AI.");
            const tempDir = path_1.default.join(__dirname, '../../temp', jobId);
            if (!fs_1.default.existsSync(tempDir))
                fs_1.default.mkdirSync(tempDir, { recursive: true });
            const sceneVideoPaths = [];
            const totalScenes = scenes.length;
            for (let i = 0; i < totalScenes; i++) {
                const scene = scenes[i];
                const sceneNum = scene.sceneNumber;
                console.log(`\n[JobQueue Stage 2] Processing Scene ${sceneNum}/${totalScenes}...`);
                // Calculate dynamic progress
                const baseProgress = 15 + (i / totalScenes) * 60;
                this.updateJobProgress(jobId, Math.floor(baseProgress), `Generating Image for Scene ${sceneNum}...`);
                console.log(`[JobQueue Stage 3] Generating Image via Pollinations AI. Prompt: "${scene.visual_description}"`);
                const imagePath = await (0, imageService_1.generateImage)(scene.visual_description, jobId, sceneNum);
                this.updateJobProgress(jobId, Math.floor(baseProgress + 10), `Synthesizing Audio for Scene ${sceneNum}...`);
                console.log(`[JobQueue Stage 4] Generating TTS Audio via Google TTS. Text: "${scene.narration}"`);
                const audioPath = await (0, audioService_1.generateAudio)(scene.narration, job.language, jobId, sceneNum);
                this.updateJobProgress(jobId, Math.floor(baseProgress + 12), `Generating Subtitles for Scene ${sceneNum}...`);
                console.log(`[JobQueue Stage 4.5] Generating SRT Subtitles...`);
                const srtPath = await (0, subtitleService_1.generateSubtitles)(scene.narration, scene.duration_seconds, jobId, sceneNum);
                this.updateJobProgress(jobId, Math.floor(baseProgress + 15), `Rendering Scene ${sceneNum}...`);
                console.log(`[JobQueue Stage 5] Stitching Image, Audio, and Subtitles via FFmpeg (Duration: ${scene.duration_seconds}s)...`);
                const sceneVideoPath = path_1.default.join(tempDir, `scene_${sceneNum}.mp4`);
                await (0, ffmpegService_1.stitchScene)(imagePath, audioPath, srtPath, sceneVideoPath, scene.duration_seconds);
                sceneVideoPaths.push(sceneVideoPath);
            }
            this.updateJobProgress(jobId, 85, 'Stitching all scenes together...');
            console.log(`\n[JobQueue Stage 6] Concatenating ${sceneVideoPaths.length} scenes into final MP4...`);
            const finalOutputPath = path_1.default.join(__dirname, '../../temp', `${jobId}.mp4`);
            await (0, ffmpegService_1.concatScenes)(sceneVideoPaths, finalOutputPath, jobId);
            console.log(`[JobQueue Success] Pipeline finished successfully! File saved to: ${finalOutputPath}`);
            this.updateJobProgress(jobId, 100, 'Video completed', 'completed', `http://localhost:5000/api/videos/download/${jobId}`);
        }
        catch (error) {
            console.error(error);
            this.updateJobProgress(jobId, job.progress, 'Failed', 'failed', undefined, error.message);
        }
    }
}
exports.jobQueue = new JobQueue();
//# sourceMappingURL=jobQueue.js.map