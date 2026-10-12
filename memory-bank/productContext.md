# Product Context — Departamentos de Nexova

Tipo: negocio

Fuente: `CONTEXT.md` (fichas por departamento) y `Company-choice.md`. Nexova tiene 120 empleados repartidos en las áreas siguientes.

## Dirección Ejecutiva

- **Responsable:** Laura Mendoza, CEO y fundadora (2011).
- **Equipo:** dirección; recibe el reporting de cada responsable de área.
- **Cómo trabajan hoy:** cada responsable de departamento prepara a mano un informe semanal en PDF para Laura.
- **Problema:** preparar el informe cuesta entre 4 y 8 horas por responsable cada semana, no hay una vista unificada del negocio y las decisiones estratégicas se toman con datos de hace una semana.
- **Qué necesitan:** dashboard ejecutivo unificado con KPIs en tiempo real de todas las áreas, informe semanal generado automáticamente, alertas por umbrales estratégicos y un asistente de IA en lenguaje natural al que Laura pueda preguntar directamente.

## Operaciones de Selección de Talento (negocio principal)

- **Responsable:** Javier Almeida.
- **Equipo:** 40 consultores de selección.
- **Cómo trabajan hoy:** llevan los procesos de reclutamiento de los clientes de principio a fin (briefing, cribado de CVs, entrevistas y colocación) de forma totalmente manual. Cada consultor lee entre 30 y 80 CVs por búsqueda y se comunica con los candidatos por emails individuales sin plantillas.
- **Problema:** no hay seguimiento en tiempo real del estado de cada candidato (los clientes llaman para preguntar) y el matching candidato-vacante depende solo de la intuición del consultor.
- **Qué necesitan:** pipeline de selección asistido por IA con scoring y ranking automático de CVs, sistema RAG sobre la base de candidatos ("perfiles con experiencia en ventas B2B e inglés C1"), portal del candidato con estado en tiempo real y un agente de comunicación que envíe emails de estado automáticos.

## Atención al Cliente (servicio externalizado)

- **Responsable:** Roberto Díaz.
- **Equipo:** 30 agentes.
- **Cómo trabajan hoy:** atienden incidencias de los clientes de outsourcing (tecnología, retail y finanzas) por teléfono, email y chat web. Resuelven por experiencia propia y con un documento Word compartido en Drive; no hay base de conocimiento centralizada.
- **Problema:** el tiempo medio de resolución es de **48 h** frente a un **SLA comprometido de 24 h**, y los supervisores no tienen visibilidad en tiempo real de la carga de trabajo ni del backlog.
- **Qué necesitan:** chatbot de primera línea que resuelva el 40 % de las consultas sin intervención humana usando RAG, base de conocimiento centralizada con búsqueda semántica, dashboard de soporte en tiempo real y análisis de sentimiento de tickets para detectar clientes insatisfechos antes de que escalen.

## Formación Corporativa

- **Responsable:** Elena Vargas.
- **Equipo:** 12 personas.
- **Cómo trabajan hoy:** diseñan e imparten cursos, talleres y webinars de liderazgo, comunicación y gestión de equipos. El catálogo es un PDF que se actualiza cada trimestre, las inscripciones llegan por un Google Form que se gestiona a mano en una hoja de cálculo y la asistencia se controla con listas en Excel.
- **Problema:** el catálogo es invisible para la mayoría de compradores potenciales, no hay registro de quién completó qué formación y la personalización es nula: cada cliente recibe la misma propuesta.
- **Qué necesitan:** catálogo buscable con inscripción online, sistema de recomendación de programas según el perfil del cliente, portal del alumno con seguimiento de progreso y un chatbot asesor que construya planes de formación personalizados.

## Ventas y Desarrollo de Negocio

