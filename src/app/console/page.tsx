"use client";

import { useState, useEffect, useRef } from "react";
import { useCouncilStream } from "@/lib/useCouncilStream";
import AgentCard from "@/components/AgentCard";
import IdeaSpotlight from "@/components/IdeaSpotlight";
import SettingsModal, { loadModelConfig } from "@/components/SettingsModal";
import { AlertTriangle, Search, X, Settings } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ConsolePage() {
  const { councilState, finalIdea, agents, invoke, clearSession } = useCouncilStream();
  const [topic, setTopic] = useState("");
  const [ollamaOk, setOllamaOk] = useState<boolean | null>(null);
  const [showVerdict, setShowVerdict] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/health")
      .then(res => setOllamaOk(res.ok))
      .catch(() => setOllamaOk(false));
  }, []);

  // Auto-show verdict when done
  useEffect(() => {
    if (councilState === "done" && finalIdea) {
      setShowVerdict(true);
    }
  }, [councilState, finalIdea]);

  // Focus input on ⌘K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setShowVerdict(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleInvoke = () => {
    const config = loadModelConfig();
    invoke(topic || undefined, config);
    setShowVerdict(false);
  };

  const handleReset = () => {
    clearSession();
    setShowVerdict(false);
    setTopic("");
  };

  return (
    <div className="h-screen flex flex-col bg-[#09090B] overflow-hidden">

      {/* ─── Top Bar ─── */}
      <header className="flex items-center justify-between px-5 h-12 border-b border-zinc-900 shrink-0">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="The High Council" width={24} height={24} className="rounded-md" />
          <span className="text-[13px] font-semibold text-zinc-300 tracking-tight">The High Council</span>
        </div>

        <div className="flex items-center gap-3">
          {/* System status */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900/50">
            <div className={`w-1.5 h-1.5 rounded-full ${
              ollamaOk === true ? "bg-emerald-500" :
              ollamaOk === false ? "bg-red-500" :
              "bg-zinc-600 animate-pulse"
            }`} />
            <span className="text-[11px] text-zinc-500 font-medium">
              {ollamaOk === true ? "System Active" :
               ollamaOk === false ? "Offline" :
               "Connecting..."}
            </span>
          </div>
          <SettingsModal />
        </div>
      </header>

      {/* ─── Ollama Error Banner ─── */}
      <AnimatePresence>
        {ollamaOk === false && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="shrink-0 overflow-hidden"
          >
            <div className="px-5 py-3 bg-red-950/30 border-b border-red-500/10 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-300">
                Ollama is offline. Start your local instance on port 11434 to proceed.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── TRIPTYCH: Agent Panels ─── */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900/30 overflow-hidden relative">
        <AgentCard
          role="prospector"
          name="Prospector"
          status={agents.prospector.status}
          content={agents.prospector.text}
          accentColor="emerald"
        />
        <AgentCard
          role="architect"
          name="Architect"
          status={agents.architect.status}
          content={agents.architect.text}
          accentColor="violet"
        />
        <AgentCard
          role="curator"
          name="Curator"
          status={agents.curator.status}
          content={agents.curator.text}
          accentColor="amber"
        />

        {/* ─── Verdict Overlay ─── */}
        <AnimatePresence>
          {showVerdict && finalIdea && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-x-0 bottom-0 top-[15%] z-30"
            >
              {/* Backdrop blur */}
              <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm -top-[20%]" onClick={() => setShowVerdict(false)} />

              {/* Verdict Panel */}
              <div className="relative h-full bg-zinc-950 border-t border-zinc-800 rounded-t-2xl shadow-2xl shadow-black/50 flex flex-col">
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 cursor-pointer" onClick={() => setShowVerdict(false)}>
                  <div className="w-10 h-1 rounded-full bg-zinc-800" />
                </div>

                <IdeaSpotlight content={finalIdea} onClose={() => setShowVerdict(false)} onReset={handleReset} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Floating Command Palette ─── */}
      <div className="shrink-0 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-xl">
        <form
          onSubmit={(e) => { e.preventDefault(); handleInvoke(); }}
          className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3"
        >
          <div className="flex items-center gap-3 flex-1 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2.5 focus-within:border-zinc-700 transition-all">
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Design an optimal multi-agent orchestration protocol for..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={councilState === "running" || ollamaOk === false}
              className="flex-1 bg-transparent border-none focus:outline-none text-sm placeholder:text-zinc-600 text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-500 font-mono">
              ⌘K
            </kbd>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {councilState === "done" && finalIdea && !showVerdict && (
              <button
                type="button"
                onClick={() => setShowVerdict(true)}
                className="text-xs font-medium px-3 py-2 text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/15 transition-colors cursor-pointer"
              >
                View Verdict
              </button>
            )}

            {councilState === "idle" && (
              <button
                type="submit"
                disabled={ollamaOk === false}
                className="text-xs font-medium px-4 py-2 bg-zinc-100 text-zinc-950 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Execute
              </button>
            )}

            {councilState === "running" && (
              <span className="text-xs font-medium px-4 py-2 text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Processing
              </span>
            )}

            {councilState === "done" && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-medium px-3 py-2 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 rounded-lg transition-colors cursor-pointer"
              >
                New Session
              </button>
            )}
          </div>

          {/* Quick actions */}
          <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-zinc-800">
            <span className="text-[10px] text-zinc-700 font-mono">History</span>
            <span className="text-[10px] text-zinc-700 font-mono">·</span>
            <span className="text-[10px] text-zinc-700 font-mono">Templates</span>
          </div>
        </form>
      </div>
    </div>
  );
}
