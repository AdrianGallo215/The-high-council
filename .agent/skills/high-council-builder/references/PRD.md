# Product Requirements: The High Council

## 1. Document Overview

Este documento define los requisitos funcionales y técnicos para "The High Council", una herramienta de orquestación de agentes de IA locales diseñada para la ideación automatizada de proyectos de desarrollo.

## 2. Document Metadata

| Field | Value |
|---|---|
| Target Release | Q1 2026 |
| Epic | Core Agent Orchestration |
| Document Status | 🟢 IN PROGRESS |
| Document Owner | Adrian Gallo |
| Designer | AI Architect |
| Tech Lead | Senior Vibe Coder |

## 3. Goals & Objectives

El objetivo principal es eliminar la parálisis de decisión del desarrollador mediante un sistema de "un solo clic" que genere ideas de proyectos validadas, creativas y ejecutables.

- **Automatización:** Eliminar el salto manual entre chats de IA.
- **Local-First:** Ejecutar todo mediante Ollama para privacidad y latencia cero.
- **Calidad:** Usar un sistema de tres agentes con roles contrapuestos para filtrar ideas mediocres.

## 4. User Stories

| ID | User Story | Priority |
|---|---|---|
| US.1 | Como desarrollador, quiero presionar un solo botón para recibir una propuesta de proyecto completa. | Must Have |
| US.2 | Como usuario, quiero ver el "pensamiento" (logs) de cada agente para confiar en el proceso. | Should Have |
| US.3 | Como desarrollador, quiero que la idea final incluya un stack tecnológico sugerido y una lista de tareas. | Must Have |
| US.4 | Como usuario, quiero poder configurar qué modelos de Ollama utiliza cada agente. | Could Have |

## 5. Functional Requirements

### 5.1 Pipeline de Agentes (The Council)

- **REQ-01: El Prospector:** El sistema debe invocar a un agente encargado de investigar/analizar tendencias técnicas y "puntos de dolor" en comunidades.
- **REQ-02: El Arquitecto:** El sistema debe pasar el output del Prospector a un segundo agente que transforme el problema en una solución visual y creativa.
- **REQ-03: El Curador:** Un tercer agente debe evaluar las propuestas anteriores y entregar un veredicto final imparcial.
- **REQ-04: Orquestación Secuencial:** Los agentes deben ejecutarse en orden, pasando el contexto del anterior al siguiente automáticamente.

### 5.2 Interfaz de Usuario (The Dashboard)

- **REQ-05: Action Center:** Botón prominente de "Invoke Council" con feedback visual de carga.
- **REQ-06: Agent Columns:** Visualización de tres columnas o paneles que se llenan dinámicamente con el texto que genera Ollama en tiempo real.
- **REQ-07: Idea Spotlight:** Un componente de "Resultado Final" con formato Markdown que presente la idea ganadora de forma clara y estética.

## 6. Technical Requirements

- **Frontend:** Next.js 14+ con Tailwind CSS.
- **IA Backend:** Integración con la API de Ollama (`http://localhost:11434/api/generate`).
- **Modelos Sugeridos:**
  - **Prospector:** `llama3` (Analítico)
  - **Arquitecto:** `gemma2` (Creativo)
  - **Curador:** `mistral` o `llama3:70b` (Lógico)
- **Comunicación:** Uso de API Routes de Next.js para manejar los streams de Ollama y evitar timeouts en el frontend.

## 7. Out of Scope

- Publicación directa a GitHub o Vercel de la idea generada.
- Sistema de login o base de datos en la nube (todo es local).
- Scraping real de sitios web (se simulará o se usará la base de conocimientos del modelo).

## 8. Success Metrics

- El flujo completo (3 agentes) debe terminar en menos de 45 segundos en hardware promedio.
- La propuesta final debe ser copiable y lista para ser usada como PRD de un nuevo proyecto.
