import { Terminal } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-neon-primary selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-foreground/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <div className="p-2 rounded-md bg-foreground/5 border border-foreground/10">
            <Terminal className="w-5 h-5 text-neon-primary" />
          </div>
          <div>
            <h1 className="font-mono text-lg font-bold tracking-tight">THE_HIGH_COUNCIL</h1>
            <p className="text-xs text-foreground/50 tracking-widest hidden sm:block">LOCAL_AI_ORCHESTRATION_NODE</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-foreground/10 py-6 text-center text-xs text-foreground/40 font-mono">
        <p>SYSTEM ONLINE // MOCK MODE ENABLED</p>
      </footer>
    </div>
  );
}
