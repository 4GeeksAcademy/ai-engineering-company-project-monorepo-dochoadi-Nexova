# Progress

Tipo: estado

## Estado actual

Infraestructura del monorepo en construcción (Hito 1, paso 2 de 11). Todavía no hay ninguna feature de negocio implementada: ni agentes, ni API, ni dashboards.

## Hecho

- **2026-10-12 — Paso 1:** creada la rama `chore/hito-1-ai-setup` desde `main`; `.gitignore` con secretos (`.env*` salvo `.env.example`, `*.pem`, `*.key`), archivos personales (`*.rtf`), dependencias, builds y artefactos de test; matriz de evaluación del hito en `docs/hito-1/evaluacion.md` (criterios E1–E9).
- **2026-10-12 — Paso 2:** banco de memoria completo con contexto de negocio (`projectbrief.md`, `productContext.md`), técnico (`techContext.md`, `systemPatterns.md`) y de estado (`activeContext.md`, `progress.md`); corregida la errata `projectvrief.md` → `projectbrief.md`; fila E1 de la matriz actualizada.

## Pendiente

- Paso 3 en adelante: reglas en `.agents/`, `AGENTS.md` con flujo previo al commit, skill, workspace pnpm con `packages/shared`, `uis/website`, `uis/backoffice` y revisión final de convenciones y de la matriz de evaluación.

## Problemas conocidos

- **Push sin credenciales:** `git push` falla con `could not read Username for 'https://github.com'`; el entorno necesita credenciales de GitHub. Los commits del hito quedan en local hasta entonces.
- **`packages/shared/package.json` roto:** `main` y `types` apuntan a `index.ts` en la raíz del paquete, pero el archivo real es `packages/shared/types/index.ts`.
- **`README.md` desactualizado:** enlaza a `README.es.md`, que no existe en la raíz, y afirma que no hay `AGENTS.md` en la raíz, cuando sí existe.
- **`CONTEXT-Nexova.en.md` no es el contexto de empresa:** es un brief de un ejercicio de forecasting de ventas (XGBoost / Random Forest sobre `data/raw/nexova_sales.csv`); el contexto de empresa es `CONTEXT.md`.
- **`.devcontainer/post-create.sh` falla:** ejecuta `uv sync` con `set -euo pipefail`, pero no hay `pyproject.toml` en el repo.
