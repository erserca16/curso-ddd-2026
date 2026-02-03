# Ejercicios — Sesión 3 (límites, contratos y tests)

Objetivo: consolidar **límites de dominio** y la forma de trabajar en Hexagonal (Use Cases + puertos + adaptadores) con una estrategia de tests simple. Lo haremos primero en un ejemplo local (rápido), y al final lo llevaremos al `inventory-service`.

## Contexto (business)

El problema real que estamos modelando es “**prometer stock**”:

- Un cliente quiere comprar (o prestar) algo y necesita saber si hay disponibilidad.
- El sistema debe poder **reservar** unidades de forma temporal (reversible) para evitar sobreventa.
- Esto ocurre dentro de un bounded context de **Inventario** y se integra con otros contextos (Pedidos, Catálogo, Pagos) por **contratos** (API/eventos), no por imports directos.

En el taller usaremos el mini‑dominio “biblioteca” del día 2 como proxy (copias de libros), porque tiene el mismo tipo de reglas que el proyecto (SKU + stock).

> Si no tienes el mini‑proyecto local creado, sigue primero `curso/dia-02/04-ejercicios.md` (setup + estructura).

## Guía de ritmo (3h)

| Tiempo | Actividad | Resultado observable |
|---:|---|---|
| 15 min | Límites + lenguaje ubicuo | Glosario + “qué entra / qué no entra” acordado. |
| 35 min | Contrato (API/evento) + errores | Endpoint + evento con payload mínimo y status/error mapping. |
| 10 min | Descanso | — |
| 40 min | Tests por capas (local) | Tests de dominio + use case con dobles (sin Docker). |
| 35 min | Transfer al proyecto | Tests/ajustes mínimos en `inventory-service` manteniendo DIP. |
| 5 min | Cierre | Checklist y siguientes pasos. |

---

## 1) Ejercicio: bounded context + lenguaje ubicuo (15 min)

En 1 hoja (o en el README local del ejercicio), define:

- 5–8 términos del lenguaje ubicuo (ej.: “reserva”, “disponible”, “reposición”, “movimiento”, “idempotencia”).
- Qué pertenece al contexto “Inventario” y qué no (precio, catálogo, estado del pedido, pagos…).
- Cuál es el contrato de integración mínimo:
  - API sync para reservar.
  - Evento async de “reserva realizada” (con versionado si queréis).

Resultado esperado: el equipo puede explicar el límite sin discutir “implementación”.

---

## 2) Ejercicio: contrato y errores (35 min)

En el mini‑proyecto local (el del día 2), define el contrato de forma explícita:

**HTTP (sync)**

- `POST /book-stock/:bookId/reserve`
  - body: `{ qty, reservationId }`
  - respuestas:
    - `204` si OK
    - `404` si no existe el stock/entidad (según lo modeles)
    - `409` si no hay stock suficiente
    - `400` si el payload es inválido

**Evento (async)**

- `CopiesReserved` (o equivalente)
  - `type`
  - `version` (opcional pero recomendado si hay tiempo)
  - `payload` mínimo: `{ bookId, qty, reservationId, occurredAt }`

Claves a discutir (sin implementar infra):

1. ¿Qué parte del error es “dominio” vs “contrato HTTP”?
2. ¿Qué hacemos con reintentos/idempotencia? (pista: `reservationId`)
3. ¿Qué debe permanecer estable para que otros servicios no se rompan?

---

## 3) Ejercicio: tests por capas (40 min)

Objetivo: tener confianza en reglas y orquestación sin depender de infraestructura.

En el mini‑proyecto local:

1. Tests de **dominio**: invariantes de `BookId` y `Quantity`, y regla de `reserve` (no permitir stock negativo).
2. Tests de **use case**: `ReserveCopiesUseCase` usando dobles (repo in‑memory + publisher in‑memory).

Hecho cuando:

- `npm test` pasa sin Docker.
- Puedes ejecutar `npm run dev` y probar el endpoint con `curl`.

---

## 4) Transfer (35 min): `inventory-service` con el mismo enfoque

Objetivo: aplicar el mismo patrón al proyecto real sin introducir acoplamientos.

Puntos de entrada (lectura y “micro‑refactor”):

- `project/services/inventory-service/src/domain/value-objects/SKU.ts`
- `project/services/inventory-service/src/application/ReserveInventoryUseCase.ts`
- `project/services/inventory-service/src/domain/ports/ProductInventoryRepositoryPort.ts`

Checklist:

1. El Use Case no importa nada de HTTP/Prisma: solo dominio + puertos.
2. Añade/ajusta un test rápido que cubra:
   - “producto no existe” → error traducible a `404`
   - “no hay stock suficiente” → error traducible a `409`
3. Revisa que el adaptador HTTP se limita a:
   - validar forma,
   - llamar al Use Case,
   - mapear error → status code.
