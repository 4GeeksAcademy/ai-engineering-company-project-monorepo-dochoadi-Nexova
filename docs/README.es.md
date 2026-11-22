# Carpeta `docs`

Esta carpeta contiene la **documentación transversal** del monorepo: guías de arquitectura, decisiones técnicas, convenciones, procesos, y cualquier material compartido entre aplicaciones, pipelines, agentes y workflows.

- **Propósito principal**: tener un punto único para la documentación “global” del proyecto (no específica de una sola app/agente).
- **Recomendación**: organiza la documentación por temas (arquitectura, despliegue, datos, seguridad, observabilidad, etc.) y mantén enlaces desde los READMEs de cada componente hacia estas guías.

## Contenido

| Ruta | Qué es |
| --- | --- |
| [`milestone-1/`](./milestone-1/README.md) | Hito 1 "Monorepo AI Setup": [matriz de evaluación](./milestone-1/evaluation.md) (criterios E1–E9), [guía de verificación](./milestone-1/verification.md) (cómo volver a comprobar cada paso), [informe de hallazgos](./milestone-1/report.md) para el responsable técnico, [resumen de aprendizaje](./milestone-1/recap.md), el [registro de aprendizaje](./milestone-1/learning-log.md) escrito a posteriori, los diseños aprobados y las capturas. Documentos en inglés. |
| [`milestone-1/instructor-feedback.md`](./milestone-1/instructor-feedback.md) | Comentarios del instructor sobre el Hito 1 (original en español y traducción al inglés) y la acción tomada en cada punto. |
| [`milestone-2/`](./milestone-2/README.md) | Hito 2 "Your Company's Public Website" (el sitio web público de Nexova): [informe final](./milestone-2/report.md), [resumen de aprendizaje](./milestone-2/recap.md), [matriz de evaluación](./milestone-2/evaluation.md) (criterios E1–E30, entregables y estándares del proyecto), [decisiones de contenido](./milestone-2/content-decisions.md), [guía de verificación](./milestone-2/verification.md), evidencias de [seguridad](./milestone-2/security.md), [accesibilidad](./milestone-2/accessibility.md) y [rendimiento](./milestone-2/performance.md), [registro de aprendizaje](./milestone-2/learning-log.md) y el [briefing oficial en español](./milestone-2/BRIEFING.es.md). Documentos en inglés. |
| [`milestone-3/`](./milestone-3/README.md) | Hito 3 "Building Scripts to Automate Tasks" (en curso): [matriz de evaluación](./milestone-3/evaluation.md), [decisiones](./milestone-3/decisions.md), [modelo de dominio](./milestone-3/model.md), [comparativa](./milestone-3/benchmark.md), [guía de verificación](./milestone-3/verification.md), [registro de aprendizaje](./milestone-3/learning-log.md) y el [briefing oficial en español](./milestone-3/BRIEFING.es.md). Documentos en inglés. |
| [`improvements.md`](./improvements.md) | Lista de mejoras de todos los hitos, para comparar y aplicar en el último. En inglés. |
| [`briefs/sales-forecasting.md`](./briefs/sales-forecasting.md) | Enunciado del ejercicio de previsión de ventas (hito posterior). |

## Registro de hitos

| Hito | Fechas | Qué se entregó | Resultado | PR y commit de merge | Detalle (registro de aprendizaje, verificación, informe) |
| --- | --- | --- | --- | --- | --- |
| M1 Monorepo AI Setup | 2026-10-12 a 2026-10-13 | Memoria del proyecto, reglas y skills del agente, workspace pnpm, datos compartidos, web y backoffice | Fusionado; E1–E9 cumplidos | [PR #1](https://github.com/4GeeksAcademy/ai-engineering-company-project-monorepo-dochoadi-Nexova/pull/1) · [`30f8e47`](https://github.com/4GeeksAcademy/ai-engineering-company-project-monorepo-dochoadi-Nexova/commit/30f8e47) | [registro de aprendizaje](./milestone-1/learning-log.md) · [verificación](./milestone-1/verification.md) · [informe](./milestone-1/report.md) · [incidencias y correcciones](./milestone-1/issues-log-m1.md) |
| M2 Your Company's Public Website | 2026-10-23 a 2026-11-16 | Web pública bilingüe, formulario de talento con validación, controles de seguridad y accesibilidad | Fusionado; E1–E30 cumplidos | [PR #2](https://github.com/4GeeksAcademy/ai-engineering-company-project-monorepo-dochoadi-Nexova/pull/2) · [`ee14825`](https://github.com/4GeeksAcademy/ai-engineering-company-project-monorepo-dochoadi-Nexova/commit/ee14825) | [registro de aprendizaje](./milestone-2/learning-log.md) · [verificación](./milestone-2/verification.md) · [informe](./milestone-2/report.md) · [incidencias y correcciones](./milestone-2/issues-log-m2.md) |
| M3 Building Scripts to Automate Tasks | 2026-11-22 a hoy | Hasta ahora: modelo de dominio, comparativa, parche de seguridad de Next.js, briefing, matriz de evaluación y convenciones (S00–S01) | En curso; siguiente S02 | Aún sin PR | [registro de aprendizaje](./milestone-3/learning-log.md) · [verificación](./milestone-3/verification.md) · informe en S11 · [incidencias y correcciones](./milestone-3/issues-log-m3.md) |

> _English version: [README.md](./README.md)._
