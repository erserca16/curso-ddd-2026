# Avance del proyecto · Sesión 6 — CQRS en Inventory

**En sesión (40 min) + trabajo en casa**

## Meta de hoy

Introducir CQRS de forma incremental: mantener el modelo de escritura “rico” y crear una lectura optimizada (read model) que se actualiza por eventos/proyecciones.

### Tareas sugeridas

1. Definir un caso de uso de escritura (command) y uno de lectura (query)
   - `ReserveInventoryUseCase` (command)
   - `GetInventoryBySkuQuery` (query)
2. Crear un read model mínimo
   - Tabla/colección `inventory_view` con `{ sku, available, updatedAt }`
3. Añadir un proyector
   - Consume eventos de inventario y actualiza `inventory_view`.
4. Ajustar el endpoint de lectura
   - `GET /inventory/:sku` lee desde el read model (o deja una variante `/inventory/:sku/view`).
5. Pruebas
   - Unit tests para comandos y tests de integración para la proyección.
