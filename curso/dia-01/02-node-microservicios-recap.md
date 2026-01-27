# Sesión 1 · Microservicios en Node.js – Estado del Arte (2026)

> _Spoiler:_ Node no es la panacea, pero si se emplea con rigor y TypeScript, junto a su modelo asíncrono podemos crear aplicaciones de alto rendimiento.

---

## 2. Selección de tecnologías y lenguajes de programación

| Necesidad      | Librería / Tool                               | Motivo                                               |
| -------------- | --------------------------------------------- | ---------------------------------------------------- |
| HTTP API       | **Fastify 4**                                 | 30‑40 % +rápido que Express, plugin ecosystem maduro |
| Broker         | **RabbitMQ 3.13**                             | Durable, buen soporte plugins, UI comprensible       |
| DB             | **PostgreSQL 17** + Prisma                    | TX ACID, rich JSON ops, migraciones declarativas     |
| Observabilidad | **OpenTelemetry 1.29** + Prometheus + Grafana | Estándar de facto                                    |
| Testing        | **Vitest**                                    | ESM native, peso pluma, mocking builtin              |
| Lint/Fmt       | **ESLint** + **Biome**                        | Biome reemplaza Prettier y acelera CI                |

---

## 3. Esqueleto mínimo de un microservicio Node + Hexagonal

```text
inventory-service/
│
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   └── value-objects/
│   ├── application/
│   │   ├── commands/
│   │   ├── queries/
│   │   └── services/
│   ├── infrastructure/
│   │   ├── repositories/
│   │   └── messaging/
│   └── main.ts        ← Adapter HTTP (Fastify)
│
├── tests/             ← prueban solo dominio + app (sin infra real)
├── package.json
└── Dockerfile
```

### main.ts (Adapter HTTP muy fino)

```ts
// src/main.ts
import Fastify from "fastify";
import { createOrderHandler } from "./infrastructure/http/order-handlers";

export const buildServer = () => {
  const app = Fastify({ logger: true });

  app.post("/orders", createOrderHandler);

  return app;
};

if (require.main === module) {
  buildServer().listen({ port: +process.env.PORT! || 3000 }, (err, addr) => {
    if (err) throw err;
    console.log(`🚀  up on ${addr}`);
  });
}
```

_Nota:_ La lógica de negocio está en `domain/` y `application/`, **no** aquí.

---

## 4. Configuración y despliegue de infraestructura para microservicios

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
    ports: ["5432:5432"]
  rabbit:
    image: rabbitmq:3.13-management
    ports: ["5672:5672", "15672:15672"]

  inventory-service:
    build: ./services/inventory-service
    depends_on: [postgres, rabbit]
    environment:
      DATABASE_URL: "postgresql://postgres:secret@postgres:5432/inventory"
      RABBIT_URL: "amqp://guest:guest@rabbit:5672"
