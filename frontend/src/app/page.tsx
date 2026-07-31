"use client";

import React, { useState, useEffect } from "react";
import { Film, Play, Download, Loader2, Image as ImageIcon, Mic, Video, CheckCircle2, AlertCircle, Settings2, Sparkles, Smartphone, MonitorPlay, FileText } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("10");
  const [language, setLanguage] = useState("en");
  const [inputType, setInputType] = useState<"script" | "prompt">("prompt");
  const [script, setScript] = useState("");
  const [format, setFormat] = useState<"16:9" | "9:16">("9:16");
  const [quality, setQuality] = useState<"720p" | "1080p">("1080p");
  const [voice, setVoice] = useState<"male" | "female" | "custom">("male");
  const [voiceFile, setVoiceFile] = useState<File | null>(null);

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
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("script", script);
      formData.append("duration", duration);
      formData.append("language", language);
      formData.append("inputType", inputType);
      formData.append("format", format);
      formData.append("quality", quality);
      formData.append("voice", voice);
      
      if (voice === "custom" && voiceFile) {
        formData.append("voiceFile", voiceFile);
      }

      const response = await fetch(`${apiUrl}/api/videos/generate-video`, {
        method: "POST",
        body: formData // Using FormData now to support file upload
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to submit job");
      }

      setJobId(data.jobId);
      setStatus("Job queued. Waiting for pipeline to start...");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Network Error");
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
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI Video Studio <span className="text-xs font-medium px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full ml-2">PRO</span>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Input Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-8">
            <h2 className="text-xl font-semibold mb-8 flex items-center gap-3 text-white">
              <Settings2 className="w-5 h-5 text-indigo-400" />
              Project Configuration
            </h2>
            
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Video Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Secrets of Deep Space" 
                  className="w-full flex h-12 rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Format</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-black/20 rounded-xl border border-white/10">
                    <button type="button" onClick={() => setFormat("9:16")} className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${format === "9:16" ? "bg-indigo-500/20 text-indigo-300" : "text-slate-400 hover:text-white"}`}>
                      <Smartphone className="w-4 h-4" /> 9:16
                    </button>
                    <button type="button" onClick={() => setFormat("16:9")} className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${format === "16:9" ? "bg-indigo-500/20 text-indigo-300" : "text-slate-400 hover:text-white"}`}>
                      <MonitorPlay className="w-4 h-4" /> 16:9
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Quality</label>
                  <select 
                    value={quality} 
                    onChange={(e) => setQuality(e.target.value as "720p" | "1080p")}
                    className="w-full flex h-11 rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    <option value="720p">Standard (720p)</option>
                    <option value="1080p">High (1080p)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Duration</label>
                  <select 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full flex h-11 rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    <option value="10">10 Sec</option>
                    <option value="20">20 Sec</option>
                    <option value="30">30 Sec</option>
                    <option value="60">60 Sec</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Language</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full flex h-11 rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Voice</label>
                  <select 
                    value={voice}
                    onChange={(e) => setVoice(e.target.value as "male" | "female" | "custom")}
                    className="w-full flex h-11 rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    <option value="male">Male (AI)</option>
                    <option value="female">Female (AI)</option>
                    <option value="custom">Clone Voice</option>
                  </select>
                </div>
              </div>

              {voice === "custom" && (
                <div className="space-y-2 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <label className="text-sm font-medium text-indigo-300 flex items-center gap-2">
                    <Mic className="w-4 h-4" /> Upload 30s audio sample of your voice (.mp3/.wav)
                  </label>
                  <input 
                    type="file" 
                    accept="audio/mp3, audio/wav"
                    onChange={(e) => setVoiceFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30 transition-all"
                  />
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">Content Input</label>
                  <div className="flex bg-black/20 p-1 rounded-lg border border-white/10">
                    <button type="button" onClick={() => setInputType("prompt")} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${inputType === "prompt" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>
                      <Sparkles className="w-3.5 h-3.5" /> Auto (Prompt)
                    </button>
                    <button type="button" onClick={() => setInputType("script")} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${inputType === "script" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>
                      <FileText className="w-3.5 h-3.5" /> Manual (Script)
                    </button>
                  </div>
                </div>
                <textarea 
                  required
                  rows={6}
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder={inputType === "prompt" ? "Write 1 or 2 lines here. The AI will automatically expand it into a full script..." : "Paste your exact scene-by-scene script here..."}
                  className="w-full flex min-h-[140px] rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full relative overflow-hidden group inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-indigo-500/20"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform ease-out"></div>
                <span className="relative flex items-center">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Rendering Pipeline...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2 fill-current" />
                      Generate Masterpiece
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-8 h-full flex flex-col relative overflow-hidden">
            <h2 className="text-xl font-semibold mb-8 flex items-center gap-3 text-white">
              <Video className="w-5 h-5 text-indigo-400" />
              Rendering Engine
            </h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 backdrop-blur-md">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <div className="text-sm text-red-200">
                  <span className="font-semibold block mb-1 text-red-400">Error Occurred</span>
                  {error}
                </div>
              </div>
            )}

            {(loading || progress > 0) && !error && (
              <div className="mb-10 p-5 bg-black/20 rounded-xl border border-white/5 shadow-inner">
                <div className="flex justify-between text-sm font-medium text-slate-300 mb-4">
                  <span className="animate-pulse">{status}</span>
                  <span className="text-indigo-400">{progress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden shadow-inner border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute top-0 left-0 bottom-0 right-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-30 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 flex-1">
              <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${progress >= 30 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                {progress >= 30 ? <CheckCircle2 className="w-5 h-5" /> : <ImageIcon className="w-5 h-5 opacity-50" />}
                <span className="text-sm font-medium">Image Generation Phase</span>
              </div>
              
              <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${progress >= 60 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                {progress >= 60 ? <CheckCircle2 className="w-5 h-5" /> : <Mic className="w-5 h-5 opacity-50" />}
                <span className="text-sm font-medium">Audio Synthesis (TTS & SRT)</span>
              </div>

              <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${progress >= 100 ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                {progress >= 100 ? <CheckCircle2 className="w-5 h-5" /> : <Video className="w-5 h-5 opacity-50" />}
                <span className="text-sm font-medium">Final MP4 Render</span>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <a 
                href={videoUrl ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${videoUrl}` : "#"}
                download={videoUrl ? "generated-video.mp4" : undefined}
                target="_blank"
                rel="noreferrer"
                className={`w-full group inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all h-14 border ${videoUrl ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-lg' : 'bg-black/20 text-slate-600 border-white/5 cursor-not-allowed pointer-events-none'}`}
              >
                <Download className={`w-5 h-5 mr-2 ${videoUrl ? 'group-hover:animate-bounce' : ''}`} />
                Download Final Video
              </a>
            </div>
            
            {/* Ambient background glow for output container */}
            {progress > 0 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/5 blur-[100px] pointer-events-none rounded-full"></div>}
          </div>
        </div>
      </main>
    </div>
  );
}
