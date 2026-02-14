"use client";

import { useState } from "react";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { PlayCircle, FileText, CheckCircle, Clock } from "lucide-react";

export default function ContentPage() {
    const [contents, setContents] = useState([
        {
            id: "1",
            title: "Review: Lumina X Smart Watch",
            status: "published",
            created_at: "2023-10-01",
            preview_video: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder
        },
         {
            id: "2",
            title: "Top 10 Gadgets for 2024",
            status: "draft",
            created_at: "2023-10-02",
            preview_video: null
        }
    ]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-between items-center">
                 <div>
                     <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                        Content Engine
                    </h1>
                    <p className="text-slate-500 mt-2">AI-generated reviews and comparison videos.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
                >
                    {isGenerating ? (
                        <>
                            <Clock className="w-4 h-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <FileText className="w-4 h-4" />
                            New Generation Task
                        </>
                    )}
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {contents.map((content) => (
                    <div key={content.id} className="card-glass rounded-xl p-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-800">
                        {content.preview_video ? (
                            <div className="relative aspect-video bg-black">
                                <iframe
                                    src={content.preview_video}
                                    className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                                    title="Video Preview"
                                    allowFullScreen
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                        <PlayCircle className="w-8 h-8 text-white drop-shadow-lg" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                <FileText className="w-12 h-12 opacity-20" />
                            </div>
                        )}

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                                    content.status === 'published'
                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30'
                                }`}>
                                    {content.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                    {content.status}
                                </span>
                                <span className="text-xs text-slate-500 font-mono">{content.created_at}</span>
                            </div>

                            <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-600 transition-colors">{content.title}</h3>
                            <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                                AI-generated comprehensive review emphasizing key features, pros/cons, and final verdict.
                            </p>

                            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 dark:hover:text-indigo-400 transition-colors">Edit Content</button>
                                <button className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">View Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
