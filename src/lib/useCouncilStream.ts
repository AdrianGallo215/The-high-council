import { useState, useCallback, useEffect } from "react";
import type { AgentRole, AgentStatus, CouncilState, SSEPayload } from "@/lib/types";

const STORAGE_KEY = "high_council_session";

interface AgentData {
  status: AgentStatus;
  text: string;
}

interface PersistedSession {
  councilState: CouncilState;
  finalIdea: string;
  agents: Record<"interpreter" | "investigador" | "creativo" | "curador", AgentData>;
}

const defaultAgentData = (): AgentData => ({ status: "idle", text: "" });

export function useCouncilStream() {
  const [councilState, setCouncilState] = useState<CouncilState>("idle");
  const [finalIdea, setFinalIdea] = useState("");

  // 4 agents
  const [interpreterStatus, setInterpreterStatus] = useState<AgentStatus>("idle");
  const [interpreterText, setInterpreterText] = useState("");

  const [investigadorStatus, setInvestigadorStatus] = useState<AgentStatus>("idle");
  const [investigadorText, setInvestigadorText] = useState("");

  const [creativoStatus, setCreativoStatus] = useState<AgentStatus>("idle");
  const [creativoText, setCreativoText] = useState("");

  const [curadorStatus, setCuradorStatus] = useState<AgentStatus>("idle");
  const [curadorText, setCuradorText] = useState("");

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as PersistedSession;
        setCouncilState(parsed.councilState);
        setFinalIdea(parsed.finalIdea);
        setInterpreterStatus(parsed.agents.interpreter.status);
        setInterpreterText(parsed.agents.interpreter.text);
        setInvestigadorStatus(parsed.agents.investigador.status);
        setInvestigadorText(parsed.agents.investigador.text);
        setCreativoStatus(parsed.agents.creativo.status);
        setCreativoText(parsed.agents.creativo.text);
        setCuradorStatus(parsed.agents.curador.status);
        setCuradorText(parsed.agents.curador.text);
      }
    } catch (err) {
      console.warn("Failed to restore session from localStorage", err);
    }
  }, []);

  // Save to LocalStorage when done
  useEffect(() => {
    if (councilState === "done") {
      const session: PersistedSession = {
        councilState,
        finalIdea,
        agents: {
          interpreter: { status: interpreterStatus, text: interpreterText },
          investigador: { status: investigadorStatus, text: investigadorText },
          creativo: { status: creativoStatus, text: creativoText },
          curador: { status: curadorStatus, text: curadorText },
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }, [councilState, finalIdea, interpreterStatus, interpreterText, investigadorStatus, investigadorText, creativoStatus, creativoText, curadorStatus, curadorText]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCouncilState("idle");
    setFinalIdea("");
    setInterpreterStatus("idle"); setInterpreterText("");
    setInvestigadorStatus("idle"); setInvestigadorText("");
    setCreativoStatus("idle"); setCreativoText("");
    setCuradorStatus("idle"); setCuradorText("");
  }, []);

  const getSettersForAgent = (role: AgentRole) => {
    switch(role) {
      case "interpreter": return { setStatus: setInterpreterStatus, setText: setInterpreterText };
      case "investigador": return { setStatus: setInvestigadorStatus, setText: setInvestigadorText };
      case "creativo": return { setStatus: setCreativoStatus, setText: setCreativoText };
      case "curador": return { setStatus: setCuradorStatus, setText: setCuradorText };
    }
  };

  const invoke = useCallback(async (topic?: string, config?: any) => {
    if (councilState === "running") return;

    // Reset everything
    setCouncilState("running");
    setFinalIdea("");
    setInterpreterStatus("idle"); setInterpreterText("");
    setInvestigadorStatus("idle"); setInvestigadorText("");
    setCreativoStatus("idle"); setCreativoText("");
    setCuradorStatus("idle"); setCuradorText("");

    try {
      const response = await fetch("/api/council/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, config }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to start SSE stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          
          let eolIndex;
          while ((eolIndex = buffer.indexOf("\n\n")) >= 0) {
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
                  getSettersForAgent(payload.agent).setStatus("streaming");
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
      interpreter: { status: interpreterStatus, text: interpreterText },
      investigador: { status: investigadorStatus, text: investigadorText },
      creativo: { status: creativoStatus, text: creativoText },
      curador: { status: curadorStatus, text: curadorText },
    },
    invoke,
    clearSession,
  };
}
