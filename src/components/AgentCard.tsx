import { Search, PenTool, CheckCircle, Loader2 } from "lucide-react";
import type { AgentRole, AgentStatus } from "@/lib/types";
import { useEffect, useRef } from "react";

interface AgentCardProps {
  role: AgentRole;
  name: string;
  status: AgentStatus;
  content: string;
}

const roleIcons = {
  prospector: Search,
  architect: PenTool,
  curator: CheckCircle,
};

const statusColors = {
  idle: "border-foreground/10 bg-foreground/5",
  thinking: "border-neon-primary bg-neon-primary/5 animate-pulse-slow",
  done: "border-neon-accent bg-neon-accent/5",
  error: "border-neon-secondary bg-neon-secondary/5",
};

export default function AgentCard({ role, name, status, content }: AgentCardProps) {
  const Icon = roleIcons[role];
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as content updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div className={`flex flex-col h-[500px] sm:h-[600px] rounded-lg border backdrop-blur-sm overflow-hidden transition-all duration-500 ${statusColors[status]} ${status === "thinking" ? "opacity-100 scale-[1.02] shadow-lg shadow-neon-primary/20" : status === "done" ? "opacity-75" : "opacity-50 grayscale-[30%]"}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-inherit bg-background/50">
        <div className="p-2 rounded bg-background border border-inherit">
          <Icon className="w-5 h-5 opacity-80" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold tracking-wide">{name}</h3>
          <p className="text-xs font-mono opacity-60 uppercase">{role}</p>
        </div>
        {status === "thinking" && (
          <Loader2 className="w-4 h-4 animate-spin text-neon-primary" />
        )}
      </div>

      {/* Content Stream */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-sm leading-relaxed opacity-90 whitespace-pre-wrap"
      >
        {content || (status === "idle" ? <span className="opacity-30 italic">Awaiting invocation...</span> : "")}
        {status === "thinking" && <span className="inline-block w-2 h-4 ml-1 bg-neon-primary animate-pulse" />}
      </div>
    </div>
  );
}
