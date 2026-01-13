# Avance del proyecto · Sesión 7 — Sprint (Outbox + procesos distribuidos)

**Objetivo hasta la sesión 8 (EDA)**

- Completar un flujo distribuido entre `order-service` e `inventory-service` usando eventos.
- Publicación fiable de eventos con Outbox (sin “fantasías” de exactly-once).
- Observabilidad mínima del flujo: métricas y un dashboard básico en Grafana.

---

## Alcance del sprint (flujo objetivo)

Coreografía recomendada:

1. `order-service` crea una orden (`PENDING`) y publica `OrderCreated` (v1).
2. `inventory-service` consume `OrderCreated`, intenta reservar stock y publica:
   - `ProductInventoryReserved` (v1), o
   - `ProductInventoryReservationFailed` (v1).
3. `order-service` consume el resultado y transiciona la orden:
   - `CONFIRMED` si hay reserva, o
   - `CANCELLED` si falla (compensación).

> Alternativa (orquestada): implementar el Process Manager en `order-api` y mantener el estado del proceso allí.

---

## Tareas clave

| # | Componente | Entregable | Done? |
|---|------------|------------|-------|
| 1 | order-service | Outbox table + publisher (polling) para `OrderCreated` | |
| 2 | inventory-service | Consumer `OrderCreated` + publicación de resultado | |
| 3 | order-service | Consumer de inventario + transición de estado + proyección `order_status` | |
| 4 | Observabilidad | Métricas del flujo (`outbox_*`, `process_*`) + panel básico | |

### Checklist de calidad

- Idempotencia por `messageId`/`correlationId` en consumidores.
- Retries con backoff y DLQ para fallos permanentes.
- Contratos versionados (mínimo: `type`, `version`, `timestamp`, `payload`).

> Deadline: Miércoles 18-feb-2026 23:59.  
> **Demo live del flujo** abre la sesión 8 (EDA).
