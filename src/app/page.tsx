"use client";

import { useState, useEffect } from "react";
import { useCouncilStream } from "@/lib/useCouncilStream";
import AgentCard from "@/components/AgentCard";
import InvokeButton from "@/components/InvokeButton";
import IdeaSpotlight from "@/components/IdeaSpotlight";
import SettingsModal, { loadModelConfig } from "@/components/SettingsModal";
import { AlertTriangle } from "lucide-react";

export default function Home() {
  const { councilState, finalIdea, agents, invoke, clearSession } = useCouncilStream();
  const [topic, setTopic] = useState("");
  const [ollamaOk, setOllamaOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then(res => setOllamaOk(res.ok))
      .catch(() => setOllamaOk(false));
  }, []);

  const handleInvoke = () => {
    const config = loadModelConfig();
    invoke(topic || undefined, config);
  };

  return (
    <>
      <SettingsModal />

      {ollamaOk === false && (
        <div className="mb-6 mx-auto max-w-2xl p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-3 backdrop-blur-sm">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-sm text-red-200">
            <p className="font-semibold text-red-100 mb-1">Ollama is offline or unreachable</p>
            <p className="text-red-300">The Council requires a local Ollama instance running on port 11434 with the required models. Please start Ollama to proceed.</p>
          </div>
        </div>
      )}

      {/* Action Center */}
      <section className="mb-10 max-w-md mx-auto flex flex-col items-center gap-6">
        <div className="w-full relative flex gap-2">
          <input 
            type="text" 
            placeholder="What should the Council build? (Optional topic)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={councilState === "running" || ollamaOk === false}
            className="flex-1 bg-background border border-foreground/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-primary focus:ring-1 focus:ring-neon-primary/50 transition-all font-mono placeholder:text-foreground/30 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {councilState === "done" && (
            <button 
              onClick={clearSession}
              className="px-4 py-3 rounded-lg border border-neon-secondary/50 text-neon-secondary hover:bg-neon-secondary/10 transition-colors whitespace-nowrap text-sm font-mono flex items-center gap-2"
              title="Start a new session"
            >
              Reset
            </button>
          )}
        </div>
        
        <InvokeButton 
          state={councilState} 
          onClick={handleInvoke} 
          disabled={ollamaOk === false}
        />
      </section>

      {/* Agents Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AgentCard 
          role="prospector" 
          name="The Prospector" 
          status={agents.prospector.status} 
          content={agents.prospector.text} 
        />
        <AgentCard 
          role="architect" 
          name="The Architect" 
          status={agents.architect.status} 
          content={agents.architect.text} 
        />
        <AgentCard 
          role="curator" 
          name="The Curator" 
          status={agents.curator.status} 
          content={agents.curator.text} 
        />
      </section>

      {/* Result Section */}
      {councilState === "done" && finalIdea && (
        <IdeaSpotlight content={finalIdea} />
      )}
    </>
  );
}
