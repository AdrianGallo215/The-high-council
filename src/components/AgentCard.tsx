"use client";

import { useRef, useEffect } from "react";
import { Lightbulb, Cpu, Layers } from "lucide-react";

interface AgentCardProps {
  role: "prospector" | "architect" | "curator";
  name: string;
  status: string;
  content: string;
  accentColor?: "emerald" | "violet" | "amber";
}

const agentConfig = {
  prospector: {
    icon: Lightbulb,
    title: "Prospector",
    subtitle: "Data Ingestion & Research",
    gradient: "from-emerald-500/5 to-transparent",
    border: "border-emerald-500/20",
    dotColor: "bg-emerald-500",
    textColor: "text-emerald-400",
    glowColor: "bg-emerald-500/10",
  },
  architect: {
    icon: Cpu,
    title: "Architect",
    subtitle: "System Modeling & Framework",
    gradient: "from-violet-500/5 to-transparent",
    border: "border-violet-500/20",
    dotColor: "bg-violet-500",
    textColor: "text-violet-400",
    glowColor: "bg-violet-500/10",
  },
  curator: {
    icon: Layers,
    title: "Curator",
    subtitle: "Final Review & Synthesis",
    gradient: "from-amber-500/5 to-transparent",
    border: "border-amber-500/20",
    dotColor: "bg-amber-500",
    textColor: "text-amber-400",
    glowColor: "bg-amber-500/10",
  },
};

function statusLabel(status: string) {
  switch (status) {
    case "streaming": return "Searching...";
    case "done": return "Complete";
    default: return "Standby";
  }
}

export default function AgentCard({ role, name, status, content }: AgentCardProps) {
  const config = agentConfig[role];
  const Icon = config.icon;
  const scrollRef = useRef<HTMLDivElement>(null);
  const isActive = status === "streaming";
  const isDone = status === "done";

  // Auto-scroll while streaming
  useEffect(() => {
    if (isActive && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content, isActive]);

  return (
    <div className="relative flex flex-col bg-zinc-950 overflow-hidden group">
      {/* Top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${config.gradient} pointer-events-none`} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${config.glowColor} border ${config.border} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${config.textColor}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">{config.title}</h3>
            <p className="text-[10px] text-zinc-600 font-medium">{config.subtitle}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${
            isActive ? `${config.dotColor} animate-pulse` :
            isDone ? "bg-zinc-600" :
            "bg-zinc-700"
          }`} />
          <span className={`text-[10px] font-medium uppercase tracking-wider ${
            isActive ? config.textColor :
            isDone ? "text-zinc-500" :
            "text-zinc-700"
          }`}>
            {statusLabel(status)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto p-6">
        {content ? (
          <div className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap break-words">
            {content}
            {isActive && (
              <span className="inline-block w-1.5 h-3.5 bg-blue-500 ml-0.5 animate-pulse" />
            )}
          </div>
        ) : (
          /* Idle state — breathing geometric pattern */
          <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[300px] gap-6">
            {/* Breathing geometric orb */}
            <div className="relative">
              <div className={`w-16 h-16 rounded-full border ${config.border} flex items-center justify-center animate-breathe`}>
                <div className={`w-3 h-3 rounded-full ${config.dotColor} opacity-50`} />
              </div>
              {/* Orbit ring */}
              <div className={`absolute inset-[-12px] rounded-full border border-dashed ${config.border} opacity-30 animate-[spin_20s_linear_infinite]`} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-500">{config.title}</p>
              <p className="text-xs text-zinc-700 mt-1">
                {role === "prospector" ? "Ready to search and analyze data." :
                 role === "architect" ? "Ready to build framework upon Prospector's data." :
                 "Awaiting Architect's blueprint for final polish."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
