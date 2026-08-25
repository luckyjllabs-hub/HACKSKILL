"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Cpu, CheckCircle2, AlertCircle, X, RefreshCw } from "lucide-react";

interface NavbarProps {
  onOpenTalent: () => void;
  onScrollToBuilder: () => void;
  onScrollToFeatures?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTalent,
  onScrollToBuilder,
  onScrollToFeatures,
}) => {
  const [aiStatus, setAiStatus] = useState<{
    configured: boolean;
    model: string;
    status: string;
    latencyMs?: number;
  }>({
    configured: false,
    model: "gemini-1.5-flash",
    status: "Checking...",
  });

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [customKey, setCustomKey] = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchAiStatus = async () => {
    try {
      const res = await fetch("/api/ai/status");
      const data = await res.json();
      setAiStatus(data);
    } catch (e) {
      setAiStatus({
        configured: false,
        model: "gemini-1.5-flash",
        status: "Heuristic Fallback Ready",
      });
    }
  };

  useEffect(() => {
    fetchAiStatus();
  }, []);

  const handleTestKey = async () => {
    if (!customKey.trim()) return;
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/ai/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: customKey.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setTestResult(`✓ Verified with Gemini (${data.latencyMs}ms latency)`);
      } else {
        setTestResult(`✕ Error: ${data.error}`);
      }
    } catch (err: any) {
      setTestResult(`✕ Failed: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      <header role="banner" className="bg-surface sticky top-0 z-50 border-b border-outline-variant">
        <div className="flex justify-between items-center px-4 sm:px-8 md:px-16 h-20 w-full max-w-[1280px] mx-auto">
          {/* Brand */}
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-primary">
              PROJECT AI-X
            </span>
          </div>

          {/* Navigation */}
          <nav aria-label="Main navigation" className="hidden md:flex gap-8 items-center">
            <button
              onClick={onScrollToBuilder}
              className="text-sm text-primary font-bold border-b-2 border-primary py-2 transition-colors"
            >
              How it works
            </button>
            <button
              onClick={onScrollToFeatures}
              className="text-sm text-secondary hover:text-primary transition-colors"
            >
              Features
            </button>
            <button
              onClick={onOpenTalent}
              className="text-sm text-secondary hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <span>For Students</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-surface-container font-semibold">
                500
              </span>
            </button>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant"
              title="Inspect Gemini AI Model Connection"
            >
              <span className={`w-2 h-2 rounded-full ${aiStatus.configured ? "bg-emerald-500" : "bg-primary"}`} />
              <span>AI Engine: Gemini Flash</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="p-2 text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-container"
              title="Gemini AI Diagnostic Inspector"
            >
              <Cpu className="w-5 h-5 text-primary" />
            </button>

            <button
              onClick={onScrollToBuilder}
              className="bg-primary text-on-primary text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
            </button>

            <div
              onClick={onOpenTalent}
              className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-outline-variant cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
              title="Explore Talent Pool"
            >
              <img
                alt="User Profile"
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
              />
            </div>
          </div>
        </div>
      </header>

      {/* AI Inspector Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-outline-variant shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative">
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-secondary hover:text-primary hover:bg-surface-container"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant">
              <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary">Gemini AI Model Inspector</h3>
                <p className="text-xs text-secondary">Google GenAI Integration & Prompt Validation</p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-secondary">AI Model:</span>
                  <span className="font-bold text-primary font-mono">{aiStatus.model}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-secondary">Engine Status:</span>
                  <span className="font-bold text-primary">{aiStatus.status}</span>
                </div>
                {aiStatus.latencyMs && (
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-secondary">Diagnostic Latency:</span>
                    <span className="font-mono text-emerald-600 font-bold">{aiStatus.latencyMs}ms</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-secondary">
                <div className="font-semibold text-primary">Active AI Capabilities:</div>
                <div className="flex items-center gap-1.5">• Semantic Natural-Language Project Understanding</div>
                <div className="flex items-center gap-1.5">• Canonical Skill Normalization & Extraction</div>
                <div className="flex items-center gap-1.5">• Grounded Profile Evidence Team Explanation</div>
                <div className="flex items-center gap-1.5">• Real-time Missing Teammate Rationale</div>
              </div>

              {/* Test Live Key Input */}
              <div className="pt-3 border-t border-outline-variant">
                <label className="block text-[11px] font-semibold text-secondary uppercase tracking-wider mb-2">
                  Test Live Gemini API Key (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 px-3 py-2 text-xs bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-black"
                  />
                  <button
                    onClick={handleTestKey}
                    disabled={isTesting || !customKey.trim()}
                    className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 disabled:opacity-50 text-xs"
                  >
                    {isTesting ? "Testing..." : "Test"}
                  </button>
                </div>
                {testResult && (
                  <div className="mt-2 text-xs font-medium text-primary">
                    {testResult}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
