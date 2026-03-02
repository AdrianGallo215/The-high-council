import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = process.env.OLLAMA_URL || "http://localhost:11434";
    const res = await fetch(url, { method: "GET" });
    
    if (res.ok) {
      return NextResponse.json({ status: "ok" });
    } else {
      return NextResponse.json({ status: "error", message: "Ollama is running but returned an error" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Ollama is not running. Connection refused." }, { status: 503 });
  }
}
