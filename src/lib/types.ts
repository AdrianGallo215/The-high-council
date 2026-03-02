export type AgentRole = "prospector" | "architect" | "curator";

export type AgentStatus = "idle" | "thinking" | "done" | "error";

export interface AgentState {
  role: AgentRole;
  name: string;
  status: AgentStatus;
  content: string;
}

export interface FinalIdea {
  title: string;
  description: string;
  stack_manifest: string;
  tasks_list: string;
}

export type CouncilState = "idle" | "running" | "done";

export type SSEEventType = "agent:start" | "agent:chunk" | "agent:done" | "council:complete" | "error";

export interface SSEPayload {
  event: SSEEventType;
  agent?: AgentRole;
  content?: string;
}

export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
}

export interface OllamaStreamChunk {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}
