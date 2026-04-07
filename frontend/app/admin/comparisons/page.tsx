"use client";

import { useState } from "react";
import { PlusCircle, Sparkles, Save, Check } from "lucide-react";

export default function AdminComparisonsPage() {
  const [productA, setProductA] = useState("");
  const [productB, setProductB] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingData, setEditingData] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!productA || !productB) return;
    setIsGenerating(true);
    setError("");
    setSuccess(false);

    try {
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${url}/comparisons/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_a_name: productA,
          product_b_name: productB,
          extra_info: extraInfo,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setEditingData(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message || "Failed to generate comparison");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!editingData) return;
    setIsSaving(true);
    setError("");
    setSuccess(false);

    try {
      const payload = JSON.parse(editingData);

      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${url}/comparisons/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setSuccess(true);
      // Optional: clear form
      // setProductA("");
      // setProductB("");
      // setEditingData("");
    } catch (err: any) {
      setError(err.message || "Failed to save comparison");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-indigo-500" />
          Comparison Generator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Use AI to automatically draft deep product comparisons, review the JSON, and publish.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Setup */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-4">
            Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Product A Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Figma"
                value={productA}
                onChange={(e) => setProductA(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Product B Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Sketch"
                value={productB}
                onChange={(e) => setProductB(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Extra Instructions (optional)
              </label>
              <textarea
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                placeholder="Make sure to highlight Figma's real-time collaboration features..."
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !productA || !productB}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Editor */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-[500px]">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            Generated JSON Content
          </h2>
          
          <div className="flex-1 flex flex-col mb-4 ring-1 ring-slate-200 dark:ring-slate-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <textarea
              className="flex-1 w-full p-4 bg-slate-50 dark:bg-slate-950 font-mono text-sm text-slate-800 dark:text-slate-300 outline-none resize-none"
              placeholder="{ // output will appear here }"
              value={editingData}
              onChange={(e) => setEditingData(e.target.value)}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Saved successfully!
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving || !editingData}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors mt-auto"
          >
            {isSaving ? "Saving..." : <><Save className="w-5 h-5" /> Save to Database</>}
          </button>
        </div>
      </div>
    </div>
  );
}
