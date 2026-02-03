# Sesión 3 · Martes 03-feb-2026  
**Duración:** 16:00 – 19:00
**Tema global:** *Límites de dominio (bounded contexts), ownership y cómo se reflejan en el diseño del servicio*

**Temario (referencia):**
- [1 · Introducción a la arquitectura de microservicios](../../NUEVO_TEMARIO.md#1-introducción-a-la-arquitectura-de-microservicios)
  - Definición de límites de dominio y contexto del negocio
  - Separación de responsabilidades y funcionalidades en microservicios
  - Técnicas de descomposición y partición de servicios
- [3 · Comunicación y descubrimiento de servicios](../../NUEVO_TEMARIO.md#3-comunicación-y-descubrimiento-de-servicios)
  - Implementación de APIs y contratos de servicio
  - Patrones de comunicación entre microservicios (síncrona y asíncrona)
  - Gestión de errores y fallas en la comunicación
- [14 · Conocimiento y gestión de la complejidad del dominio](../../NUEVO_TEMARIO.md#14-conocimiento-y-gestión-de-la-complejidad-del-dominio)
  - Problemas de negocio
  - Descubrimiento del conocimiento
  - Comunicación
  - ¿Qué es el lenguaje ubicuo?
  - ¿Qué es un contexto delimitado?
  - Subdominios
  - Límites
  - Límites físicos
  - Límites de propiedad

## Objetivos del día

| # | Objetivo concreto                                                  | ¿Por qué importa?                                                            |
|---|--------------------------------------------------------------------|-------------------------------------------------------------------------------|
| 1 | Consolidar la base hexagonal (puertos/adaptadores) sin contaminar el dominio | Evita que el servicio derive en un “mini‑monolito”. |
| 2 | Definir **límites de dominio** del inventario (qué pertenece y qué no) | Los límites correctos reducen acoplamiento, fricción y duplicidades. |
| 3 | Identificar **subdominios** y ownership (límites físicos/de propiedad) | Alinea el diseño con la organización y con el ritmo de cambio. |
| 4 | Diseñar contratos iniciales de integración (API/eventos) y manejo de errores | Reduce fallos en comunicación y facilita evolución del sistema. |
| 5 | Avanzar el `inventory-service` con DIP + tests (dominio/aplicación) | Mantiene una base testeable y lista para integrar con otros servicios. |

---

## Relación con el Proyecto Final

Hoy trabajamos en dos fases:

1. **Durante la sesión (práctica local):** seguimos con el mini‑proyecto de ejercicios (el de la sesión 2) para practicar **límites de dominio**, contratos y testing sin depender de infra (rápido y muy iterativo).
2. **Al final (transfer):** aplicamos el mismo patrón a `project/services/inventory-service` (y dejamos preparado el límite con pedidos para futuras sesiones).

> Nota: el mini‑proyecto de ejercicios no está versionado. Si quieres tenerlo “cerca” del temario, créalo localmente en `curso/dia-02/ejercicios/` y sigue la guía `curso/dia-02/04-ejercicios.md`.

---

## Requisitos antes de empezar

- Para ejercicios (local): Node.js 20+ y editor listo  
- Para transfer al proyecto (final): repo `project/` funcionando y sin errores de TypeScript  
- Comprensión de Ports & Adapters y DI con Awilix  

Con estos cimientos, entramos en la Sesión 3 enfocados en reforzar el aprendizaje anterior y avanzar con un servicio concreto. ¡A por ello!
