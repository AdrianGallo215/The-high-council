import { NextResponse } from "next/server";
import type { AgentRole, SSEPayload } from "@/lib/types";

import { runCouncil } from "@/lib/orchestrator";

export async function POST(request: Request) {
  let topic: string | undefined = undefined;
  let config: any = undefined;
  
  try {
    const body = await request.json();
    if (body.topic && typeof body.topic === "string") {
      topic = body.topic.trim();
    }
    if (body.config) {
      config = body.config;
    }
  } catch (err) {
    // Ignore error if body is empty or not JSON
  }

  // We are going to respond with a ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Helper function to send SSE events
      const sendEvent = (payload: SSEPayload) => {
        const data = `data: ${JSON.stringify(payload)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      try {
        await runCouncil(topic, config, {
          onAgentStart: (agent: AgentRole) => {
            sendEvent({ event: "agent:start", agent });
          },
          onAgentChunk: (agent: AgentRole, chunk: string) => {
            sendEvent({ event: "agent:chunk", agent, content: chunk });
          },
          onAgentDone: (agent: AgentRole) => {
            sendEvent({ event: "agent:done", agent });
          },
          onCouncilComplete: (finalIdea: string) => {
            sendEvent({ event: "council:complete", content: finalIdea });
          },
          onError: (error: unknown) => {
            console.error("Council Execution Error:", error);
            const errMsg = error instanceof Error ? error.message : String(error);
            sendEvent({ event: "error", content: errMsg });
          }
        });
      } catch (error: any) {
        console.error("Fatal Stream Error:", error);
        sendEvent({ event: "error", content: "Stream interrupted unexpectedly." });
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
