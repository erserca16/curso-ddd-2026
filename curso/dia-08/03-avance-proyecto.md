# Avance del proyecto · Sesión 8 — EDA (mensajería)

## Meta hasta la sesión 9

- Identificar oportunidades de mejora en el proyecto aplicando EDA (eventos de dominio).
- Practicar publicación/consumo con RabbitMQ (exchanges, colas, bindings).
- Definir estrategia de errores: retry + DLQ + métricas.

---

## Tareas sugeridas

1. Definir el contrato de evento (mínimo viable)
   - `type`, `version`, `timestamp`, `correlationId`, `payload`.
2. Acordar topología RabbitMQ del proyecto
   - Exchanges (topic), routing keys y colas por bounded context.
3. Implementar un consumer real en un servicio
   - Validación de schema + idempotencia.
4. Configurar DLQ
   - Retry con backoff + dead-letter para mensajes no procesables.
5. Observabilidad
   - Métricas: `messages_published_total`, `messages_consumed_total`, `consumer_errors_total`, `dlq_messages_total`.
