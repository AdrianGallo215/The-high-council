# Tech Stack Manifest: The High Council

## 1. Core Architecture (The "Boring" Foundation)

Para garantizar la longevidad y una documentación excepcional, utilizaremos tecnologías con ecosistemas maduros.

- **Frontend & Framework:** Next.js 14+ (App Router)
  - **Razón:** Es el estándar de la industria para React. Ofrece API Routes integradas, fundamentales para manejar los streams de Ollama sin timeouts.
- **Lenguaje:** TypeScript
  - **Razón:** Proporciona seguridad de tipos, esencial para manejar las estructuras de datos que pasan entre el Prospector, Arquitecto y Curador.
- **Estilos:** Tailwind CSS
  - **Razón:** Permite construir la interfaz de "monitoreo" en modo oscuro con alta velocidad de desarrollo y bajo mantenimiento.

## 2. IA & Orchestration (The "Experimental" Core)

Este es el corazón de la aplicación, donde aprovechamos el potencial de la IA local.

- **Motor de IA:** Ollama (Local)
  - **Modelos:** Llama 3 (Analítico/Lógico) y Gemma 2 (Creativo)
- **Orquestación:** LangChain.js (Experimental Pick)
  - **Razón:** Aunque el SDD menciona lógica manual, LangChain es la herramienta líder para el Prompt Chaining. Facilitará la transferencia automática de contexto entre agentes (REQ-04) y la gestión de streams hacia el frontend.

## 3. Backend & Data (The "Reliable" Layer)

Aunque el PRD sugiere un enfoque "local-first" sin base de datos en la nube, para cumplir con tus criterios de escalabilidad y longevidad, propongo una solución híbrida:

- **Persistence:** Supabase (PostgreSQL)
  - **Uso:** Almacenamiento de sesiones, logs de agentes y la "Idea Final".
  - **Vibe Check:** Es la opción "boring" más potente hoy en día. Reemplaza el LocalStorage sugerido en el SDD por una estructura relacional sólida.
- **Real-time:** Supabase Realtime / Server-Sent Events (SSE)
  - **Uso:** Para alimentar el Action Center y las Agent Columns con el texto generado en tiempo real.

## 4. Deployment & DevOps

- **Hosting:** Vercel
  - **Razón:** Integración nativa con Next.js.
- **Local Tunneling:** Cloudflare Tunnel o Ngrok
  - **Razón:** Necesario para que el frontend en Vercel se comunique de forma segura con tu API local de Ollama (`localhost:11434`).

## Summary Table: The 1-to-1 Rule

Siguiendo tu regla de una tecnología "aburrida" por cada una "experimental":

| Boring Technology (Reliable) | Experimental/Hype Technology |
|---|---|
| Next.js / React (Frontend) | Ollama (Local LLM Orchestration) |
| PostgreSQL (Supabase) (Database) | LangChain.js (AI Agent Framework) |
| Tailwind CSS (Styling) | Vibe Coding Methodology |

## Next Steps

¿Te gustaría que redacte el Prompt de Sistema inicial para el primer agente (El Prospector), asegurando que el output sea compatible con el siguiente paso del Arquitecto?
