# AI Video Studio - Roadmap

## Phase 1: Architecture (COMPLETED)
- Define technology stack (100% FOSS).
- Design system components and data flow.
- Setup `PROJECT_BLUEPRINT.md` and `TASKS.md`.

## Phase 2: Documentation (CURRENT)
- Define API specifications.
- Document AI Prompts for Gemini.
- Detail FFmpeg transition parameters.

## Phase 3: Folder Structure
- Setup project directories (`frontend`, `backend`, `docs`, `n8n`, `docker`, `ffmpeg`, `assets`, `prompts`, `scripts`).

## Phase 4: Frontend
- Initialize Next.js with Tailwind CSS and Shadcn UI.
- Create UI for video parameter inputs (Script, Language, etc.).
- Build dashboard to track video status.

## Phase 5: Backend & Database
- Initialize Express server.
- Setup Supabase Auth and Database schema.
- Create internal Node.js lightweight queue for processing.

## Phase 6: APIs
- Develop REST APIs for job submission and status polling.
- Setup local storage file serving.

## Phase 7: AI Integrations
- Integrate Google Gemini Free API.
- Integrate Pollinations AI.
- Setup Piper TTS and Whisper.cpp.

## Phase 8: Automation & FFmpeg
- Write Node.js scripts for FFmpeg video rendering.
- Test End-to-End generation.
- Integrate n8n for future social media posting.

## Phase 9: Deployment
- Write Dockerfiles and `docker-compose.yml`.
- Test local deployment.
- Configure for Coolify.
