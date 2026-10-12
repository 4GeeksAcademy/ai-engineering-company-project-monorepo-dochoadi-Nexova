# System Patterns — Patrones obligatorios

Tipo: técnico

Patrones que cualquier código del monorepo debe respetar. Cada uno incluye el motivo, ligado a la realidad de Nexova.

## 1. `tenant_id` en cada dato, filtrado en la capa de datos

- **Regla:** toda entidad de cliente (tickets, casos de la base de conocimiento, vacantes, candidatos, CVs) lleva `tenant_id`. Toda consulta a Postgres y al vector store filtra por `tenant_id` en la propia query. Nunca se confía en una instrucción del prompt para separar clientes.
- **Por qué:** Nexova da soporte y selección a varias empresas de tecnología, retail y finanzas a la vez. Mezclar sus datos rompería la confianza del cliente y el RGPD, y una instrucción de prompt se puede saltar; un filtro en la query, no.

## 2. Tickets y CVs son input no confiable

- **Regla:** el contenido de tickets y CVs se pasa al LLM delimitado como datos, nunca concatenado como instrucciones. Las salidas del modelo se validan contra un esquema antes de actuar.
- **Por qué:** cualquier cliente final o candidato puede escribir texto que intente manipular al agente (prompt injection), por ejemplo para obtener datos de otro cliente o forzar una puntuación alta.

## 3. Baja confianza o caso sensible → escalado a humano (L2)

- **Regla:** si el match en la base de conocimiento no supera el umbral de confianza, o el caso es sensible, el HelpDesk Agent escala a un agente humano con el contexto ya resumido. En matching, los CVs incompletos o de baja confianza se marcan para revisión manual.
- **Por qué:** una respuesta L1 incorrecta es peor que una más lenta (hoy la resolución media ya es de 48 h); daña al cliente de Nexova y al cliente final. El escalado por defecto protege el SLA de 24 h sin sacrificar calidad.

## 4. El ranking de CVs es apoyo a la decisión, nunca rechazo automático

- **Regla:** el CV–Vacancy Matching Agent ordena y explica; no descarta candidatos. El consultor siempre toma la decisión final y puede reordenar el ranking.
- **Por qué:** Nexova opera en la UE y el art. 22 del RGPD limita las decisiones totalmente automatizadas con efectos significativos sobre las personas. Además, los requisitos por palabras clave pueden arrastrar sesgos.

## 5. Cada caso resuelto por un humano vuelve a la base de conocimiento

- **Regla:** cuando un agente de soporte resuelve un ticket escalado, la resolución se incorpora a la base de conocimiento de ese cliente (con su `tenant_id`).
- **Por qué:** hoy el conocimiento vive en la memoria de los 30 agentes de Roberto Díaz y en un Word de Drive. Sin este bucle, el agente se queda congelado en el primer día y nunca llega al 40 % de resolución en L1.

## 6. Toda decisión de un agente se registra en un log

- **Regla:** cada respuesta L1, escalado, alerta de SLA, puntuación de CV y override de consultor se registra con timestamp, `tenant_id`, entrada, decisión, confianza y fuentes usadas.
- **Por qué:** Nexova no tiene hoy telemetría ni logging centralizado. Sin registro no se pueden medir el % de L1, la groundedness, el recall top-5 ni la tasa de override, ni auditar una decisión ante un cliente o un candidato.

## 7. API centralizada, sin microservicios prematuros

- **Regla:** el backend completo vive en una única app FastAPI en `services/`, con un router por dominio (soporte, selección, formación…). Solo se extrae un worker cuando hay una necesidad real de ejecución separada.
- **Por qué:** el equipo técnico de Nexova es de 6 personas y ya sufre una colección de herramientas desconectadas; añadir servicios sueltos repetiría el problema.

## 8. Datos de empresa definidos una sola vez en `packages/shared`

- **Regla:** los tipos y datos comunes de Nexova (departamentos, responsables, líneas de negocio, cifras de la empresa) se definen en `packages/shared` (`@repo/shared-types`) y se importan desde `uis/website` y `uis/backoffice`, nunca se copian.
- **Por qué:** `CONTEXT.md` ya tiene una incoherencia (dos responsables de Ventas); duplicar los datos en cada app multiplicaría ese tipo de errores.
