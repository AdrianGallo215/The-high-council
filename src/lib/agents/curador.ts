import { OllamaClient } from "../ollama/client";
import { CURADOR_SYSTEM_PROMPT, buildCuradorUserPrompt } from "../prompts/curador";

export async function runCurador(
  investigadorOutput: string,
  creativoOutput: string,
  custModel: string | undefined,
  onChunk: (text: string) => void
): Promise<string> {
  const model = custModel || "llama3:latest";

  return OllamaClient.generateStream({
    model,
    system: CURADOR_SYSTEM_PROMPT,
    prompt: buildCuradorUserPrompt(investigadorOutput, creativoOutput),
    onChunk,
  });
}
