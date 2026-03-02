import { OllamaClient } from "../ollama/client";
import { CURATOR_SYSTEM_PROMPT, buildCuratorUserPrompt } from "../prompts/curator";

export async function runCurator(architectOutput: string, custModel: string | undefined, onChunk: (text: string) => void): Promise<string> {
  const model = custModel || "gemma3:latest";
  
  return OllamaClient.generateStream({
    model,
    system: CURATOR_SYSTEM_PROMPT,
    prompt: buildCuratorUserPrompt(architectOutput),
    onChunk
  });
}
