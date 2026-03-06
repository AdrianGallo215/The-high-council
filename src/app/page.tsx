"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Cpu, Lightbulb, Layers, Terminal, Zap, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ─── Dot Grid Background ─── */
const DotGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `radial-gradient(circle, #FAFAFA 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    />
    {/* Radial fade from center-right */}
    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
    <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-blue-500/[0.02] rounded-full blur-[100px]" />
  </div>
);

/* ─── Animated Agent Orb ─── */
const AgentOrb = ({ delay, icon: Icon, label, color, className }: { delay: number; icon: any; label: string; color: string; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.8, type: "spring", bounce: 0.3 }}
    className={`absolute ${className}`}
  >
    <div className="relative group cursor-pointer">
      {/* Glow */}
      <div className={`absolute inset-0 rounded-2xl ${color} blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
      {/* Card */}
      <div className="relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1">
        <Icon className="w-6 h-6 text-zinc-300 mb-2" />
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  </motion.div>
);

/* ─── Console Preview (Fake Terminal) ─── */
const ConsolePreview = () => {
  const lines = [
    { text: "council_runtime.env // active", color: "text-zinc-600" },
    { text: "", color: "" },
    { text: "▶ Initializing Agent Swarm...", color: "text-blue-400" },
    { text: "  node connected.", color: "text-zinc-500" },
    { text: "  establishing neural link.", color: "text-zinc-500" },
    { text: "  routing directive.", color: "text-zinc-500" },
    { text: "", color: "" },
    { text: "▶ Prospector: Scanning knowledge base...", color: "text-emerald-400" },
    { text: "  Found 3 relevant clusters.", color: "text-zinc-500" },
    { text: "  Analyzing cross-references...", color: "text-zinc-500" },
    { text: "", color: "" },
    { text: "▶ Architect: Building framework...", color: "text-violet-400" },
    { text: "  Evaluating edge cases.", color: "text-zinc-500" },
    { text: "", color: "" },
    { text: "▶ Curator: Synthesizing verdict...", color: "text-amber-400" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, rotateY: -5 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ delay: 0.6, duration: 1, type: "spring" }}
      className="relative"
      style={{ perspective: "1000px" }}
    >
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl shadow-black/50 w-[520px]">
        {/* Terminal chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          </div>
          <span className="text-[10px] text-zinc-600 font-mono ml-2">council_runtime.env</span>
        </div>
        {/* Terminal content */}
        <div className="p-4 font-mono text-[11px] leading-relaxed h-[300px] overflow-hidden">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.12 }}
              className={line.color}
            >
              {line.text || "\u00A0"}
            </motion.div>
          ))}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 2.5, duration: 1, repeat: Infinity }}
            className="inline-block w-1.5 h-3 bg-blue-500 ml-0.5"
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Logic Stream Step ─── */
const LogicStep = ({ step, title, description, icon: Icon, delay, isLast }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true, margin: "-50px" }}
    className="relative flex gap-4"
  >
    {/* Vertical line & dot */}
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-blue-400" />
      </div>
      {!isLast && <div className="w-px flex-1 bg-gradient-to-b from-zinc-800 to-transparent mt-2" />}
    </div>
    {/* Content */}
    <div className="pb-10">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Step {step}</span>
      </div>
      <h3 className="text-lg font-semibold text-zinc-100 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">{description}</p>
    </div>
  </motion.div>
);

