import { useState, useCallback } from "react";
import type { AgentRole, AgentStatus, CouncilState, SSEPayload } from "@/lib/types";

export function useCouncilStream() {
  const [councilState, setCouncilState] = useState<CouncilState>("idle");
  const [finalIdea, setFinalIdea] = useState("");

  const [prospectorStatus, setProspectorStatus] = useState<AgentStatus>("idle");
  const [prospectorText, setProspectorText] = useState("");

  const [architectStatus, setArchitectStatus] = useState<AgentStatus>("idle");
  const [architectText, setArchitectText] = useState("");

  const [curatorStatus, setCuratorStatus] = useState<AgentStatus>("idle");
  const [curatorText, setCuratorText] = useState("");

  const getSettersForAgent = (role: AgentRole) => {
    switch(role) {
      case "prospector": return { setStatus: setProspectorStatus, setText: setProspectorText };
      case "architect": return { setStatus: setArchitectStatus, setText: setArchitectText };
      case "curator": return { setStatus: setCuratorStatus, setText: setCuratorText };
    }
  };

  const invoke = useCallback(async (topic?: string) => {
    if (councilState === "running") return;

    // Reset everything
    setCouncilState("running");
    setFinalIdea("");
    setProspectorStatus("idle"); setProspectorText("");
    setArchitectStatus("idle"); setArchitectText("");
    setCuratorStatus("idle"); setCuratorText("");

    try {
      const response = await fetch("/api/council/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to start SSE stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = ""; // Required for chunks that arrive incomplete across network boundaries

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          
          let eolIndex;
          while ((eolIndex = buffer.indexOf("\\n\\n")) >= 0) {
            const chunk = buffer.slice(0, eolIndex).trim();
            buffer = buffer.slice(eolIndex + 2);
            
            if (chunk.startsWith("data: ")) {
              try {
                const dataRaw = chunk.slice(6);
                const payload = JSON.parse(dataRaw) as SSEPayload;
                
                if (payload.event === "agent:start" && payload.agent) {
                  getSettersForAgent(payload.agent).setStatus("thinking");
                } 
                else if (payload.event === "agent:chunk" && payload.agent && payload.content !== undefined) {
                  getSettersForAgent(payload.agent).setText(prev => prev + payload.content);
                } 
                else if (payload.event === "agent:done" && payload.agent) {
                  getSettersForAgent(payload.agent).setStatus("done");
                } 
                else if (payload.event === "council:complete" && payload.content) {
                  setFinalIdea(payload.content);
                  setCouncilState("done");
                }
                else if (payload.event === "error") {
                  setCouncilState("idle");
                  console.error("Agent flow error:", payload.content);
                  break;
                }
              } catch (err) {
                console.error("Failed to parse SSE chunk:", chunk, err);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
      setCouncilState("idle");
    }
  }, [councilState]);

  return {
    councilState,
    finalIdea,
    agents: {
      prospector: { status: prospectorStatus, text: prospectorText },
      architect: { status: architectStatus, text: architectText },
      curator: { status: curatorStatus, text: curatorText },
    },
    invoke,
  };
}
