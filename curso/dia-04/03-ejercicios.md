# Ejercicios · Sesión 4 (DDD táctico: de anémico → rico)

Foco: **práctica guiada** para consolidar lo visto en `curso/dia-04/02-ddd-fundamentos.md`, usando el mismo mini‑dominio del curso (biblioteca = inventario de copias).

Estructura fija:
- Primera mitad: teoría (documento 02).
- Segunda mitad: práctica (este documento).

> Estado de referencia (resultado final del día, solo para comparar): `.local/dia-04-referencia/`.

---

## Contexto (business)

Queremos representar y proteger una regla sencilla pero real:

- Un `BookStock` tiene `availableCopies`.
- Se puede **reservar** `N` copias para una `reservationId` (idempotente).
- Si no hay stock suficiente, falla (regla de dominio).
- La reserva genera un **Domain Event** (`CopiesReserved`) que la aplicación publicará.

Esto es conceptualmente 1:1 con el proyecto real (Inventario + reservas para pedidos), pero lo practicamos con un dominio pequeño para iterar rápido.

---

## Ejercicio 1 — Detectar “anemia” y definir invariantes

1. Escribe (en una nota o README local) 4–6 invariantes/decisiones del dominio:
   - `Quantity` siempre entero positivo.
   - `BookId` tiene formato estable.
   - `reservationId` define idempotencia.
   - No se puede reservar más de lo disponible.
2. Señala 2 sitios donde esas reglas suelen “escaparse” en código anémico:
   - controllers/routers,
   - repositorios/ORM,
   - validaciones duplicadas en tests.

Hecho cuando: el equipo puede decir “esta regla vive en el dominio” vs “esta validación es del contrato HTTP”.

---

## Ejercicio 2 — Value Objects (mover validación al dominio)

Crea/ajusta VOs para que **capturen semántica** y lancen errores tipados:

```ts
// .local/dia-04-referencia/src/domain/ReservationId.ts
import { InvalidReservationIdError } from "./errors.js";

export class ReservationId {
  private static readonly pattern = /^R-\d+$/;
  private constructor(private readonly value: string) {}

  static of(raw: string): ReservationId {
    if (!ReservationId.pattern.test(raw)) {
      throw new InvalidReservationIdError(
        "ReservationId must match format R-<number> (e.g. R-1)."
      );
    }
    return new ReservationId(raw);
  }

  toString(): string {
    return this.value;
  }
}
```

Hecho cuando: el router/HTTP solo valida “forma” (payload), y el dominio valida significado.

---

## Ejercicio 3 — Aggregate rico + regla de idempotencia

Refactor del agregado para:

- mantener reservas internas,
- aplicar idempotencia,
- lanzar `InsufficientStockError` / `ReservationConflictError`.

Pista (API esperada):

```ts
// .local/dia-04-referencia/src/domain/BookStock.ts
stock.reserve(reservationId, qty); // side effects + invariantes
```

Hecho cuando: la regla de “misma reservationId + qty ⇒ no duplica” está en el dominio y está testeada.

---

## Ejercicio 4 — Domain Events (del dominio hacia la aplicación)

Objetivo: que el agregado “registre” hechos y la aplicación los publique.

API sugerida:

```ts
// .local/dia-04-referencia/src/domain/BookStock.ts
const events = stock.pullDomainEvents(); // drena y limpia
```

Luego, en el Use Case:

```ts
// .local/dia-04-referencia/src/application/use-cases/ReserveCopiesUseCase.ts
stock.reserve(reservationId, qty);
await this.repo.save(stock);

for (const ev of stock.pullDomainEvents()) {
  await this.events.publish(ev);
}
```

Hecho cuando: si llamas dos veces con el mismo `reservationId` y mismo `qty`, no se publica un segundo evento.

---

## Ejercicio 5 — Tests (dominio + use case)

1. Dominio (`BookStock.test.ts`):
   - reserva OK,
   - idempotencia,
   - stock insuficiente,
   - eventos: 1 evento en reserva OK, 0 en llamada idempotente.
2. Use case (`ReserveCopiesUseCase.test.ts`):
   - publica `CopiesReserved`,
   - payload mínimo estable.

Hecho cuando: puedes explicar por qué el contrato se “ancla” en invariantes y eventos, no en tablas/DTOs.

---

## Referencia (para comparar)

- Estado final esperado: `.local/dia-04-referencia/`
- Estado previo (día 3): `.local/dia-03-ejercicios/`
