# Sesión 2 · Jueves 29-ene-2026  
**Duración:** 16:00 – 19:00
**Tema global:** *Arquitectura Hexagonal + DDD táctico: Domain Objects, Use Cases, Puertos y Adaptadores*

**Temario (referencia):** [10 · Arquitectura hexagonal y la aplicación de DDD](../../NUEVO_TEMARIO.md#10-arquitectura-hexagonal-y-la-aplicación-de-ddd) · [11 · Domain Objects y casos de uso](../../NUEVO_TEMARIO.md#11-domain-objects-y-casos-de-uso) · [12 · Patrones de arquitectura en DDD](../../NUEVO_TEMARIO.md#12-patrones-de-arquitectura-en-ddd)

## Objetivos del día

| # | Objetivo concreto                                                 | ¿Por qué importa?                                                      |
|---|-------------------------------------------------------------------|------------------------------------------------------------------------|
| 1 | Entender la arquitectura hexagonal y cómo se relaciona con DDD     | Protege el core de dominio y facilita evolución y testabilidad en microservicios. |
| 2 | Crear nuestros primeros **Domain Objects** (Entities/VO) y **Use Cases** | Traslada reglas de negocio a un modelo explícito (no a controladores). |
| 3 | Diferenciar **puertos de entrada/salida** y sus adaptadores        | Define contratos; reduce acoplamiento y habilita *swaps* tecnológicos. |
| 4 | Configurar DI con Awilix (scopes) e inyectar adapters (Postgres, broker) | Permite reemplazar infraestructura sin tocar dominio/aplicación. |
| 5 | Exponer un API HTTP fino que delegue en Use Cases + tests           | Un servicio operable necesita endpoints, contratos y pruebas automatizadas. |

---

## Agenda (3h)

| Hora | Bloque | Contenido |
|------|--------|-----------|
| 16:00–16:10 | Repaso y objetivos | Alinear conceptos y criterios de diseño. |
| 16:10–16:45 | Arquitectura Hexagonal | Puertos/adaptadores, DIP y comparación con capas. |
| 16:45–17:15 | Domain Objects | Entities vs Value Objects, invariantes y expresividad. |
| 17:15–17:25 | Descanso | Pausa breve. |
| 17:25–18:05 | Use Cases y puertos | Entradas/salidas, DTOs y orquestación sin framework. |
| 18:05–18:40 | Taller: inventory-service | Estructura, DI con Awilix, repo y primer endpoint. |
| 18:40–19:00 | Cierre | Revisión, dudas y siguientes pasos. |

## Relación con el Proyecto Final

Hoy avanzamos el **inventory-service**: implementamos el dominio, puerto, adapter Postgres, Use Case y la primera ruta HTTP.

---

## Requisitos antes de empezar

- Contenedores up (`docker compose up -d`)  
- Código de sesión 1 en `services/inventory-service` funcionando  
- VS Code abierto en la carpeta del servicio con ESLint activo  

Con estos objetivos claros, arrancamos sesión 2 enfocándonos en puertos, adapters y DI. ¡Vamos allá!
