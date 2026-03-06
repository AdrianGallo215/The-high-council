import type { AgentRole } from "./types";
import { runInterpreter } from "./agents/interpreter";
import { runInvestigador } from "./agents/investigador";
import { runCreativo } from "./agents/creativo";
import { runCurador } from "./agents/curador";

export interface OrchestratorCallbacks {
  onAgentStart: (agent: AgentRole) => void;
  onAgentChunk: (agent: AgentRole, chunk: string) => void;
  onAgentDone: (agent: AgentRole) => void;
  onCouncilComplete: (finalIdea: string) => void;
  onError: (error: string) => void;
}

export async function runCouncil(topic: string | undefined, config: any, callbacks: OrchestratorCallbacks) {
  try {
    // ─── STEP 1: INTERPRETER (invisible, enriches the query) ───
    callbacks.onAgentStart("interpreter");
    const enrichedPrompt = await runInterpreter(topic, config?.interpreter, (chunk) => {
      callbacks.onAgentChunk("interpreter", chunk);
    });
    callbacks.onAgentDone("interpreter");

    // ─── STEP 2: INVESTIGADOR & CREATIVO (in parallel) ───
    callbacks.onAgentStart("investigador");
    callbacks.onAgentStart("creativo");

    const [investigadorOutput, creativoOutput] = await Promise.all([
      runInvestigador(enrichedPrompt, config?.investigador, (chunk) => {
        callbacks.onAgentChunk("investigador", chunk);
      }),
      runCreativo(enrichedPrompt, config?.creativo, (chunk) => {
        callbacks.onAgentChunk("creativo", chunk);
      }),
    ]);

    callbacks.onAgentDone("investigador");
    callbacks.onAgentDone("creativo");

    // ─── STEP 3: CURADOR (evaluates all 6 proposals) ───
    callbacks.onAgentStart("curador");
    const curadorOutput = await runCurador(investigadorOutput, creativoOutput, config?.curador, (chunk) => {
      callbacks.onAgentChunk("curador", chunk);
    });
    callbacks.onAgentDone("curador");

    // ─── DONE ───
    callbacks.onCouncilComplete(curadorOutput);
  } catch (error: any) {
    console.error("Orchestrator encountered an error:", error);
    callbacks.onError(error.message || "Unknown error during orchestration");
  }
}