- **Responsable:** Marcos Ibáñez (ver discrepancia registrada en `activeContext.md`).
- **Equipo:** 18 personas: 6 account managers (clientes actuales) y 12 SDRs (nuevos clientes).
- **Cómo trabajan hoy:** los SDRs prospectan a mano en LinkedIn, exportan listas a Excel y hacen seguimiento por email sin automatización. Tienen CRM (HubSpot), pero solo el 40 % del equipo lo actualiza de forma consistente.
- **Problema:** se pierden operaciones por falta de seguimiento y no hay visibilidad de qué prospectos tienen más probabilidad de cerrar.
- **Qué necesitan:** dashboard del pipeline de ventas, automatización de secuencias de prospección (primer contacto → seguimiento → cierre o descarte), alertas de operaciones con conversaciones inactivas y un agente de IA que sugiera ángulos de propuesta personalizados según el perfil del prospecto.

## Marketing y Comunicación

- **Responsable:** Carmen Ruiz.
- **Equipo:** equipo pequeño (`CONTEXT.md` no da la cifra).
- **Cómo trabajan hoy:** gestionan la web corporativa, LinkedIn, la newsletter mensual y el blog, con una producción completamente manual.
- **Problema:** la web es de 2019, lenta, poco accesible y no refleja el posicionamiento actual. Saben cuántas visitas reciben, pero no qué convierte.
- **Qué necesitan:** rediseño completo de la web corporativa con optimización SEO/GEO y marcado schema.org, pipeline de contenidos asistido por IA y dashboard de métricas de marketing (visitas, fuentes de tráfico y tasas de conversión).

## Recursos Humanos (interno)

- **Responsable:** Patricia Solís.
- **Equipo:** 4 personas, que atienden a los 120 empleados de Nexova.
- **Cómo trabajan hoy:** vacaciones, ausencias y consultas por email y hojas de cálculo; onboarding manual; evaluaciones de desempeño semestrales en Google Forms que nadie revisa sistemáticamente.
- **Problema:** no hay métricas: ni rotación, ni absentismo, ni tiempo medio de cobertura de puestos internos.
- **Qué necesitan:** portal interno de RR. HH., flujo de onboarding automatizado con checklists progresivos, dashboard de KPIs de RR. HH. y un agente interno que responda dudas sobre políticas y beneficios.

## Tecnología e Infraestructura

- **Responsable:** Sergio Molina, CTO.
- **Equipo:** 6 personas.
- **Cómo trabajan hoy:** mantienen un conjunto de herramientas desconectadas: HubSpot, un Zendesk heredado, Google Workspace, un ATS casero de los años 2010 y múltiples hojas de cálculo. Los despliegues son manuales.
- **Problema:** no hay telemetría ni logging centralizado; cuando algo falla, se enteran por los usuarios.
- **Qué necesitan:** telemetría y logging centralizados, pipeline de datos que alimente los dashboards de cada área, monitorización en tiempo real con alertas automáticas y un agente interno de ingeniería que responda preguntas de arquitectura consultando la documentación técnica.

## Usuarios de lo que construimos

| Usuario | Quién es | Qué espera de nuestros sistemas |
| --- | --- | --- |
| Consultores de selección | Los 40 consultores del equipo de Javier Almeida | Ranking explicable de CVs que puedan aceptar o corregir, y menos horas de lectura manual |
| Agentes de soporte | Los 30 agentes del equipo de Roberto Díaz | Tickets L2 que lleguen ya resumidos y una base de conocimiento consultable en lugar del Word de Drive |
| Supervisores de soporte | Supervisores del equipo de Roberto Díaz | Visibilidad en tiempo real de carga, backlog y tickets con SLA en riesgo antes de que venza el plazo de 24 h |
| Clientes de Nexova | Empresas mid-size de tecnología, retail y finanzas | Respuestas rápidas a sus incidencias, estado de sus procesos de selección y datos aislados de los de otros clientes |
| Candidatos | Profesionales en procesos de selección gestionados por Nexova | Saber en qué punto está su candidatura sin tener que preguntar, y un trato justo (con decisión final humana) |
| CEO | Laura Mendoza | Una vista unificada y actual del negocio, sin esperar al informe semanal en PDF |
