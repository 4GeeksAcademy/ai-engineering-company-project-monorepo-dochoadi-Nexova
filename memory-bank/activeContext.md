# Active Context

Tipo: estado

## Foco actual

**Hito 1 — Monorepo AI Setup**, en la rama `chore/hito-1-ai-setup`. Se prepara la infraestructura del monorepo para trabajar con agentes de código; todavía no hay features de negocio. La matriz de evidencias está en `docs/hito-1/evaluacion.md`.

## Próximos pasos

1. Reglas del agente de código en `.agents/`, con alcance explícito (criterio E3).
2. `AGENTS.md` en la raíz, con un flujo ordenado de al menos 4 pasos antes de cada commit (E2).
3. Una skill con objetivo único, inputs documentados y criterios de aceptación verificables (E4).
4. Workspace pnpm y datos compartidos de Nexova en `packages/shared` (E9).
5. `uis/website`: web corporativa de Nexova en Next.js en el puerto 3000 (E5, E6).
6. `uis/backoffice`: aplicación interna con layout propio en el puerto 3001 (E7, E8).

## Decisiones recientes

- **Responsable de Ventas = Marcos Ibáñez.** Fuente: la ficha detallada de `CONTEXT.md` (sección "Sales and Business Development", línea 62), que coincide con el brief de forecasting `CONTEXT-Nexova.en.md`. Es el nombre que se usa en el memory-bank completo y en el código. `CONTEXT.md` no se modifica.

## Preguntas abiertas

- **Contradicción en `CONTEXT.md` sobre Ventas:** la descripción general (línea 24) nombra a **Megan Clarke** como responsable del equipo de 18 personas, mientras que la ficha del departamento (línea 62) nombra a **Marcos Ibáñez**. Se ha decidido usar Marcos Ibáñez, pero falta confirmar con el autor del contexto si Megan Clarke es un error o tiene otro rol.
- **Falta `data/raw/nexova_sales.csv`:** el brief de forecasting (`CONTEXT-Nexova.en.md`) da por hecho que existe, con 120 filas `consolidated` de 2016-01 a 2025-12, pero no está en el repo. Hay que conseguirlo o generarlo con `random_state=42` antes de abordar ese entregable.
- **Decisiones técnicas abiertas** (detalle en `techContext.md`): Qdrant frente a pgvector; Python frente a TypeScript para el scoring de CVs; proveedor de LLM (Anthropic u OpenAI).
