# API Specifications

## Backend (Express.js)

### 1. `POST /api/videos/generate`
**Description**: Submits a new video generation job to the lightweight Node.js queue.

**Request Body**:
```json
{
  "seriesName": "Space Explorers",
  "episodeName": "Mars Landing",
  "videoDuration": 60,
  "language": "en",
  "script": "The journey was long, but we finally made it..."
}
```

**Response**:
```json
{
  "jobId": "job_123456789",
  "status": "queued",
  "message": "Video generation job has been queued successfully."
}
```

---

### 2. `GET /api/videos/status/:jobId`
**Description**: Get the real-time status and progress of an ongoing video generation job.

**Response**:
```json
{
  "jobId": "job_123456789",
  "status": "processing", // queued | processing | completed | failed
  "progress": 45, // 0 to 100
  "currentTask": "Generating Images via Pollinations AI",
  "videoUrl": null,
  "error": null
}
```

---

### 3. `GET /api/videos/download/:jobId`
**Description**: Streams the final rendered MP4 file from local storage to the user.
**Response**: Binary `video/mp4` data stream.
