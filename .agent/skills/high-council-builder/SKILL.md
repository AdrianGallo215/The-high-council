---
name: high-council-builder
description: Usa este skill cuando el usuario pida diseñar, implementar, refactorizar o validar cualquier parte de la app The High Council (frontend, backend, agentes Prospector/Arquitecto/Curador, dashboard, integración con Ollama, streaming SSE, prompts, APIs o arquitectura).
---

# High Council Builder

## Objetivo

Ayudar a construir la app "The High Council" manteniendo consistencia con PRD, SDD y Stack.

## Referencias

- `references/PRD.md` -> Requisitos funcionales, alcance, UX, flujos, métricas
- `references/SDD.md` -> Arquitectura, componentes, integración, errores, endpoints
- `references/STACK.md` -> Stack tecnológico, librerías, decisiones técnicas

## Cómo trabajar (protocolo)

1. Identifica el tipo de tarea:
   - feature nueva
   - implementación
   - bugfix
   - refactor
   - revisión de arquitectura
   - revisión de cumplimiento del spec
2. Lee primero la referencia mínima necesaria:
   - UX / requisitos -> PRD
   - arquitectura / integración -> SDD
   - tecnología / herramientas -> STACK
3. Si hay conflicto entre documentos:
   - PRD manda en el "qué"
   - SDD manda en el "cómo"
   - STACK guía el "con qué"
   - reporta el conflicto antes de implementar
4. Antes de escribir código, entrega un mini plan de 3-7 pasos.
5. Implementa cambios pequeños y verificables.
6. Al final entrega:
   - resumen de cambios
   - qué parte del PRD/SDD cubre
   - riesgos / pendientes

## Restricciones

- Mantener enfoque local-first (Ollama) para el MVP salvo que el usuario autorice otra cosa.
- No cambiar el stack principal sin justificar trade-offs.
- No inventar requisitos no presentes en PRD/SDD sin marcarlo como propuesta.
