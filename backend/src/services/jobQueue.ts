import { EventEmitter } from 'events';
import { generateScenes } from './geminiService';
import { generateImage } from './imageService';
import { generateAudio } from './audioService';
import { generateSubtitles } from './subtitleService';
import { stitchScene, concatScenes } from './ffmpegService';
import fs from 'fs';
import path from 'path';

// Interface for Job Details
export interface VideoJob {
  id: string;
  title: string;
  script: string;
  duration: string;
  language: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentTask: string;
  videoUrl?: string;
  error?: string;
  inputType?: string;
  format?: string;
  quality?: string;
  voice?: string;
  voiceFile?: string;
}

class JobQueue extends EventEmitter {
  private jobs: Map<string, VideoJob> = new Map();

  constructor() {
    super();
    this.on('newJob', this.processJob.bind(this));
  }

  public addJob(jobDetails: Omit<VideoJob, 'id' | 'status' | 'progress' | 'currentTask'>): string {
    const jobId = `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newJob: VideoJob = {
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

  public getJobStatus(jobId: string): VideoJob | undefined {
    return this.jobs.get(jobId);
  }

  public updateJobProgress(jobId: string, progress: number, task: string, status: VideoJob['status'] = 'processing', videoUrl?: string, error?: string) {
    const job = this.jobs.get(jobId);
    if (job) {
      job.progress = progress;
      job.currentTask = task;
      job.status = status;
      if (videoUrl) job.videoUrl = videoUrl;
      if (error) job.error = error;
      this.jobs.set(jobId, job);
    }
  }

  private async processJob(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job) return;

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
      const scenes = await generateScenes(job.script, job.language, job.duration, job.inputType);
      
      if (!scenes || scenes.length === 0) throw new Error("No scenes generated from AI.");
      
      const tempDir = path.join(__dirname, '../../temp', jobId);
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const sceneVideoPaths: string[] = [];
      const totalScenes = scenes.length;

      for (let i = 0; i < totalScenes; i++) {
        const scene = scenes[i];
        const sceneNum = scene.sceneNumber;
        
        console.log(`\n[JobQueue Stage 2] Processing Scene ${sceneNum}/${totalScenes}...`);
        
        // Calculate dynamic progress
        const baseProgress = 15 + (i / totalScenes) * 60;
        this.updateJobProgress(jobId, Math.floor(baseProgress), `Generating Image for Scene ${sceneNum}...`);
        
        console.log(`[JobQueue Stage 3] Generating Image via Pollinations AI. Prompt: "${scene.visual_description}"`);
        const imagePath = await generateImage(scene.visual_description, jobId, sceneNum, job.format, job.quality);
        
        this.updateJobProgress(jobId, Math.floor(baseProgress + 10), `Synthesizing Audio for Scene ${sceneNum}...`);
        console.log(`[JobQueue Stage 4] Generating TTS Audio via Google TTS. Text: "${scene.narration}"`);
        const audioPath = await generateAudio(scene.narration, job.language, jobId, sceneNum, job.voice, job.voiceFile);
        
        this.updateJobProgress(jobId, Math.floor(baseProgress + 12), `Generating Subtitles for Scene ${sceneNum}...`);
        console.log(`[JobQueue Stage 4.5] Generating SRT Subtitles...`);
        const srtPath = await generateSubtitles(scene.narration, scene.duration_seconds, jobId, sceneNum);
        
        this.updateJobProgress(jobId, Math.floor(baseProgress + 15), `Rendering Scene ${sceneNum}...`);
        console.log(`[JobQueue Stage 5] Stitching Image, Audio, and Subtitles via FFmpeg (Duration: ${scene.duration_seconds}s)...`);
        const sceneVideoPath = path.join(tempDir, `scene_${sceneNum}.mp4`);
        await stitchScene(imagePath, audioPath, srtPath, sceneVideoPath, scene.duration_seconds, job.format, job.quality);
        
        sceneVideoPaths.push(sceneVideoPath);
      }

      this.updateJobProgress(jobId, 85, 'Stitching all scenes together...');
      console.log(`\n[JobQueue Stage 6] Concatenating ${sceneVideoPaths.length} scenes into final MP4...`);
      const finalOutputPath = path.join(__dirname, '../../temp', `${jobId}.mp4`);
      await concatScenes(sceneVideoPaths, finalOutputPath, jobId);
      
      console.log(`[JobQueue Success] Pipeline finished successfully! File saved to: ${finalOutputPath}`);
      
      this.updateJobProgress(jobId, 100, 'Video completed', 'completed', `/api/videos/download/${jobId}`);
      
    } catch (error: any) {
      console.error(error);
      this.updateJobProgress(jobId, job.progress, 'Failed', 'failed', undefined, error.message);
    }
  }
}

export const jobQueue = new JobQueue();
