import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-blue-500/50 transition-colors">
              <ShieldAlert className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-tight text-white group-hover:text-blue-100 transition-colors">The High Council</h1>
              <p className="text-[10px] text-slate-500 tracking-widest hidden sm:block uppercase">Operator Console</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM_ONLINE
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8 flex flex-col">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-[10px] text-slate-600 font-mono tracking-widest uppercase mt-auto">
        <p>The High Council // Local Intelligence Node</p>
      </footer>
    </div>
  );
}
