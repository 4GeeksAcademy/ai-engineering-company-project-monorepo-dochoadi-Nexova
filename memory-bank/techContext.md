# Tech Context — Monorepo de Nexova

Tipo: técnico

## Stack del monorepo

| Capa | Tecnología | Ubicación |
| --- | --- | --- |
| Frontends | Next.js (App Router) + TypeScript en modo `strict` | `uis/website`, `uis/backoffice` |
| Gestión de paquetes JS/TS | Workspace de pnpm (activado vía Corepack en el devcontainer) | Raíz del repo |
| Tipos y datos compartidos | Paquete `@repo/shared-types` | `packages/shared` |
| Backend (futuro) | Python + FastAPI como **API única** de la empresa, con un router por dominio | `services/` |

## Stack planificado de los agentes

Según `Company-choice.md`:

- **Servicio del agente:** Python + FastAPI (HelpDesk Support Agent).
- **Metadatos de tickets, casos, candidatos y vacantes:** Postgres.
- **Base de conocimiento:** vector store con búsqueda híbrida; se propone **Qdrant**.
- **LLM:** vía API (Anthropic u OpenAI), para respuestas basadas en recuperación y para resumir tickets.
- **Parsing de CVs:** extracción de texto + llamada al LLM para normalizar los campos al esquema esperado.
- **Dashboard de supervisores:** Next.js, para seguir en tiempo real el riesgo de SLA y los escalados.

## Estructura de carpetas

| Carpeta | Qué va ahí |
| --- | --- |
| `CONTEXT.md` | Fuente única de verdad del dominio de Nexova |
| `memory-bank/` | Memoria persistente del proyecto para el agente de código (este banco) |
| `uis/` | Cualquier aplicación con pantallas: `website/` (web pública) y `backoffice/` (aplicación interna) |
| `services/` | API centralizada de FastAPI y, solo si hace falta, workers en segundo plano |
| `data/raw/` | Datos de origen sin transformar, con su procedencia y reglas de PII documentadas |
| `data/pipelines/` | Jobs ETL/ELT de ingesta, limpieza y transformación |
| `data/process/` | Salidas limpias o intermedias producidas por los pipelines |
| `data/eval/` | Golden sets y datasets de evaluación de RAG, agentes y pipelines |
| `agents/` | Un subdirectorio por agente de producto, partiendo de `agents/_template/`; herramientas comunes en `agents/tools/` |
| `skills/` | Capacidades reutilizables de agentes: `SKILL.md` + scripts y recursos |
| `mcps/` | Un servidor MCP por subcarpeta, para dar a los modelos acceso a sistemas y datos |
| `workflows/` | Flujos de n8n y orquestación entre sistemas |
| `packages/` | Librerías versionables compartidas (`@repo/shared-types`, SDKs, componentes) |
| `shared/` | Recursos sueltos: esquemas JSON, plantillas, specs OpenAPI, design tokens |
| `docs/` | Documentación transversal: arquitectura, ADRs, convenciones, evaluación de hitos |
| `infra/` | Dockerfiles, Terraform, manifiestos de despliegue, CI/CD |
| `scripts/` | Scripts auxiliares de un solo archivo (setup, seeds, migraciones puntuales) |
| `internal/` | Herramientas internas con sus propias dependencias y tests (CLIs, evaluadores de prompts) |
| `docker-compose.yml` | En la raíz: orquesta el entorno local de `services/`, bases de datos y contenedores |

## Restricciones técnicas

- **Aislamiento multi-tenant obligatorio:** Nexova atiende a varios clientes de outsourcing y de selección; sus datos no se pueden mezclar nunca. El filtro por cliente se aplica en la capa de datos y en la consulta al vector store.
- **RGPD (UE):** Nexova opera desde Valencia. Los datos de candidatos y empleados son datos personales, y una decisión de contratación no puede ser completamente automatizada (art. 22).
- **Sin PII real en el repositorio:** en `data/` solo datos sintéticos o anonimizados; nada de CVs, tickets ni datos de empleados reales.
- **Inputs no confiables:** el texto de tickets y CVs se trata como dato, nunca como instrucciones (riesgo de prompt injection).
- **Secretos fuera del repo:** `.gitignore` excluye `.env*` (salvo `.env.example`), `*.pem`, `*.key` y `*.rtf`.

## Entorno

- **Desarrollo:** GitHub Codespaces / devcontainer (`.devcontainer/devcontainer.json`, imagen `universal:2`, Docker-in-Docker vía socket). `post-create.sh` activa pnpm con Corepack e instala `uv`.
- **Puertos:**

| Puerto | Servicio |
| --- | --- |
| 3000 | `uis/website` |
| 3001 | `uis/backoffice` |
| 8000 | API FastAPI (futura) en `services/` |
| 5678 | n8n (`workflows/`) |

El devcontainer reenvía hoy 3000, 8000 y 5678; el 3001 hay que añadirlo cuando exista el backoffice.

## Decisiones abiertas

- **Vector store:** Qdrant (propuesto en `Company-choice.md`, búsqueda híbrida nativa) frente a pgvector (menos piezas, al reutilizar el Postgres de metadatos).
- **Lenguaje del scoring de CVs:** `Company-choice.md` lo plantea en TypeScript de punta a punta, alineado con la spec de scoring del Hito 2 del curso, mientras que la API y el agente de soporte van en Python + FastAPI. Hay que decidir si el scoring vive en TypeScript o en Python.
- **Proveedor de LLM:** Anthropic frente a OpenAI, para respuestas RAG, resumen de tickets y normalización de CVs.
