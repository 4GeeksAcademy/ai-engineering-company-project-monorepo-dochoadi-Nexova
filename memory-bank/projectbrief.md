# Project Brief — Nexova Solutions

Tipo: negocio

## Qué es Nexova

Nexova Solutions es una consultora de recursos humanos y talent acquisition fundada en **2011**, con sede central en **Valencia (España)** y oficina de expansión en **Miami (Florida)**. Tiene **120 empleados** y factura aproximadamente **8 millones de dólares** al año a través de tres líneas de negocio:

1. **Headhunting** de perfiles ejecutivos y mandos intermedios (~35 % de la facturación).
2. **Outsourcing de equipos de atención al cliente** para empresas tecnológicas (~45 %, la línea de mayor volumen).
3. **Formación corporativa** en habilidades blandas y liderazgo (~20 %).

Sus clientes son empresas **mid-size** de **tecnología, retail y servicios financieros** que externalizan total o parcialmente la gestión de su talento. La CEO y fundadora es **Laura Mendoza**.

## El problema

- **Operación manual:** los 40 consultores de selección leen a mano entre 30 y 80 CVs por búsqueda; el catálogo de formación es un PDF y las inscripciones un Google Form; Laura recibe un informe semanal en PDF que cada responsable tarda entre 4 y 8 horas en preparar.
- **Sistemas desconectados:** HubSpot, un Zendesk heredado, Google Workspace, un ATS casero de principios de los 2010 y hojas de cálculo, sin telemetría ni logging centralizado.
- **Competencia de plataformas automatizadas:** nuevas plataformas basadas en datos compiten directamente con los servicios de Nexova, y la ventana para reaccionar no es ilimitada.

## Objetivo del proyecto

Dotar a Nexova de **sistemas, automatizaciones y agentes de IA** que le permitan hacer lo que ya hace bien (encontrar, formar y dar soporte al talento) más rápido, a mayor escala y con mucho menos trabajo manual.

## Alcance prioritario: los dos agentes insignia

### 1. L1 HelpDesk Support Agent (Soporte — Roberto Díaz)

Objetivo: bajar la resolución media de incidencias de **48 h** al **SLA comprometido de 24 h**, resolviendo en Nivel 1 al menos el **40 %** de los tickets sin intervención humana durante los 3 primeros meses en producción, con los datos de cada cliente estrictamente aislados.

Flujo resumido:
1. Llega un ticket por chat, email o widget, etiquetado con la empresa cliente a la que pertenece.
2. El agente genera el embedding de la consulta y busca casos similares en la base de conocimiento, filtrando solo los datos de ese cliente (filtro duro, no instrucción en el prompt).
3. Decide: responde directamente (match de alta confianza, L1), escala a un humano con resumen (baja confianza o caso sensible, L2), o marca el ticket como SLA en riesgo si lleva demasiado tiempo abierto.
4. Registra el resultado y añade a la base de conocimiento cada caso nuevo resuelto por un humano.

### 2. CV–Vacancy Matching Agent (Selección — Javier Almeida)

Objetivo: sustituir la lectura manual de 30–80 CVs por búsqueda por un ranking explicable de candidatos según los requisitos que define el consultor, sin mezclar nunca datos de candidatos entre clientes de Nexova.

Flujo resumido:
1. Se da de alta una vacante con requisitos obligatorios (must-have) y deseables (nice-to-have).
2. Los CVs entrantes se parsean a campos estructurados: skills, experiencia, seniority, idiomas, expectativa salarial.
3. El agente puntúa cada CV contra los requisitos y ordena el pool; los CVs incompletos o de baja confianza se marcan para revisión manual en vez de puntuarse en silencio.
4. El consultor ve el ranking, puede reordenarlo, y esa decisión (aceptado / modificado) queda registrada para calibrar los pesos.

## Métricas de éxito

| Métrica | Objetivo | Agente |
| --- | --- | --- |
| Tickets resueltos en L1 sin escalado | ≥ 40 % | HelpDesk |
| Tiempo medio de resolución | < 24 h (hoy 48 h) | HelpDesk |
| Groundedness / fidelidad de las respuestas L1 frente a la base de conocimiento | Sin respuestas alucinadas que lleguen al cliente | HelpDesk |
| Recall top-5 frente a quién se contrató realmente en procesos similares | Los candidatos correctos aparecen arriba | Matching |
| Tasa de override de los consultores | Alta al principio (sirve para calibrar) y descendente con el tiempo | Matching |

## Fuera de alcance de este hito

El Hito 1 ("Monorepo AI Setup") **no construye features de negocio**: ni los agentes, ni la API, ni los dashboards. Solo prepara la infraestructura del monorepo (banco de memoria, reglas y flujo del agente de código, skill, workspace, website y backoffice base) sobre la que se construirán en hitos posteriores.
