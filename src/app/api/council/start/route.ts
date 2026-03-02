import { NextResponse } from "next/server";
import type { AgentRole, SSEPayload } from "@/lib/types";

// --- MOCK DATA FOR SSE FLOW ---
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

export async function POST() {
  // Config timing properties for the mock
  const CHUNK_DELAY_MS = 30;

  // We are going to respond with a ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Helper function to send SSE events
      const sendEvent = (payload: SSEPayload) => {
        const data = `data: ${JSON.stringify(payload)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      // Helper function to simulate a token stream for a single agent
      const simulateAgentStream = async (agent: AgentRole, fullText: string) => {
        sendEvent({ event: "agent:start", agent });
        
        // Artificial delay before starting
        await new Promise(r => setTimeout(r, 500));

        // Let's break the mock text roughly by words and emit as chunks
        const tokens = fullText.split(/(\\s+)/);
        
        for (const token of tokens) {
          sendEvent({ event: "agent:chunk", agent, content: token });
          await new Promise(r => setTimeout(r, CHUNK_DELAY_MS));
        }

        sendEvent({ event: "agent:done", agent });
      };

      try {
        // Run sequence
        await simulateAgentStream("prospector", MOCK_PROSPECTOR_TEXT);
        await new Promise(r => setTimeout(r, 500));
        
        await simulateAgentStream("architect", MOCK_ARCHITECT_TEXT);
        await new Promise(r => setTimeout(r, 500));
        
        await simulateAgentStream("curator", MOCK_CURATOR_TEXT);
        await new Promise(r => setTimeout(r, 500));
        
        // Final completion event with the generated markdown idea
        sendEvent({ event: "council:complete", content: MOCK_FINAL_IDEA });
      } catch (error) {
        sendEvent({ event: "error", content: "Stream interrupted" });
      } finally {
        controller.close();
      }
    }
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
