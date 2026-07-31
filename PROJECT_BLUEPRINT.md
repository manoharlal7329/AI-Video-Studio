# AI Video Studio - Project Blueprint

## 1. Project Overview
"AI Video Studio" is a production-ready SaaS application that completely automates video generation from scripts using 100% free and open-source technologies.

## 2. Technology Stack Details
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Shadcn UI.
- **Backend**: Node.js, Express.js.
- **Database & Auth**: Supabase (PostgreSQL, Supabase Auth).
- **Storage**: Local File System (Images, Audio, Video, Subtitles).
- **Task Queue**: Native Node.js `EventEmitter` or in-memory queue.
- **Automation**: Self-hosted n8n for workflow integrations (YouTube, Instagram, Facebook, TikTok).
- **Containerization**: Docker & Docker Compose.

## 3. AI Pipeline Specifications
- **Script Analysis**: Google Gemini API (Free Tier).
  - *Goal*: Split text into logical scenes, generate image prompts.
- **Image Generation**: Pollinations AI.
  - *Goal*: Download generated scene images locally.
- **Voice Synthesis**: Piper TTS.
  - *Goal*: Generate high-quality offline audio from text.
- **Subtitle Generation**: Whisper.cpp.
  - *Goal*: Generate `.srt` or `.ass` files from generated audio.
- **Video Assembly**: FFmpeg.
  - *Goal*: Apply Ken Burns effect, add transitions, merge audio, overlay text.

## 4. Scalability & Future-Proofing
- **Modular Design**: The AI modules are decoupled so that Pollinations AI can easily be swapped with Local Stable Diffusion in the future.
- **Cloud Ready**: Local storage abstraction allows seamless transition to Supabase Storage later.
- **Deployments**: Configured to work out of the box with Coolify for easy self-hosting.
