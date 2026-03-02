import type { OllamaRequest, OllamaStreamChunk } from "../types";

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || "http://localhost:11434";

interface GenerateParams {
  model: string;
  system: string;
  prompt: string;
  onChunk: (text: string) => void;
}

export class OllamaClient {
  /**
   * Generates a streaming response from the local Ollama instance.
   */
  static async generateStream({ model, system, prompt, onChunk }: GenerateParams): Promise<string> {
    const requestBody = {
      model,
      system,
      prompt,
      stream: true,
      options: {
        temperature: 0.7, // Sane default
      }
    };

    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Ollama API Error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Could not get response stream");

      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        let eolIndex;
        while ((eolIndex = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, eolIndex).trim();
          buffer = buffer.slice(eolIndex + 1);

          if (line) {
            try {
              const chunk = JSON.parse(line) as OllamaStreamChunk;
              if (chunk.response) {
                fullText += chunk.response;
                onChunk(chunk.response);
              }
            } catch (err) {
              console.warn("Failed to parse Ollama chunk", err);
            }
          }
        }
      }

      return fullText;
    } catch (error: any) {
      console.error("Ollama connection failed:", error);
      throw new Error(`Ollama connection failed: ${error.message}`);
    }
  }
}
