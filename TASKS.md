# Tasks List

## Phase 1 & 2: Planning & Documentation
- [x] Create initial folder structure (Done previously)
- [x] Finalize Open Source Architecture
- [x] Create `implementation_plan.md`
- [x] Create `PROJECT_BLUEPRINT.md`
- [x] Create `ROADMAP.md`
- [x] Create `TASKS.md`
- [x] Wait for user approval on Architecture.
- [x] Define API specifications (`API_SPECS.md`)
- [x] Document AI Prompts for Gemini (`AI_PROMPTS.md`)
- [x] Detail FFmpeg transition parameters (`FFMPEG_SPECS.md`)

## Phase 3: Setup
- [x] Clean up and modularize `backend/` and `frontend/` folders.
- [ ] Setup ESLint, Prettier in both environments.

## Phase 4: Frontend
- [x] `npx create-next-app` inside `/frontend`
- [x] Install Tailwind CSS & Shadcn UI (Custom Implementation).
- [x] Create Authentication pages (Login/Register via Supabase). (Skipped as per instructions)
- [x] Create Dashboard Layout.
- [x] Create Video Generation Form.

## Phase 5: Backend
- [x] `npm init` inside `/backend`
- [x] Install Express, CORS, dotenv, Supabase client (Base Express setup done).
- [x] Create basic Express Server structure.
- [x] Integrate lightweight Job Queue.

## Phase 6 & 7: Core Logic
- [x] Develop REST APIs for job submission and status polling.
- [x] Setup local storage file serving.
- [ ] Write `geminiService.js` to handle script-to-scene logic.
- [ ] Write `imageService.js` to handle Pollinations AI requests.
- [ ] Setup `piperService.js` using Node `child_process`.
- [ ] Setup `whisperService.js` using Node `child_process`.
- [ ] Write `ffmpegService.js` to stitch assets.

## Phase 8: Automation
- [ ] Connect services in the Job Queue.
- [ ] Spin up n8n via Docker.
- [ ] Setup test workflow for Social Media uploads.

## Phase 9: Deployment
- [ ] Write Dockerfile for Frontend.
- [ ] Write Dockerfile for Backend (include Piper, Whisper, FFmpeg binaries).
- [ ] Setup `docker-compose.yml` for unified local running.
