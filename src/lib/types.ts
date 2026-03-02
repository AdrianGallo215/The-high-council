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