/* ─── Thought Process Feed ─── */
const ThoughtFeed = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.6 }}
    viewport={{ once: true }}
    className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden"
  >
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800/50 bg-zinc-900/30">
      <Terminal className="w-3.5 h-3.5 text-zinc-500" />
      <span className="text-[11px] text-zinc-500 font-medium">Thought Process Feed</span>
      <div className="flex gap-1 ml-auto">
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
      </div>
    </div>
    <div className="p-4 font-mono text-[11px] leading-loose space-y-1">
      <div className="text-zinc-600">[System] Initiating Problem Ingestion sequence...</div>
      <div className="text-emerald-500">▶ Agent Alpha: Analyzing input parameters.</div>
      <div className="text-zinc-600">[Agent Alpha] Detected multiple logical branches.</div>
      <div className="text-zinc-600">Requesting Agent Beta analysis.</div>
      <div className="text-violet-400">▶ Agent Beta: Cross-referencing historical precedents.</div>
      <div className="text-zinc-600">[Agent Beta] Found matching patterns in sector 7G.</div>
      <div className="text-zinc-600">Initiating sub-routine.</div>
      <div className="text-zinc-500">Processing synthesis...</div>
      <span className="inline-block w-1.5 h-3 bg-blue-500 animate-pulse" />
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════ */
/* ═══  LANDING PAGE                                      ═══ */
/* ═══════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#09090B] text-zinc-100 overflow-x-hidden">
      <DotGrid />

      {/* ─── Navigation ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-800/50" : ""
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5"
          >
            <Image src="/logo.png" alt="The High Council" width={28} height={28} className="rounded-lg" />
            <span className="text-sm font-semibold tracking-tight">The High Council</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#how-it-works" className="text-[13px] text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer">
              Manifesto
            </a>
            <a href="#agents" className="text-[13px] text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer">
              Agents
            </a>
            <Link
              href="/console"
              className="text-[13px] font-medium text-zinc-950 bg-zinc-100 hover:bg-white px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Initialize
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* ─── HERO: Asymmetric Split ─── */}
      <section className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[80vh]">

            {/* LEFT: Text + Interactive Input (5 cols) */}
            <div className="lg:col-span-5 relative z-10 pt-24 lg:pt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Status badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">System Online</span>
                </div>

                {/* Headline — offset left, NOT centered */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                  <span className="text-zinc-100">Orchestrate</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Intelligence.
                  </span>
                </h1>

                <p className="text-base text-zinc-500 leading-relaxed max-w-md mb-8">
                  Command your AI multi-agent council in an immersive spatial environment. Define intent, watch them execute, receive synthesized verdicts.
                </p>

                {/* Interactive Input — right in the hero */}
                <div className="relative max-w-md">
                  <Link href="/console" className="block group">
                    <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3.5 transition-all group-hover:border-zinc-700 group-hover:bg-zinc-900 cursor-pointer">
                      <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Terminal className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-sm text-zinc-600 flex-1 font-mono">Initialize agents to analyze market t...</span>
                      <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center shrink-0 group-hover:bg-blue-400 transition-colors">
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Version */}
                <p className="mt-6 text-[11px] text-zinc-700 font-mono">v2.0 • BETA</p>
              </motion.div>
            </div>

            {/* RIGHT: Console Preview + Floating Agents (7 cols) */}
            <div className="lg:col-span-7 relative min-h-[500px] lg:min-h-[600px]">
              {/* Console preview — bleeds right */}
              <div className="relative lg:ml-12 lg:-mr-20">
                <ConsolePreview />
              </div>

              {/* Floating agent orbs */}
              <AgentOrb
                delay={1.2}
                icon={Lightbulb}
                label="Prospector"
                color="bg-emerald-500"
                className="top-4 right-12 lg:right-24"
              />
              <AgentOrb
                delay={1.4}
                icon={Cpu}
                label="Architect"
                color="bg-violet-500"
                className="top-1/2 -translate-y-1/2 right-0 lg:-right-4"
              />
              <AgentOrb
                delay={1.6}
                icon={Layers}
                label="Curator"
                color="bg-amber-500"
                className="bottom-8 right-16 lg:right-28"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS: Logic Stream ─── */}
      <section id="how-it-works" className="relative py-32 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">The Logic Stream</h2>
            <p className="text-zinc-500 text-base max-w-lg">
              Watch the Council deliberate in real-time. Follow the flow of AI thought processes as multiple agents collaborate to solve complex problems.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Thought Process Feed */}
            <ThoughtFeed />

            {/* Right: Timeline Steps */}
            <div id="agents" className="space-y-0">
              <LogicStep
                step="01"
                title="Problem Ingestion"
                description="The initial query is parsed, categorized, and structured for optimal agent allocation. Context parameters are established."
                icon={Zap}
                delay={0}
              />
              <LogicStep
                step="02"
                title="Agent Deliberation"
                description="Multiple specialized agents engage in parallel processing. They debate hypotheses, challenge assumptions, and construct logic trees."
                icon={Cpu}
                delay={0.1}
              />
              <LogicStep
                step="03"
                title="Synthesis"
                description="Conflicting arguments are resolved. The most robust logical pathways are combined into a cohesive strategy."
                icon={Layers}
                delay={0.2}
              />
              <LogicStep
                step="04"
                title="Final Resolution"
                description="The finalized output is generated, formatted, and delivered alongside confidence scores and alternative considerations."
                icon={CheckCircle}
                delay={0.3}
                isLast
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Strip ─── */}
      <section className="relative py-24 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-4">Ready to convene the Council?</h2>
            <p className="text-zinc-500 text-sm mb-8 max-w-md mx-auto">
              Local AI. No cloud. No API keys. Just raw intelligence orchestrated on your machine.
            </p>
            <Link
              href="/console"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-950 bg-zinc-100 hover:bg-white px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Launch Console
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={14} height={14} className="opacity-40" />
            <span className="text-[11px] text-zinc-700 font-mono">The High Council</span>
          </div>
          <span className="text-[11px] text-zinc-800 font-mono">Local Intelligence Node</span>
        </div>
      </footer>
    </div>
  );
}
