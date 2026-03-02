import { Power } from "lucide-react";
import type { CouncilState } from "@/lib/types";

interface InvokeButtonProps {
  state: CouncilState;
  onClick: () => void;
  disabled?: boolean;
}

export default function InvokeButton({ state, onClick, disabled }: InvokeButtonProps) {
  const isRunning = state === "running";
  const isDisabled = isRunning || disabled;
  
  return (
    <div className="flex justify-center py-8 relative">
      {/* Background glow effect */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl transition-opacity duration-1000 ${
        isRunning ? 'bg-neon-primary/30 opacity-100' : 'bg-neon-accent/10 opacity-0'
      }`} />
      
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`
          relative z-10 group flex flex-col items-center justify-center w-32 h-32 rounded-full
          border-2 font-mono uppercase tracking-widest text-xs font-bold
          transition-all duration-300 overflow-hidden
          ${isRunning 
            ? 'border-neon-primary text-neon-primary bg-neon-primary/10 shadow-[0_0_30px_rgba(0,240,255,0.4)]' 
            : isDisabled
              ? 'border-foreground/10 text-foreground/30 cursor-not-allowed'
              : 'border-foreground/30 text-foreground hover:border-foreground hover:bg-foreground/5'
          }
        `}
      >
        <span className={`transition-transform duration-500 flex flex-col items-center gap-2 ${isRunning ? 'scale-110' : 'group-hover:scale-110'}`}>
          <Power className={`w-8 h-8 ${isRunning ? 'animate-pulse' : ''}`} />
          {isRunning ? "Running" : "Invoke"}
        </span>
        
        {/* Loading progress ring (pure CSS approximation) */}
        {isRunning && (
          <div className="absolute inset-0 border-t-2 border-neon-primary rounded-full animate-spin border-t-transparent" style={{ animationDuration: '3s' }} />
        )}
      </button>
    </div>
  );
}
