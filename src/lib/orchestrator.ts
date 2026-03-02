import type { AgentRole } from "./types";
import { runProspector } from "./agents/prospector";
import { runArchitect } from "./agents/architect";
import { runCurator } from "./agents/curator";

export interface OrchestratorCallbacks {
  onAgentStart: (agent: AgentRole) => void;
  onAgentChunk: (agent: AgentRole, chunk: string) => void;
  onAgentDone: (agent: AgentRole) => void;
  onCouncilComplete: (finalIdea: string) => void;
  onError: (error: string) => void;
}

export async function runCouncil(topic: string | undefined, config: any, callbacks: OrchestratorCallbacks) {
  try {
    // 1. PROSPECTOR
    callbacks.onAgentStart("prospector");
    const prospectorOutput = await runProspector(topic, config?.prospector, (chunk) => {
      callbacks.onAgentChunk("prospector", chunk);
    });
    callbacks.onAgentDone("prospector");

    // 2. ARCHITECT
    callbacks.onAgentStart("architect");
    const architectOutput = await runArchitect(topic, prospectorOutput, config?.architect, (chunk) => {
      callbacks.onAgentChunk("architect", chunk);
    });
    callbacks.onAgentDone("architect");

    // 3. CURATOR
    callbacks.onAgentStart("curator");
    const curatorOutput = await runCurator(architectOutput, config?.curator, (chunk) => {
      callbacks.onAgentChunk("curator", chunk);
    });
    callbacks.onAgentDone("curator");

    // 4. DONE
    callbacks.onCouncilComplete(curatorOutput);
  } catch (error: any) {
    console.error("Orchestrator encountered an error:", error);
    callbacks.onError(error.message || "Unknown error during orchestration");
  }
}
