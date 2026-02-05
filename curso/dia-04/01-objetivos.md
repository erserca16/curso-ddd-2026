# Sesión 4 · Jueves 05-feb-2026  
**Duración:** 16:00 – 19:00  

**Tema global:** Fundamentos de DDD y transición del Modelo Anémico al Modelo Rico

**Temario (referencia):**
- [9 · Domain Driven Design (DDD)](../../NUEVO_TEMARIO.md#9-domain-driven-design-ddd)
  - ¿Qué es DDD?
  - Dominios principales (Core Domain)
  - Subdominios
  - Lenguaje ubicuo (Lenguaje común)
  - Patrones estratégicos
- [14 · Conocimiento y gestión de la complejidad del dominio](../../NUEVO_TEMARIO.md#14-conocimiento-y-gestión-de-la-complejidad-del-dominio)
  - Lenguaje empresarial
  - Modelo del dominio empresarial
  - ¿Qué es un modelo?
  - Modelado efectivo
  - Modelos inconsistentes en la arquitectura hexagonal

---

## Objetivos del día

| # | Objetivo concreto                                                                       | ¿Por qué importa?                                                                                 |
|---|-----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| 1 | Comprender los pilares estratégicos de DDD: Lenguaje Ubicuo, Subdominios y Bounded Contexts | Permite alinear el diseño del software con la realidad del negocio y evitar ambigüedades semánticas. |
| 2 | Dominar el concepto de Modelo Anémico vs Modelo Rico                                     | Reconocer las limitaciones de un dominio vacío y cómo un modelo rico encapsula reglas e invariantes. |
| 3 | Implementar Value Objects (`BookId`, `ReservationId`, `Quantity`) y Aggregate (`BookStock`) | Garantiza inmutabilidad, validación centralizada y coherencia de reglas (stock, idempotencia). |
| 4 | Identificar **Core Domain** y subdominios (soporte/genérico)                              | Permite priorizar inversión donde hay ventaja competitiva y reducir desperdicio.                   |
| 5 | Conectar DDD con el diseño de microservicios (bounded contexts como límites de servicio) | Evita “microservicios por CRUD” y alinea arquitectura con el negocio.                             |

---

## Estructura de la clase (fija)

- **Primera mitad:** teoría (ver `curso/dia-04/02-ddd-fundamentos.md`).  
- **Segunda mitad:** práctica guiada (ver `curso/dia-04/03-ejercicios.md`).  

> Referencia de “resultado final” del día (solo ejemplo, no para desarrollar en directo): `.local/dia-04-referencia/`.
