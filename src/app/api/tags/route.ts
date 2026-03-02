import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = process.env.OLLAMA_URL || "http://localhost:11434";
    const res = await fetch(`${url}/api/tags`, { method: "GET" });
    
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ models: [] });
    }
  } catch (error) {
    return NextResponse.json({ models: [] });
  }
}
