"use client";

import React, { useState, useEffect } from "react";
import { Film, Play, Download, Loader2, Image as ImageIcon, Mic, Video, CheckCircle2, AlertCircle } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("10");
  const [language, setLanguage] = useState("en");
  const [script, setScript] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setProgress(0);
    setStatus("Submitting to backend...");
    setJobId(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/videos/generate-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, script, duration, language })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to submit job");
      }

      setJobId(data.jobId);
      setStatus("Job queued. Waiting for pipeline to start...");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Network Error");
      setLoading(false);
      setStatus("Failed");
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (jobId && loading) {
      intervalId = setInterval(async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const res = await fetch(`${apiUrl}/api/videos/status/${jobId}`);
          const data = await res.json();
          
          if (data.success && data.job) {
            const job = data.job;
            setProgress(job.progress);
            setStatus(job.currentTask);

            if (job.status === "completed") {
              setLoading(false);
              setVideoUrl(job.videoUrl);
              clearInterval(intervalId);
            } else if (job.status === "failed") {
              setLoading(false);
              setError(job.error || "Generation Failed");
              clearInterval(intervalId);
            }
          }
        } catch (err) {
          console.error("Error polling status:", err);
        }
      }, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [jobId, loading]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
            <Film className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">AI Video Studio</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-8">
        
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Play className="w-5 h-5 text-indigo-500" />
              Project Settings
            </h2>
            
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Video Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Space Exploration Documentary" 
                  className="w-full flex h-10 rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Duration</label>
                  <select 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full flex h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="10">10 Seconds</option>
                    <option value="20">20 Seconds</option>
                    <option value="30">30 Seconds</option>
                    <option value="60">60 Seconds</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Language</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full flex h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Script / Prompt</label>
                <textarea 
                  required
                  rows={6}
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Enter your script or a brief description of what you want the video to be about..."
                  className="w-full flex min-h-[120px] rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-11 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4 mr-2" />
                    Generate Video
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-500" />
              Output & Status
            </h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div className="text-sm text-red-800">
                  <span className="font-semibold block mb-1">Error Occurred</span>
                  {error}
                </div>
              </div>
            )}

            {(loading || progress > 0) && !error && (
              <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-inner">
                <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                  <span>{status}</span>
                  <span className="text-indigo-600">{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute top-0 left-0 bottom-0 right-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 flex-1">
              <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${progress >= 30 ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                {progress >= 30 ? <CheckCircle2 className="w-5 h-5 text-indigo-600" /> : <ImageIcon className="w-5 h-5" />}
                <span className="text-sm font-medium">Generated Images</span>
              </div>
              
              <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${progress >= 60 ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                {progress >= 60 ? <CheckCircle2 className="w-5 h-5 text-indigo-600" /> : <Mic className="w-5 h-5" />}
                <span className="text-sm font-medium">Audio Status (TTS & Subtitles)</span>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${progress >= 100 ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                {progress >= 100 ? <CheckCircle2 className="w-5 h-5 text-indigo-600" /> : <Video className="w-5 h-5" />}
                <span className="text-sm font-medium">Video Status (FFmpeg Render)</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <a 
                href={videoUrl ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${videoUrl}` : "#"}
                download={videoUrl ? "generated-video.mp4" : undefined}
                target="_blank"
                rel="noreferrer"
                className={`w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-11 shadow-sm ${videoUrl ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none'}`}
              >
                <Download className="w-4 h-4 mr-2" />
                Download MP4
              </a>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
