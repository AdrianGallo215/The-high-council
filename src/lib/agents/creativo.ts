import { OllamaClient } from "../ollama/client";
import { CREATIVO_SYSTEM_PROMPT, buildCreativoUserPrompt } from "../prompts/creativo";

export async function runCreativo(
  enrichedPrompt: string,
  custModel: string | undefined,
  onChunk: (text: string) => void
): Promise<string> {
  const model = custModel || "llama3:latest";

  return OllamaClient.generateStream({
    model,
    system: CREATIVO_SYSTEM_PROMPT,
    prompt: buildCreativoUserPrompt(enrichedPrompt),
    onChunk,
    options: { temperature: 1.2 }, // MAX creativity
  });
}
