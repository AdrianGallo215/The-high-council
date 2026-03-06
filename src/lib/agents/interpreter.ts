import { OllamaClient } from "../ollama/client";
import { INTERPRETER_SYSTEM_PROMPT, buildInterpreterUserPrompt } from "../prompts/interpreter";

export async function runInterpreter(
  topic: string | undefined,
  custModel: string | undefined,
  onChunk: (text: string) => void
): Promise<string> {
  const model = custModel || "llama3:latest";

  return OllamaClient.generateStream({
    model,
    system: INTERPRETER_SYSTEM_PROMPT,
    prompt: buildInterpreterUserPrompt(topic),
    onChunk,
  });
}
