# Sesión 3 · Martes 03-feb-2026  
## Límites de dominio + hexagonal avanzada: contratos, adapters y testing

**Objetivo:** definir límites claros para el dominio de inventario y reforzar la implementación hexagonal (contratos, adapters) con tests unitarios y de integración.

---

## 0. Delimitar el dominio de inventario (bounded context)

Antes de escribir más código, fijamos el límite del servicio. Un inventario suele incluir:

- **Stock disponible** (prometible).
- **Reserva** (bloqueo reversible por pedido).
- **Reposición** (incremento de stock).
- **Movimientos** (auditoría: reserve/release/replenish).

Y suele **excluir** (para evitar mezclar modelos):

- **Precio** y catálogo (otro contexto).
- **Estado de pedido** (otro contexto).
- **Pagos/facturación** (otro contexto).

### 0.1 Heurística rápida de límites

- Si una regla cambia por razones distintas, separa el contexto.
- Si un término cambia de significado (“stock” en logística vs e‑commerce), probablemente hay más de un modelo.
- Si hay *ownership* distinto, separa por límite de propiedad.

### 0.2 Contratos de integración mínimos

- API (sincrónica): consultas puntuales como “GET inventory by sku”.
- Eventos (asíncronos): hechos como `ProductInventoryReserved`, `ProductInventoryReleased`, `ProductInventoryReplenished`.

> En este curso, el `inventory-service` será un bounded context pequeño pero completo, para practicar arquitectura + comunicación.

## 1. Preparación y verificación preliminar

Esta sesión combina dos tipos de trabajo:

1. **Ejemplo local (rápido):** seguimos con el mini‑proyecto de ejercicios (sin DB/broker) para practicar límites, contratos y tests por capas (guía base: `curso/dia-02/04-ejercicios.md`).
2. **Transfer al proyecto (al final):** aplicamos lo mismo en `project/services/inventory-service`.

> Importante: evita invertir tiempo en “hacer que la infra funcione” antes de tener claros los límites y los contratos. En 3h, lo que más rendimiento da es iterar rápido con tests y adaptadores in‑memory.

---

## 2. Ejemplo local: límites, lenguaje ubicuo y contrato (mini‑lab, 20–25 min)

Partimos del ejemplo de **biblioteca** del día 2 (reservas de copias), y lo tratamos como un bounded context “Inventory”:

1. Escribe el **lenguaje ubicuo** mínimo (5–8 términos) y su significado (ej.: “copias disponibles”, “reserva”, “reposición”, “movimiento”, “id de reserva”).
2. Define el límite: qué cosas **entran** y qué cosas **no entran** en este contexto.
3. Decide el contrato mínimo de integración:
   - API (sync): una operación de *reserve*.
   - Evento (async): un `CopiesReserved` (o el nombre que elijáis) con campos mínimos y versionado si aplica.

Resultado esperado: un contrato y un límite que todos en el equipo pueden explicar en 30 segundos.

---

## 3. Testing por capas (sin infra): qué testear y por qué (25–30 min)

En bounded contexts pequeños, la estrategia mínima y rentable es:

- **Dominio (unit):** invariantes y reglas (no hay puertos ni I/O).
- **Aplicación / Use Cases (unit):** orquestación + errores usando dobles de puertos (in‑memory / fakes).
- **Infra (integration):** lo mínimo para confiar en Postgres/broker, sin testear lógica de negocio aquí.

Regla práctica: si para testear una regla tienes que levantar Docker, el test está en la capa equivocada.

---

## 4. Transfer al proyecto: `inventory-service` (últimos 35–45 min)

Cuando el límite y el contrato estén claros en el ejemplo local, los “nombres” cambian pero el patrón es el mismo:

- `BookId` → `SKU` (`project/services/inventory-service/src/domain/value-objects/SKU.ts`)
- Use case de reservar → `ReserveInventoryUseCase` (`project/services/inventory-service/src/application/ReserveInventoryUseCase.ts`)
- Puerto de repo → `ProductInventoryRepositoryPort` (`project/services/inventory-service/src/domain/ports/ProductInventoryRepositoryPort.ts`)

Checklist de transferencia:

1. Revisa que el Use Case solo conoce **puertos** y **dominio** (no Prisma, no HTTP).
2. Asegura que los errores del dominio/aplicación son traducibles a contrato (400/404/409).
3. Añade (o ajusta) tests rápidos en `project/services/inventory-service/src/__tests__/` que cubran:
   - caso OK (reserva con stock),
   - caso KO (sin stock / producto no existe).
