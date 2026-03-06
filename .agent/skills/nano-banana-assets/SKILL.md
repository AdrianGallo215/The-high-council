---
name: nano-banana-assets
description: Usa este skill cuando el usuario pida generar o editar assets visuales con estilo premium (hero images, iconos, patrones, texturas, backgrounds, ilustraciones UI) usando Gemini CLI + nanobanana. Especialmente útil para mejorar el look de landing pages, dashboards y apps y evitar diseños genéricos.
---

# Nano Banana Assets Skill (Antigravity)

## Goal

Generar assets visuales de alta calidad usando Gemini CLI con la extensión nanobanana, manteniendo consistencia con el design system del proyecto.

## When to use

Usar este skill cuando el usuario pida:

- Hero image / hero graphic
- Iconos de producto
- Background patterns / textures
- Ilustraciones para landing
- Edición de imágenes existentes para UI marketing

## Instructions

1. Identifica el tipo de asset requerido: `generate`, `icon`, `pattern`, `edit`.
2. Si existe un design system (ej. `DESIGN.md`), léelo primero para mantener consistencia (colores, estilo, tono visual).
3. Construye un prompt visual claro y profesional:
   - estilo
   - paleta
   - composición
   - uso final (hero / icon / background)
   - restricciones (sin texto, contraste alto, etc.)
4. Abre terminal en la raíz del proyecto.
5. Ejecuta `gemini`.
6. Usa uno de estos comandos en Gemini CLI:
   - `/generate "<prompt>"`
   - `/icon "<prompt>"`
   - `/pattern "<prompt>"`
   - `/edit <archivo> "<instrucción>"`
7. Guarda o mueve el resultado a `assets/generated/` (crear carpeta si no existe).
8. Reporta al usuario:
   - qué prompt se usó
   - ruta del archivo generado
   - una sugerencia de variantes (2-3) para iterar

## Constraints

- No generar assets que contradigan el style guide del proyecto.
- Priorizar fondos limpios y usables para UI (no arte caótico).
- Si el usuario no especifica estilo, proponer 2 opciones antes de generar (ej. minimal-tech / premium-soft / editorial).

## Output format

- Resumen corto
- Prompt final usado
- Ruta(s) del archivo generado
- Próximas iteraciones sugeridas
