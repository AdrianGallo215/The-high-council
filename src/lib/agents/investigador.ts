import { OllamaClient } from "../ollama/client";
import { INVESTIGADOR_SYSTEM_PROMPT, buildInvestigadorUserPrompt } from "../prompts/investigador";

export async function runInvestigador(
  enrichedPrompt: string,
  custModel: string | undefined,
  onChunk: (text: string) => void
): Promise<string> {
  const model = custModel || "llama3:latest";

  return OllamaClient.generateStream({
    model,
    system: INVESTIGADOR_SYSTEM_PROMPT,
    prompt: buildInvestigadorUserPrompt(enrichedPrompt),
    onChunk,
  });
}
