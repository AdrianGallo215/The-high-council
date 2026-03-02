import { OllamaClient } from "../ollama/client";
import { PROSPECTOR_SYSTEM_PROMPT, buildProspectorUserPrompt } from "../prompts/prospector";

export async function runProspector(topic: string | undefined, custModel: string | undefined, onChunk: (text: string) => void): Promise<string> {
  const model = custModel || "llama3:latest";
  
  return OllamaClient.generateStream({
    model,
    system: PROSPECTOR_SYSTEM_PROMPT,
    prompt: buildProspectorUserPrompt(topic),
    onChunk
  });
}
