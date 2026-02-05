# Sesión 4 · Jueves 05-feb-2026  
## Repaso exprés de la Sesión 3

| Tema                    | Insight clave                                                                            | Acción inmediata                                                       |
|-------------------------|------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| **Límites de dominio** | Delimitar inventario vs pedidos evita acoplamiento y modelos inconsistentes.             | En el mini‑dominio (biblioteca), lista qué es “inventario” y qué no (p. ej. “pedido” / “cliente”). |
| **Errores de dominio** | Errores tipados ayudan a mapear contrato y a testear reglas sin infra.                   | Asegura que `Invalid*Error`, `InsufficientStockError`, etc. salen del dominio, no del adaptador HTTP. |
| **VOs e invariantes**  | Un Value Object centraliza validación y hace el modelo expresivo.                         | Revisa `BookId`, `Quantity`, `ReservationId`: ¿hay invariantes duplicadas en controllers/tests? |
| **Aggregate rico**     | El agregado concentra estado + comportamiento, no “setters”.                              | Comprueba que la regla de idempotencia (`reservationId`) vive en `BookStock.reserve(...)`. |
| **Tests por capas**    | Dominio y use cases se testean rápido; la infra se testea aparte.                         | Ejecuta (o revisa) tests de `BookStock` y de `ReserveCopiesUseCase` con dobles. |