```

Con esto, un **`docker compose up -d`** y el equipo está listo para el _hands‑on_.

---

## 5. Errores comunes en Node Microservices

1. **Bloquear el hilo** con CPU heavy (PDF generation) sin off‑load.
2. Confiar en `console.log` como sistema de logging → usa `pino`.
3. Contenedores sin límites de memoria → OOM killer en producción.
4. Tests que dependen de la DB real → ralentizan pipeline; usa dobles o testcontainers.
5. Repetir lógica de validación en capa HTTP y dominio. **DRY it!**

---

## 6. Checklist de “vida o muerte” para producción

- `process.on('unhandledRejection')` → log + exit(1)
- Health‑checks `/live` y `/ready` separados
- Traces 100 % de requests que incluyan _message IDs_
- Política de _retry_ idempotente en brokers
- Límite de 500 MB RAM por container (k8s/compose)

> **El checklist sirve para** evitar incidentes serios a las 3 a.m.

---

## 7. Gestión de dependencias y versionado de microservicios

En microservicios el versionado no es un detalle: es **una interfaz viva** entre equipos.

### 7.1 Dependencias en Node (prácticas recomendadas)

- Usa **lockfiles** (`package-lock.json`) y CI reproducible.
- Evita dependencias transversales que acoplen servicios (p. ej. “shared‑utils” sin gobierno).
- Para librerías compartidas, prefiere **paquetes versionados** (npm private/monorepo) y semver.

### 7.2 Implementación de APIs y contratos de servicio

- **HTTP APIs**: documenta con OpenAPI y valida compatibilidad (*backward compatible*).
- **Eventos**: documenta con AsyncAPI o un esquema JSON; evita romper consumidores.
- Técnica práctica: **Tolerant Reader** (el consumidor ignora campos desconocidos) + **Upcasters** cuando el evento evoluciona.
- Añade **contract tests** (consumer‑driven) para detectar roturas antes de desplegar consumidores y productores.

---

## 8. Implementación de comunicación entre microservicios (síncrona y asíncrona)

### 8.0 Patrones de comunicación entre microservicios (síncrona y asíncrona)

- **Request/Response** (HTTP/gRPC): consultas y comandos inmediatos; requiere límites y resiliencia.
- **Event Notification / Pub‑Sub**: “algo pasó” y los interesados reaccionan; reduce acoplamiento temporal.
- **Message Queue / Work Queue**: distribuir trabajo y absorber picos (workers).
- **Event‑Carried State Transfer**: eventos con estado suficiente para evitar llamadas de vuelta.

### 8.1 Síncrona (HTTP/gRPC)

Útil para consultas y comandos que requieren respuesta inmediata. Reglas mínimas:

- Contratos claros: errores estables (p. ej. 409 para conflicto de estado).

### 8.2 Asíncrona (mensajería/eventos)

Útil para desacoplar, absorber picos y reducir latencia percibida.

- Publica **eventos de dominio** (“OrderCreated”) y no “comandos remotos” disfrazados.
- Requiere idempotencia por `messageId`/`eventId` y **DLQ** (Dead Letter Queue).
- Para consistencia entre DB y broker, usa **Outbox** (lo trabajamos en sesiones posteriores).

---

### 8.3 Protocolos y formatos de intercambio de datos en microservicios

- **Protocolos**: HTTP/1.1 (ubicuidad), HTTP/2 (multiplexing), gRPC (HTTP/2 + Protobuf), AMQP (RabbitMQ).
- **Formatos**: JSON (DX), Protobuf/Avro (payloads compactos, *schema-first*), y consideraciones de compatibilidad.
- Regla práctica: elige el formato por **latencia, ancho de banda, tooling y evolución de esquema** (no por moda).
- Si el contrato es crítico y hay muchos consumidores, considera **schema registry** (Avro/Protobuf) y validación en CI.

### 8.4 Gestión de errores y fallas en la comunicación

- `timeout` corto por defecto + `retry` con *jitter* (solo si es idempotente).
- `circuit breaker` y `bulkhead` para proteger al llamador y evitar fallos en cascada.
- En asíncrono: idempotencia + reintentos + **DLQ** para mensajes “venenosos”.

---

## 9. Técnicas de monitoreo y gestión de microservicios

Un microservicio en producción sin observabilidad es un “sistema sin panel de control”.

- **Logs estructurados** (p. ej. `pino`) con `traceId`, `service`, `route`, `eventId`.
- **Métricas RED/GOLD**: *Rate, Errors, Duration* / *Latency, Errors, Traffic, Saturation*.
- **Trazas distribuidas** con OpenTelemetry (spans por request + spans por consumo/publicación de mensajes).
- **Health checks**: readiness (dependencias) vs liveness (proceso vivo).

---

## 10. Uso de herramientas de descubrimiento y registro de servicios

### 10.1 Service discovery (según entorno)

- **Docker Compose**: nombres de servicio como DNS interno (p. ej. `postgres`, `rabbit`).
- **Kubernetes**: `Service` + DNS (`<svc>.<ns>.svc.cluster.local`) y *labels*.
- Alternativas: Consul/Eureka para entornos no‑k8s o híbridos.

### 10.2 Gestión de configuraciones y variables de entorno en microservicios

- Variables de entorno (`DATABASE_URL`, `RABBIT_URL`, `OTEL_EXPORTER_OTLP_ENDPOINT`).
- No “secrets” en git; usa `.env` local + secret managers en despliegues reales.
