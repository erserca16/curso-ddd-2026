# Avance del proyecto · Sesión 3 — Order Service (sprint)

**En sesión (30 min) + trabajo en casa**

## Objetivo

- Consolidar límites entre **Pedidos** e **Inventario** (evitar llamadas directas desde dominio).
- Avanzar el `inventory-service` (estructura, puertos y adapter Postgres) hasta poder levantarlo y probarlo.
- Iniciar el `order-service` con un modelo mínimo y un API HTTP fino.

---

## 1. Límite y responsabilidades del Order Service

El Order Service se encarga exclusivamente de **gestionar órdenes** (crear/consultar).

- No realiza llamadas directas a `inventory-service` desde el dominio.
- La orquestación “reservar stock → crear pedido” corresponde a un **cliente** (API Gateway/BFF) o a una **saga** (lo veremos en sesiones posteriores).

Esto mantiene el servicio **puro y centrado en su modelo de dominio**, reduciendo acoplamiento entre bounded contexts.

---

## 2. Contrato HTTP mínimo (Order Service)

### Modelo de datos (DTO/contrato)

**Order**

- `orderId`: string (UUID generado en backend)
- `status`: `"PENDING" | "CONFIRMED" | "CANCELLED"`
- `createdAt`: timestamp ISO‑8601
- `items`: `OrderItem[]`

**OrderItem**

- `sku`: string (ej. `"SKU-12345"`)
- `quantity`: number (entero positivo)

### POST `/orders`

**Body**

```json
{
  "items": [
    { "sku": "ABC-001", "quantity": 2 },
    { "sku": "XYZ-123", "quantity": 1 }
  ]
}
```

**Validaciones**

- `items` existe y no está vacío.
- `sku` no está vacío y cumple `^[A-Z0-9-]+$`.
- `quantity > 0`.

**Flujo interno**

1. Parsear y validar payload.
2. Crear entidad `Order` con `status="PENDING"` y `createdAt`.
3. Persistir `Order` en base de datos.
4. Responder `201 Created` con `{ orderId, status, createdAt }`.

**Flujo externo (fuera del Order Service)**

1. Cliente llama a `inventory-service` `POST /inventory/:sku/reserve` por cada ítem.
2. Si todas las reservas OK, invoca `POST /orders`.
3. Si una reserva falla, aborta y devuelve `409 Conflict` al cliente.

**Respuesta 201**

- Header `Location: /orders/{orderId}`
- Body:

```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "PENDING",
  "createdAt": "2026-02-03T16:15:30.000Z"
}
```

### GET `/orders/:orderId`

**Flujo interno**

1. Validar formato de `orderId`.
2. Recuperar `Order` desde repositorio.
3. Si no existe, responder `404 Not Found`.
4. Mapear a DTO y devolver `200 OK`.

**DTO 200**

```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "PENDING",
  "createdAt": "2026-02-03T16:15:30.000Z",
  "items": [
    { "sku": "ABC-001", "quantity": 2 },
    { "sku": "XYZ-123", "quantity": 1 }
  ]
}
```

### Errores comunes

| HTTP | Código interno | Mensaje |
|------|----------------|---------|
| 400 | `INVALID_PAYLOAD` | Datos de petición inválidos |
| 404 | `ORDER_NOT_FOUND` | Pedido no encontrado |
| 500 | `INTERNAL_ERROR` | Error interno del servidor |

---

## 3. Checklist de arquitectura hexagonal (Order Service)

- **Puertos** (`domain/ports`):
  - `OrderRepositoryPort` `{ save(order), findById(orderId) }`
- **Use Cases** (`application/use-cases`):
  - `CreateOrderUseCase` (valida y persiste)
  - `GetOrderUseCase` (recupera y mapea)
- **Adaptadores** (`infrastructure`):
  - `PrismaOrderRepository` (implementa el puerto)
  - `http` (routes/handlers que exponen endpoints)
- **DI y arranque** (`main.ts`):
  - `PrismaClient` singleton
  - repositorio scoped
  - inyección en Use Cases por contenedor DI
