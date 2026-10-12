# Hito 1 — Evaluación "Monorepo AI Setup"

Matriz de evidencias del Hito 1 del monorepo de Nexova Solutions: cada criterio enlaza con los archivos que lo demuestran y con cómo verificarlo.

| ID | Criterio | Bloque | Archivos | Cómo verificarlo | Resultado |
| --- | --- | --- | --- | --- | --- |
| E1 | El banco de memoria contiene contexto de negocio y técnico | 1 | `memory-bank/projectbrief.md`, `memory-bank/productContext.md`, `memory-bank/techContext.md`, `memory-bank/systemPatterns.md`, `memory-bank/activeContext.md`, `memory-bank/progress.md` | `find memory-bank -empty` (sin salida); `grep -l "^Tipo: negocio" memory-bank/*.md` (≥2); `grep -l "^Tipo: técnico" memory-bank/*.md` (≥2); `grep -lE "48 ?h\|Javier Almeida\|Roberto Díaz\|Marcos Ibáñez" memory-bank/*.md` (≥4); `grep -rniE "TODO\|TBD\|lorem" memory-bank/` (sin salida); `ls memory-bank/` (6 archivos) | Cumple: 2 archivos de negocio, 2 técnicos y 2 de estado, todos con datos reales de Nexova (departamentos, SLA 48 h → 24 h, agentes insignia) |
| E2 | AGENTS.md especifica un flujo de ≥4 pasos ordenados antes del commit | 3 | Pendiente | Pendiente | Pendiente |
| E3 | .agents/ contiene al menos una regla con alcance explícito | 2 | Pendiente | Pendiente | Pendiente |
| E4 | La skill tiene objetivo único, inputs documentados y criterios de aceptación verificables | 4 | Pendiente | Pendiente | Pendiente |
| E5 | ./uis/website arranca sin errores con el comando de desarrollo | 6 | Pendiente | Pendiente | Pendiente |
| E6 | La ruta / de ./uis/website renderiza una web corporativa completa alineada con CONTEXT.md | 6 | Pendiente | Pendiente | Pendiente |
| E7 | ./uis/backoffice existe, tiene layout propio y renderiza sin errores | 7 | Pendiente | Pendiente | Pendiente |
| E8 | ./uis/backoffice muestra contenido relevante de la empresa en pantalla | 7 | Pendiente | Pendiente | Pendiente |
| E9 | El código sigue las convenciones de carpetas sin duplicación innecesaria | 5 y 8 | Pendiente | Pendiente | Pendiente |
