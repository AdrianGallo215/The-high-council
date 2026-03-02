import { OllamaClient } from "../ollama/client";
import { ARCHITECT_SYSTEM_PROMPT, buildArchitectUserPrompt } from "../prompts/architect";

export async function runArchitect(topic: string | undefined, prospectorOutput: string, custModel: string | undefined, onChunk: (text: string) => void): Promise<string> {
  const model = custModel || "qwen2.5-coder:7b";
  
  return OllamaClient.generateStream({
    model,
    system: ARCHITECT_SYSTEM_PROMPT,
    prompt: buildArchitectUserPrompt(topic, prospectorOutput),
    onChunk
  });
}
