# Sesión 1 · Martes 27-ene-2026  
**Duración:** 16:00 – 19:00  
**Tema global:** *Introducción a la Arquitectura de Microservicios (y cómo encaja DDD/Hexagonal/CQRS/EDA)*

---

## Objetivos del día

| # | Objetivo específico | Relevancia |
|---|---------------------|------------|
| 1 | Definir qué es la **arquitectura de microservicios** y sus principios principales. | Establece un lenguaje común para todo el curso y evita “microservicios” como etiqueta vacía. |
| 2 | Comparar microservicios frente a monolito y SOA, identificando ventajas, riesgos y cuándo no aplicarlos. | Permite decisiones arquitectónicas equilibradas (evita sobre-ingeniería). |
| 3 | Delimitar **límites de dominio** (bounded contexts) y proponer una primera descomposición de servicios. | Sin límites claros, la comunicación y el ownership se degradan desde el día 1. |
| 4 | Identificar estrategias base de escalabilidad/disponibilidad (sync/async, caché, resiliencia) que condicionan el diseño. | Conecta diseño de servicios con performance y tolerancia a fallos. |
| 5 | Clonar el repositorio y ejecutar la pila base del proyecto (`docker compose`) en local. | Asegura un entorno reproducible para las sesiones prácticas. |

---

## Agenda (3h)

| Hora | Bloque | Contenido |
|------|--------|-----------|
| 16:00–16:15 | Bienvenida & verificación de entorno | Clonado del repo y arranque de contenedores. |
| 16:15–16:55 | Microservicios 101 | Definición, principios, ventajas/desafíos y comparativa (monolito/SOA). |
| 16:55–17:10 | Descanso | Pausa breve. |
| 17:10–17:50 | Diseño por dominios | Límites de dominio, contexto de negocio y descomposición inicial. |
| 17:50–18:20 | Comunicación y escalabilidad (visión general) | Sync vs async, trade-offs y primeras estrategias de escalado/disponibilidad. |
| 18:20–18:50 | Lanzar el proyecto | `docker compose`, verificación de *health-checks* y exploración de endpoints. |
| 18:50–19:00 | Evaluación rápida | Quiz para afianzar los conceptos base. |

---

## Conceptos evaluados

- ¿Qué es la arquitectura de microservicios? Principios y características.
- Ventajas/desafíos y comparativa con monolito/SOA.
- Límites de dominio: contexto, ownership y primeras heurísticas de descomposición.
- Interfaces y contratos: qué decide un API y qué decide un evento.
- Panorama de escalabilidad/disponibilidad: caché, balanceo, asincronía y resiliencia.
- Arranque del entorno del proyecto (Docker Compose) y verificación de servicios.

*(La respuesta a cada punto deberá poder expresarse en menos de 30 segundos.)*

---

## Relación con el Proyecto Evolutivo

En esta primera sesión se valida el entorno de desarrollo y se ejecuta la base sin modificar el código. Este punto de partida común permitirá construir, de forma incremental, la solución final a lo largo del curso.

---

## Requisitos técnicos

- Docker ≥ 24 y Docker Compose v2  
- Node.js 20 LTS + **npm 10**  
- Visual Studio Code con extensiones ESLint, Prettier y Docker  
- Al menos **3 GB** de RAM libre para contenedores (PostgreSQL, RabbitMQ y dos servicios)

---

## Bibliografía y recursos recomendados

### Artículos y blogs

| Tema | Enlace |
|------|--------|
| Arquitectura Hexagonal | <https://alistair.cockburn.us/hexagonal-architecture/> |
| DDD en la práctica | <https://martinfowler.com/tags/domain%20driven%20design.html> |
| CQRS & Event Sourcing en Node | <https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs> |
| EDA y resiliencia | <https://martinfowler.com/articles/201701-event-driven.html> |

### Documentación oficial

- **OpenTelemetry:** <https://opentelemetry.io/docs/instrumentation/js/>  
- **RabbitMQ Tutorials:** <https://www.rabbitmq.com/getstarted.html>  
- **Prisma ORM:** <https://www.prisma.io/docs/>

### Libros

1. **“Domain-Driven Design Distilled”** – Vaughn Vernon  
2. **“Patterns of Enterprise Application Architecture”** – Martin Fowler  
3. **“Learning Event-Driven Architecture”** – Hugh McKee  
4. **“Clean Architecture”** – Robert C. Martin (referencia comparativa)
