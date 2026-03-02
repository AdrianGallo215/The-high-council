"use client";

import { useState } from "react";
import AgentCard from "@/components/AgentCard";
import InvokeButton from "@/components/InvokeButton";
import IdeaSpotlight from "@/components/IdeaSpotlight";
import type { AgentRole, AgentStatus, CouncilState } from "@/lib/types";

// --- MOCK DATA FOR UI TESTING ---
const MOCK_PROSPECTOR_TEXT = `[SYSTEM LOG] Analyzing current market gaps...
- Found high demand for developer productivity tools.
- Trends indicate API aggregators and local-first AI are growing.
- Identifying "Decision Fatigue" as a major developer pain point.
[PROPOSAL] A local AI tool that automatically architects projects.`;

const MOCK_ARCHITECT_TEXT = `[SYSTEM LOG] Receiving prospector data...
[DRAFTING ARCHITECTURE]
Concept: "The High Council"
Stack: Next.js + Tailwind + Ollama
Flow: User clicks button -> 3 Agents debate -> 1 Final Idea.
Visuals: Dark mode, monitoring dashboard aesthetic.
[STATUS] Architecture blueprint generated.`;

const MOCK_CURATOR_TEXT = `[SYSTEM LOG] Evaluating blueprint validity...
- Stack is solid and maintainable.
- Feasibility: High.
- Innovation: High.
[VERDICT] Approved for MVP. Compiling final project manifest...`;

const MOCK_FINAL_IDEA = `
# Project: The High Council

A local-first artificial intelligence orchestration dashboard designed to eliminate developer decision fatigue by automatically generating validated project ideas and tech stacks.

## The Core Concept
The system acts as a virtual "boardroom" where three LLM agents debate sequentially to refine a single project idea.

## Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 (Dark Mode, Neon Accents)
- **AI Core**: Ollama (Local)

## MVP Tasks
1. Setup basic Next.js and Tailwind architecture.
2. Build responsive mock UI.
3. Integrate real LLM streams via \`localhost:11434\`.
`;

export default function Home() {
  const [councilState, setCouncilState] = useState<CouncilState>("idle");
  
  // States for each agent
  const [prospectorStatus, setProspectorStatus] = useState<AgentStatus>("idle");
  const [architectStatus, setArchitectStatus] = useState<AgentStatus>("idle");
  const [curatorStatus, setCuratorStatus] = useState<AgentStatus>("idle");
  
  const [prospectorText, setProspectorText] = useState("");
  const [architectText, setArchitectText] = useState("");
  const [curatorText, setCuratorText] = useState("");
  
  const [finalIdea, setFinalIdea] = useState("");

  const simulateStream = async (
    text: string, 
    setStatus: (s: AgentStatus) => void, 
    setText: (t: string) => void
  ) => {
    setStatus("thinking");
    let currentText = "";
    setText("");
    
    // Simulate token by token streaming
    const chunks = text.split(" ");
    for (const chunk of chunks) {
      currentText += chunk + " ";
      setText(currentText);
      await new Promise(r => setTimeout(r, 50)); // 50ms per word
    }
    
    setStatus("done");
  };

  const handleInvoke = async () => {
    if (councilState === "running") return;
    
    // Reset state
    setCouncilState("running");
    setFinalIdea("");
    setProspectorStatus("idle"); setProspectorText("");
    setArchitectStatus("idle"); setArchitectText("");
    setCuratorStatus("idle"); setCuratorText("");

    // Simulate Prospector
    await simulateStream(MOCK_PROSPECTOR_TEXT, setProspectorStatus, setProspectorText);
    
    // Fake network delay
    await new Promise(r => setTimeout(r, 500));
    
    // Simulate Architect
    await simulateStream(MOCK_ARCHITECT_TEXT, setArchitectStatus, setArchitectText);
    
    await new Promise(r => setTimeout(r, 500));
    
    // Simulate Curator
    await simulateStream(MOCK_CURATOR_TEXT, setCuratorStatus, setCuratorText);
    
    // Final Result
    await new Promise(r => setTimeout(r, 800));
    setFinalIdea(MOCK_FINAL_IDEA);
    setCouncilState("done");
  };

  return (
    <>
      {/* Action Center */}
      <section className="mb-4">
        <InvokeButton state={councilState} onClick={handleInvoke} />
      </section>

      {/* Agents Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AgentCard 
          role="prospector" 
          name="The Prospector" 
          status={prospectorStatus} 
          content={prospectorText} 
        />
        <AgentCard 
          role="architect" 
          name="The Architect" 
          status={architectStatus} 
          content={architectText} 
        />
        <AgentCard 
          role="curator" 
          name="The Curator" 
          status={curatorStatus} 
          content={curatorText} 
        />
      </section>

      {/* Result Section */}
      {councilState === "done" && finalIdea && (
        <IdeaSpotlight content={finalIdea} />
      )}
    </>
  );
}
